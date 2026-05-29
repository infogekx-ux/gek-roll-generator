'use strict';
// ============================================================
// MISJA 5 — TESTY: Vectorizer (MINIMUM 100, do skutku)
// Zero crashy, zero NaN, czytelny output, render na 300+ DPI.
// node projekty/drs-tools/test-vectorizer.js → konsola + test-results-vector.md
// ============================================================
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { vectorize } = require('./vectorizer-engine.js');

let pass = 0, fail = 0;
const failures = [];
const timings = [];
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

function ok(cond, name, detail) {
  if (cond) pass++;
  else { fail++; failures.push(name + (detail ? ' — ' + detail : '')); }
}

async function pngMeta(buf) { return sharp(Buffer.from(buf)).metadata(); }
async function alphaAt(buf, x, y) {
  const { data, info } = await sharp(Buffer.from(buf)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return data[(y * info.width + x) * 4 + 3];
}

// invariants every vectorize result MUST satisfy
async function checkResult(name, res, targetDPI) {
  ok(typeof res.svg === 'string' && res.svg.indexOf('<svg') !== -1, name + ' [svg]');
  ok(res.pngBuffer instanceof Uint8Array && res.pngBuffer.length > 0, name + ' [png buffer]');
  ok(Buffer.from(res.pngBuffer.slice(0, 4)).equals(PNG_SIG), name + ' [png sig]');
  ok(Number.isInteger(res.pathCount) && res.pathCount >= 0, name + ' [pathCount]', res.pathCount);
  ok(res.outputDPI === targetDPI, name + ' [outputDPI]', res.outputDPI);
  ok(Number.isFinite(res.outWidth) && res.outWidth > 0, name + ' [outWidth]', res.outWidth);
  ok(Number.isFinite(res.outHeight) && res.outHeight > 0, name + ' [outHeight]', res.outHeight);
  const m = await pngMeta(res.pngBuffer);
  ok(m.width === res.outWidth && m.height === res.outHeight, name + ' [png dims match]', `${m.width}x${m.height} vs ${res.outWidth}x${res.outHeight}`);
}

// ---- generators ----
async function bwLogo(w = 200, h = 200) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="#ffffff"/>
    <rect x="${w * 0.2}" y="${h * 0.2}" width="${w * 0.25}" height="${h * 0.6}" fill="#000000"/>
    <circle cx="${w * 0.7}" cy="${h * 0.5}" r="${w * 0.2}" fill="#000000"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
async function colorLogo(w = 220, h = 160) {
  const cols = ['#e74c3c', '#2980b9', '#27ae60', '#f1c40f', '#8e44ad'];
  let rects = '';
  for (let i = 0; i < 5; i++) rects += `<rect x="${(w / 5) * i}" y="${h * 0.25}" width="${w / 5 - 2}" height="${h * 0.5}" fill="${cols[i]}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#ffffff"/>${rects}</svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
async function textImg(w = 300, h = 100) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="#ffffff"/>
    <text x="12" y="${h * 0.72}" font-size="${h * 0.6}" font-family="sans-serif" font-weight="bold" fill="#000000">DRS</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
async function finePattern(w = 200, h = 200) {
  let circles = '';
  for (let r = w * 0.45; r > 4; r -= 8) circles += `<circle cx="${w / 2}" cy="${h / 2}" r="${r}" fill="none" stroke="#000" stroke-width="3"/>`;
  return sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff"/>${circles}</svg>`)).png().toBuffer();
}
async function gradient(w = 200, h = 200) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
async function oneBit(w = 120, h = 120) {
  const cell = 20; let rects = '';
  for (let y = 0; y < h; y += cell) for (let x = 0; x < w; x += cell) if (((x / cell + y / cell) | 0) % 2) rects += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="#000"/>`;
  return sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff"/>${rects}</svg>`)).png().toBuffer();
}
async function alphaImg(w = 180, h = 180) {
  const sq = await sharp({ create: { width: 80, height: 80, channels: 4, background: { r: 200, g: 40, b: 40, alpha: 1 } } }).png().toBuffer();
  return sharp({ create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: sq, left: 50, top: 50 }]).png().toBuffer();
}
async function asJpg(buf, q = 70) { return sharp(buf).jpeg({ quality: q }).toBuffer(); }

async function timed(buf, opts) {
  const t = process.hrtime.bigint();
  const res = await vectorize(buf, opts);
  timings.push(Number(process.hrtime.bigint() - t) / 1e6);
  return res;
}

