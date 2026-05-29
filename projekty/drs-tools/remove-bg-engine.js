'use strict';
// ============================================================
// MISJA 5 — SILNIK 1: Background Removal (standalone, server-side)
// Zasada #13: mózg na serwerze. Zero algorytmu w przeglądarce.
//
// Level 3 autodetect:
//   - solidne tło  → threshold removal (szybki, <100ms)
//   - złożone tło  → border flood-fill (connected-region, non-AI fallback)
//   - mode 'ai'    → hook na zewnętrzny/edge AI backend (Faza 2). Bez modelu
//                    w standalone robi best-effort flood + confidence niski.
//
// API:
//   removeBg(imageBuffer, { tolerance=30, mode='auto'|'simple'|'ai' })
//     → { resultBuffer (PNG+alpha), method, bgColor:'#rrggbb',
//         confidence:0..1, changed, width, height }
// ============================================================
const sharp = require('sharp');

// max-channel (Chebyshev) distance — intuicyjne na skali 0–255.
function colorClose(data, i, r, g, b, tol) {
  const dr = data[i] - r, dg = data[i + 1] - g, db = data[i + 2] - b;
  return Math.max(Math.abs(dr), Math.abs(dg), Math.abs(db)) <= tol;
}

function toHex(r, g, b) {
  const h = (n) => Math.max(0, Math.min(255, n | 0)).toString(16).padStart(2, '0');
  return '#' + h(r) + h(g) + h(b);
}

// Próbkuj ramkę (corners + krawędzie), wyznacz dominujący kolor tła + jego udział.
// solid = udział >= 0.80  → jednolite tło.
function analyzeBorder(data, w, h, ch, tol) {
  const t = Math.max(1, Math.min(2, Math.floor(Math.min(w, h) / 20))); // grubość ringu
  const buckets = new Map(); // klucz: r>>3,g>>3,b>>3 → {n,r,g,b,a}
  let borderTransparent = 0;
  const samples = [];
  const step = Math.max(1, Math.floor((2 * (w + h)) / 4000)); // limit próbek

  const push = (x, y) => {
    const i = (y * w + x) * ch;
    const a = ch === 4 ? data[i + 3] : 255;
    if (a < 16) { borderTransparent++; return; }
    samples.push(i);
    const key = ((data[i] >> 3) << 10) | ((data[i + 1] >> 3) << 5) | (data[i + 2] >> 3);
    let bkt = buckets.get(key);
    if (!bkt) { bkt = { n: 0, r: 0, g: 0, b: 0 }; buckets.set(key, bkt); }
    bkt.n++; bkt.r += data[i]; bkt.g += data[i + 1]; bkt.b += data[i + 2];
  };

  for (let y = 0; y < h; y += step) {
    for (let k = 0; k < t; k++) { push(k, y); push(w - 1 - k, y); }
  }
  for (let x = 0; x < w; x += step) {
    for (let k = 0; k < t; k++) { push(x, k); push(x, h - 1 - k); }
  }

  const totalBorder = samples.length + borderTransparent;
  if (samples.length === 0) {
    // cała ramka przezroczysta → tło już usunięte
    return { bg: [0, 0, 0], fraction: 1, solid: false, alreadyTransparent: true,
      borderTransparentFrac: 1 };
  }

  let best = null;
  for (const bkt of buckets.values()) if (!best || bkt.n > best.n) best = bkt;
  const bg = [Math.round(best.r / best.n), Math.round(best.g / best.n), Math.round(best.b / best.n)];

  let within = 0;
  for (const i of samples) if (colorClose(data, i, bg[0], bg[1], bg[2], tol)) within++;
  const fraction = within / samples.length;

  return {
    bg,
    fraction,
    solid: fraction >= 0.80,
    alreadyTransparent: false,
    borderTransparentFrac: borderTransparent / totalBorder,
  };
}

// Threshold: każdy piksel w tolerancji od bg → alfa 0. Szybki, dla jednolitych teł.
// Cienie/obiekty w innym kolorze zostają nietknięte.
function thresholdRemove(data, w, h, ch, bg, tol) {
  let removed = 0;
  const n = w * h;
  for (let p = 0; p < n; p++) {
    const i = p * ch;
    if (colorClose(data, i, bg[0], bg[1], bg[2], tol)) { data[i + 3] = 0; removed++; }
  }
  return removed;
}