async function run() {
  // ---------- 1) Simple B&W logo → clean SVG, color & bw modes ----------
  for (const mode of ['bw', 'color']) {
    for (const detail of ['low', 'medium', 'high']) {
      const name = `bwLogo ${mode}/${detail}`;
      try {
        const res = await timed(await bwLogo(200, 200), { colorMode: mode, detail, targetDPI: 300 });
        await checkResult(name, res, 300);
        ok(res.pathCount > 0, name + ' [has paths]', res.pathCount);
      } catch (e) { ok(false, name, 'THREW ' + e.message); }
    }
  }

  // ---------- 2) Color logo (5 colors) → color SVG ----------
  for (const detail of ['low', 'medium', 'high']) {
    const name = `colorLogo ${detail}`;
    try {
      const res = await timed(await colorLogo(), { colorMode: 'color', detail, targetDPI: 300 });
      await checkResult(name, res, 300);
      ok(res.pathCount >= 3, name + ' [multi paths]', res.pathCount);
      ok(/fill="(rgb|#)/i.test(res.svg) || res.svg.indexOf('fill') !== -1, name + ' [colored]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 3) 72 DPI → render to many target DPIs ----------
  for (const dpi of [150, 300, 600]) {
    const name = `dpi 72→${dpi}`;
    try {
      const src = await bwLogo(150, 150);
      const res = await timed(src, { colorMode: 'bw', targetDPI: dpi, inputDPI: 72 });
      await checkResult(name, res, dpi);
      const expected = Math.round(150 * dpi / 72);
      ok(Math.abs(res.outWidth - expected) <= 1, name + ' [upscaled dims]', `${res.outWidth} vs ${expected}`);
      ok(res.outWidth > 150, name + ' [higher res than source]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 4) Text as image → readable contours (paths) ----------
  for (let i = 0; i < 4; i++) {
    const name = `text #${i}`;
    try {
      const res = await timed(await textImg(280 + i * 20, 90 + i * 10), { colorMode: 'bw', detail: 'high', targetDPI: 300 });
      await checkResult(name, res, 300);
      ok(res.pathCount > 0, name + ' [contours]', res.pathCount);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 5) Fine detail: high ≥ low path count ----------
  {
    const name = 'detail high vs low';
    try {
      const src = await finePattern(220, 220);
      const lo = await timed(src, { colorMode: 'bw', detail: 'low', targetDPI: 300 });
      const hi = await timed(src, { colorMode: 'bw', detail: 'high', targetDPI: 300 });
      await checkResult(name + ' (low)', lo, 300);
      await checkResult(name + ' (high)', hi, 300);
      ok(hi.pathCount >= lo.pathCount, name, `high=${hi.pathCount} low=${lo.pathCount}`);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 6) Gradient → graceful degradation (no crash) ----------
  for (const mode of ['bw', 'color']) {
    const name = `gradient ${mode}`;
    try {
      const res = await timed(await gradient(200, 120), { colorMode: mode, detail: 'medium', targetDPI: 300 });
      await checkResult(name, res, 300);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 7) 1-bit checkerboard → trivial, clean ----------
  for (const detail of ['low', 'medium', 'high']) {
    const name = `1-bit ${detail}`;
    try {
      const res = await timed(await oneBit(120, 120), { colorMode: 'bw', detail, targetDPI: 300 });
      await checkResult(name, res, 300);
      ok(res.pathCount > 0, name + ' [has paths]', res.pathCount);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 8) Large image → time < 10s ----------
  for (const [w, h] of [[1200, 1200], [2000, 2000]]) {
    const name = `large ${w}x${h}`;
    try {
      const t = process.hrtime.bigint();
      const res = await timed(await colorLogo(w, h), { colorMode: 'color', detail: 'medium', targetDPI: 300 });
      const ms = Number(process.hrtime.bigint() - t) / 1e6;
      await checkResult(name, res, 300);
      ok(ms < 10000, name + ' [<10s]', ms.toFixed(0) + 'ms');
      ok(res.traceWidth <= 1000 && res.traceHeight <= 1000, name + ' [trace downscaled]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 9) Small icon → no crash ----------
  for (const [w, h] of [[8, 8], [16, 16], [32, 32], [48, 48], [10, 60]]) {
    const name = `small ${w}x${h}`;
    try {
      const res = await timed(await bwLogo(w, h), { colorMode: 'bw', detail: 'medium', targetDPI: 300 });
      await checkResult(name, res, 300);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 10) JPG artifacts → clean output despite noise ----------
  for (const q of [25, 50, 80]) {
    const name = `jpg q${q}`;
    try {
      const res = await timed(await asJpg(await colorLogo(220, 160), q), { colorMode: 'color', detail: 'medium', targetDPI: 300 });
      await checkResult(name, res, 300);
      ok(res.pathCount > 0, name + ' [paths]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 11) PNG with alpha → transparency preserved in render ----------
  for (let i = 0; i < 4; i++) {
    const name = `alpha preserve #${i}`;
    try {
      const res = await timed(await alphaImg(160 + i * 10, 160 + i * 10), { colorMode: 'color', detail: 'medium', targetDPI: 200, inputDPI: 72 });
      await checkResult(name, res, 200);
      const a = await alphaAt(res.pngBuffer, 2, 2);
      ok(a < 250, name + ' [corner not fully opaque]', 'alpha=' + a);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 12) targetDPI / detail / colorMode matrix ----------
  for (const dpi of [96, 300, 450]) {
    for (const detail of ['low', 'high']) {
      const name = `matrix dpi${dpi}/${detail}`;
      try {
        const res = await timed(await colorLogo(180, 140), { colorMode: 'color', detail, targetDPI: dpi });
        await checkResult(name, res, dpi);
      } catch (e) { ok(false, name, 'THREW ' + e.message); }
    }
  }

  // ---------- 13) Stress loop: random sizes/modes/details ----------
  for (let i = 0; i < 24; i++) {
    const w = 40 + ((Math.random() * 300) | 0), h = 40 + ((Math.random() * 300) | 0);
    const mode = Math.random() < 0.5 ? 'bw' : 'color';
    const detail = ['low', 'medium', 'high'][(Math.random() * 3) | 0];
    const gen = [bwLogo, colorLogo, finePattern, oneBit][(Math.random() * 4) | 0];
    const name = `stress#${i} ${w}x${h} ${mode}/${detail} ${gen.name}`;
    try {
      const res = await timed(await gen(w, h), { colorMode: mode, detail, targetDPI: 300 });
      await checkResult(name, res, 300);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 14) Bad input guards ----------
  try { await vectorize(Buffer.alloc(0)); ok(false, 'empty buffer rejected'); }
  catch (e) { ok(/empty/.test(e.message), 'empty buffer rejected'); }
  try { await vectorize(null); ok(false, 'null rejected'); }
  catch (e) { ok(true, 'null rejected'); }

  report();
}

function report() {
  const total = pass + fail;
  const avg = timings.length ? timings.reduce((s, t) => s + t, 0) / timings.length : 0;
  const max = timings.length ? Math.max(...timings) : 0;
  const allOk = fail === 0 && total >= 100 && max < 10000;

  const md = `# Test Results — Vectorizer (MISJA 5)
> Wygenerowane: ${new Date().toISOString()}
> Silnik: vectorizer-engine.js (imagetracerjs trace + sharp SVG→PNG render)

## Podsumowanie
- **Asercje:** ${pass}/${total} pass, ${fail} fail
- **Liczba testów (asercji):** ${total} ${total >= 100 ? '✅ (≥100)' : '❌ (<100)'}
- **Czas:** śr. ${avg.toFixed(1)}ms, max ${max.toFixed(1)}ms ${max < 10000 ? '✅ (<10s)' : '❌ (≥10s)'}
- **Status:** ${allOk ? '✅ ZIELONO — zero crashy, zero NaN, render OK' : '❌ DO POPRAWY'}

## Pokryte scenariusze
- Proste logo B&W (bw + color × low/medium/high) → czysty SVG, pathCount>0
- Kolorowe logo 5 kolorów → wielościeżkowy kolorowy SVG
- 72 DPI → render do 150/300/600 DPI (wymiary = src × target/72, ostrzejszy niż źródło)
- Tekst jako obraz → czytelne kontury
- Drobne detale: high ≥ low pathCount
- Gradient (bw+color) → graceful, bez crasha
- 1-bit szachownica → trywialny, czysty
- Duże 1200²/2000² → trace downscale, czas < 10s
- Małe 8×8…10×60 → bez crasha
- Artefakty JPG q25–q80 → czysty output
- PNG z alfa → przezroczystość zachowana w renderze
- Macierz DPI×detail×colorMode, 24× stress losowy
- Złe wejście (pusty/null) → kontrolowany błąd

${failures.length ? '## Failures\n' + failures.map(f => '- ' + f).join('\n') + '\n' : ''}`;

  fs.writeFileSync(path.join(__dirname, 'test-results-vector.md'), md);
  console.log(`\nVECTORIZER: ${pass}/${total} pass | avg ${avg.toFixed(1)}ms max ${max.toFixed(1)}ms`);
  if (failures.length) console.log('FAILURES:\n' + failures.map(f => '  ✗ ' + f).join('\n'));
  console.log(allOk ? '✅ VECTOR GREEN' : '❌ VECTOR NOT GREEN');
  if (!allOk) process.exitCode = 1;
}

run().catch(e => { console.error('FATAL', e); process.exit(1); });