// Flood-fill od ramki: usuwa TYLKO tło połączone z krawędzią i bliskie kolorystycznie.
// Nie tnie pikseli tego samego koloru WEWNĄTRZ obiektu (kluczowa różnica vs threshold).
function floodRemove(data, w, h, ch, bg, tol) {
  const n = w * h;
  const visited = new Uint8Array(n);
  const stack = [];
  const pushIf = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (visited[p]) return;
    visited[p] = 1;
    if (colorClose(data, p * ch, bg[0], bg[1], bg[2], tol)) stack.push(p);
  };
  for (let x = 0; x < w; x++) { pushIf(x, 0); pushIf(x, h - 1); }
  for (let y = 0; y < h; y++) { pushIf(0, y); pushIf(w - 1, y); }
  let removed = 0;
  while (stack.length) {
    const p = stack.pop();
    data[p * ch + 3] = 0; removed++;
    const x = p % w, y = (p / w) | 0;
    pushIf(x - 1, y); pushIf(x + 1, y); pushIf(x, y - 1); pushIf(x, y + 1);
  }
  return removed;
}

async function removeBg(imageBuffer, options = {}) {
  if (!imageBuffer || imageBuffer.length === 0) throw new Error('removeBg: empty input buffer');
  const tolerance = Number.isFinite(options.tolerance) ? options.tolerance : 30;
  const mode = options.mode || 'auto';

  const meta = await sharp(imageBuffer).metadata();
  // .rotate() (no args) auto-applies EXIF orientation — phone photos / screenshots
  // often carry orientation 6/8; without this the result comes out sideways.
  const { data, info } = await sharp(imageBuffer)
    .rotate()
    .toColourspace('srgb')   // CMYK / 16-bit / palette → 8-bit sRGB (real-world inputs)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, ch = info.channels; // ch=4

  const analysis = analyzeBorder(data, w, h, ch, tolerance);

  // Tło już usunięte (PNG z dużą przezroczystością na ramce) → nie ruszaj.
  if (mode === 'auto' && (analysis.alreadyTransparent || analysis.borderTransparentFrac > 0.6)) {
    const out = await sharp(Buffer.from(data), { raw: { width: w, height: h, channels: 4 } })
      .png().toBuffer();
    return { resultBuffer: out, method: 'threshold', bgColor: toHex(...analysis.bg),
      confidence: 0.99, changed: false, width: w, height: h };
  }

  let method;
  if (mode === 'simple') method = 'threshold';
  else if (mode === 'flood') method = 'flood';
  else if (mode === 'ai') method = 'ai';
  else method = analysis.solid ? 'threshold' : 'flood';

  let removed;
  if (method === 'threshold') removed = thresholdRemove(data, w, h, ch, analysis.bg, tolerance);
  else removed = floodRemove(data, w, h, ch, analysis.bg, tolerance); // 'flood' i 'ai' best-effort

  const out = await sharp(Buffer.from(data), { raw: { width: w, height: h, channels: 4 } })
    .png().toBuffer();

  // confidence: jak pewni jesteśmy że to było tło do usunięcia
  let confidence;
  if (method === 'threshold') confidence = analysis.fraction;
  else if (method === 'flood') confidence = Math.max(0.5, analysis.fraction);
  else confidence = 0.4; // 'ai' bez prawdziwego modelu w standalone

  return {
    resultBuffer: out,
    method,
    bgColor: toHex(analysis.bg[0], analysis.bg[1], analysis.bg[2]),
    confidence: Math.round(confidence * 100) / 100,
    changed: removed > 0,
    removedPixels: removed,
    width: w, height: h,
    inputFormat: meta.format || 'unknown',
  };
}

// Detekcja tła bez usuwania — dla orkiestratora (auto: solid→threshold, complex→AI).
async function detectBackground(imageBuffer, tolerance = 30) {
  if (!imageBuffer || imageBuffer.length === 0) throw new Error('detectBackground: empty input');
  const { data, info } = await sharp(imageBuffer).rotate().toColourspace('srgb').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const a = analyzeBorder(data, info.width, info.height, info.channels, tolerance);
  return {
    solid: a.solid,
    complex: !a.solid && !a.alreadyTransparent,
    bgColor: toHex(a.bg[0], a.bg[1], a.bg[2]),
    fraction: Math.round(a.fraction * 100) / 100,
    alreadyTransparent: a.alreadyTransparent || a.borderTransparentFrac > 0.6,
    width: info.width, height: info.height,
  };
}

module.exports = { removeBg, detectBackground, analyzeBorder, _internals: { colorClose, thresholdRemove, floodRemove, toHex } };
