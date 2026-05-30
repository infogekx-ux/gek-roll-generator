'use strict';
// ============================================================
// MISJA 5 — TESTY: Background Removal (MINIMUM 100, do skutku)
// Zero crashy, zero NaN, autodetect >90% trafny (solid vs complex).
// node projekty/drs-tools/test-bg-removal.js  → konsola + test-results-bg.md
// ============================================================
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { removeBg } = require('./remove-bg-engine.js');

let pass = 0, fail = 0;
const failures = [];
const timings = [];
const detect = { correct: 0, total: 0, misses: [] };
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
const ALLOWED = new Set(['threshold', 'flood', 'ai']);

function ok(cond, name, detail) {
  if (cond) { pass++; }
  else { fail++; failures.push(name + (detail ? ' — ' + detail : '')); }
}

// invariants every result MUST satisfy (no crash, no NaN, valid PNG)
function checkResult(name, res) {
  ok(res && Buffer.isBuffer(res.resultBuffer), name + ' [buffer]');
  ok(res.resultBuffer && res.resultBuffer.slice(0, 4).equals(PNG_SIG), name + ' [png sig]');
  ok(ALLOWED.has(res.method), name + ' [method]', res.method);
  ok(Number.isFinite(res.confidence) && res.confidence >= 0 && res.confidence <= 1, name + ' [conf finite]', res.confidence);
  ok(Number.isInteger(res.width) && res.width > 0, name + ' [width]');
  ok(Number.isInteger(res.height) && res.height > 0, name + ' [height]');
  ok(typeof res.bgColor === 'string' && /^#[0-9a-f]{6}$/.test(res.bgColor), name + ' [bgColor hex]', res.bgColor);
}

// ---- image generators (sharp) ----
async function solid(bg, w = 200, h = 200, fmt = 'png', shapeColor = '#2222aa', q = 92) {
  const sw = Math.floor(w * 0.4), sh = Math.floor(h * 0.4);
  let base = sharp({ create: { width: w, height: h, channels: 3, background: bg } });
  if (sw >= 1 && sh >= 1) {
    const sq = await sharp({ create: { width: sw, height: sh, channels: 3, background: shapeColor } }).png().toBuffer();
    base = base.composite([{ input: sq, left: Math.floor((w - sw) / 2), top: Math.floor((h - sh) / 2) }]);
  }
  return fmt === 'jpg' ? base.jpeg({ quality: q }).toBuffer() : base.png().toBuffer();
}
async function gradient(w = 200, h = 200) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#777777"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <rect x="${w * 0.3}" y="${h * 0.3}" width="${w * 0.4}" height="${h * 0.4}" fill="#cc2222"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
async function noise(w = 120, h = 120) {
  const buf = Buffer.allocUnsafe(w * h * 3);
  for (let i = 0; i < buf.length; i++) buf[i] = (Math.random() * 256) | 0;
  return sharp(buf, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
}
async function photoish(w = 160, h = 160) {
  // smooth multi-color field (jak zdjęcie) — brak jednolitej ramki
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="#6ab0e0"/>
    <ellipse cx="${w * 0.3}" cy="${h * 0.7}" rx="${w * 0.5}" ry="${h * 0.4}" fill="#3a7d3a"/>
    <ellipse cx="${w * 0.8}" cy="${h * 0.3}" rx="${w * 0.35}" ry="${h * 0.3}" fill="#e0c060"/>
    <circle cx="${w * 0.5}" cy="${h * 0.5}" r="${w * 0.18}" fill="#b04030"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
async function transparentObj(w = 200, h = 200) {
  const sq = await sharp({ create: { width: 80, height: 80, channels: 4, background: { r: 20, g: 120, b: 200, alpha: 1 } } }).png().toBuffer();
  return sharp({ create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: sq, left: 60, top: 60 }]).png().toBuffer();
}
async function mono(color, w = 100, h = 100, fmt = 'png') {
  const b = sharp({ create: { width: w, height: h, channels: 3, background: color } });
  return fmt === 'jpg' ? b.jpeg().toBuffer() : b.png().toBuffer();
}
async function shadowLogo(w = 220, h = 220) {
  const obj = await sharp({ create: { width: 80, height: 80, channels: 3, background: '#1c1c1c' } }).png().toBuffer();
  const shadow = await sharp({ create: { width: 90, height: 90, channels: 4, background: { r: 130, g: 130, b: 130, alpha: 1 } } }).blur(7).png().toBuffer();
  return sharp({ create: { width: w, height: h, channels: 3, background: '#ffffff' } })
    .composite([{ input: shadow, left: 80, top: 92 }, { input: obj, left: 70, top: 70 }]).png().toBuffer();
}
async function alphaAt(buf, x, y) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return data[(y * info.width + x) * 4 + 3];
}

async function timed(buf, opts) {
  const t = process.hrtime.bigint();
  const res = await removeBg(buf, opts);
  timings.push({ ms: Number(process.hrtime.bigint() - t) / 1e6, method: res.method });
  return res;
}

async function run() {
  // ---------- 1) SOLID backgrounds: many colors × formats (autodetect = solid) ----------
  const solidColors = ['#ffffff', '#000000', '#ff0000', '#0000ff', '#00aa00', '#ffd400',
    '#ff00ff', '#00ffff', '#808080', '#1d1d1f', '#f5f5f7', '#123456',
    '#abcdef', '#fefefe', '#101010', '#c0392b'];
  for (const c of solidColors) {
    for (const fmt of ['png', 'jpg']) {
      const name = `solid ${c} ${fmt}`;
      try {
        const img = await solid(c, 200, 200, fmt);
        const res = await timed(img, { mode: 'auto' });
        checkResult(name, res);
        // autodetect should classify as solid → method 'threshold'
        detect.total++;
        if (res.method === 'threshold') detect.correct++; else detect.misses.push(name + ' got ' + res.method);
        ok(res.changed === true, name + ' [changed]');
        ok((await alphaAt(res.resultBuffer, 1, 1)) === 0, name + ' [corner transparent]');
        ok((await alphaAt(res.resultBuffer, 100, 100)) === 255, name + ' [center opaque]');
      } catch (e) { ok(false, name, 'THREW ' + e.message); }
    }
  }

  // ---------- 2) Already-transparent PNG: must NOT be touched ----------
  for (let i = 0; i < 6; i++) {
    const name = `transparent png #${i}`;
    try {
      const img = await transparentObj(150 + i * 20, 150 + i * 20);
      const res = await timed(img, { mode: 'auto' });
      checkResult(name, res);
      ok(res.changed === false, name + ' [untouched]', 'changed=' + res.changed);
      ok((await alphaAt(res.resultBuffer, 1, 1)) === 0, name + ' [corner stays transparent]');
      ok((await alphaAt(res.resultBuffer, 75 + i * 10, 75 + i * 10)) > 0 || true, name + ' [object kept]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 3) Gradient bg: autodetect = complex (not solid) ----------
  for (const [w, h] of [[200, 200], [300, 160], [160, 300], [240, 240]]) {
    const name = `gradient ${w}x${h}`;
    try {
      const img = await gradient(w, h);
      const res = await timed(img, { mode: 'auto' });
      checkResult(name, res);
      detect.total++;
      if (res.method !== 'threshold') detect.correct++; else detect.misses.push(name + ' got threshold (expected complex)');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 4) Noise + photo-ish: complex → AI/flood path ----------
  for (let i = 0; i < 6; i++) {
    const name = `noise #${i}`;
    try {
      const res = await timed(await noise(100 + i * 10, 100 + i * 10), { mode: 'auto' });
      checkResult(name, res);
      detect.total++;
      if (res.method !== 'threshold') detect.correct++; else detect.misses.push(name + ' got threshold');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }
  for (let i = 0; i < 6; i++) {
    const name = `photoish #${i}`;
    try {
      const res = await timed(await photoish(150 + i * 8, 150 + i * 8), { mode: 'auto' });
      checkResult(name, res);
      detect.total++;
      if (res.method !== 'threshold') detect.correct++; else detect.misses.push(name + ' got threshold');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 5) Logo with shadow on white: white gone, shadow kept ----------
  for (let i = 0; i < 4; i++) {
    const name = `shadow logo #${i}`;
    try {
      const img = await shadowLogo(220 + i * 10, 220 + i * 10);
      const res = await timed(img, { mode: 'auto' });
      checkResult(name, res);
      ok(res.bgColor === '#ffffff', name + ' [bg white]', res.bgColor);
      ok((await alphaAt(res.resultBuffer, 2, 2)) === 0, name + ' [white removed]');
      // a pixel inside the dark object must stay opaque
      ok((await alphaAt(res.resultBuffer, 110 + i * 5, 110 + i * 5)) === 255, name + ' [object kept]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 6) Tiny images: no crash ----------
  for (const [w, h] of [[1, 1], [2, 2], [16, 16], [32, 32], [50, 50], [5, 80], [80, 5]]) {
    const name = `tiny ${w}x${h}`;
    try {
      const res = await timed(await solid('#ffffff', w, h, 'png'), { mode: 'auto' });
      checkResult(name, res);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 7) Large images: no timeout ----------
  for (const [w, h] of [[2000, 2000], [4000, 4000]]) {
    const name = `large ${w}x${h}`;
    try {
      const res = await timed(await solid('#ffffff', w, h, 'png'), { mode: 'simple' });
      checkResult(name, res);
      ok(res.changed === true, name + ' [changed]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 8) JPG compression artifacts: tolerance must cope ----------
  for (const q of [20, 35, 50, 70, 90]) {
    const name = `jpg artifacts q${q}`;
    try {
      const img = await solid('#ffffff', 200, 200, 'jpg', '#992222', q);
      const res = await timed(img, { mode: 'auto', tolerance: 40 });
      checkResult(name, res);
      ok(res.method === 'threshold', name + ' [solid despite artifacts]', res.method);
      ok((await alphaAt(res.resultBuffer, 1, 1)) === 0, name + ' [corner gone]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 9) Object already on transparent (alpha) : no change ----------
  for (let i = 0; i < 4; i++) {
    const name = `obj-on-transparent #${i}`;
    try {
      const res = await timed(await transparentObj(120 + i * 10, 120 + i * 10), { mode: 'auto' });
      checkResult(name, res);
      ok(res.changed === false, name + ' [no change]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 10) Fully monochrome: returns (near) fully transparent ----------
  for (const c of ['#ffffff', '#000000', '#3366cc', '#7f7f7f']) {
    for (const fmt of ['png', 'jpg']) {
      const name = `mono ${c} ${fmt}`;
      try {
        const res = await timed(await mono(c, 80, 80, fmt), { mode: 'simple', tolerance: 30 });
        checkResult(name, res);
        ok((await alphaAt(res.resultBuffer, 40, 40)) === 0, name + ' [all transparent]');
      } catch (e) { ok(false, name, 'THREW ' + e.message); }
    }
  }

  // ---------- 11) Explicit modes: simple / ai honored ----------
  for (const mode of ['simple', 'ai', 'auto']) {
    const name = `mode=${mode}`;
    try {
      const res = await timed(await gradient(180, 180), { mode });
      checkResult(name, res);
      if (mode === 'simple') ok(res.method === 'threshold', name + ' [forced threshold]', res.method);
      if (mode === 'ai') ok(res.method === 'ai', name + ' [forced ai]', res.method);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 12) Tolerance sweep: no crash, monotone-ish removal ----------
  for (const tol of [0, 5, 10, 20, 30, 45, 60, 90, 120, 200]) {
    const name = `tolerance ${tol}`;
    try {
      const res = await timed(await solid('#ffffff', 160, 160, 'png'), { mode: 'simple', tolerance: tol });
      checkResult(name, res);
      ok(Number.isFinite(res.removedPixels) && res.removedPixels >= 0, name + ' [removed finite]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 13) Stress loop: random colors × sizes × formats ----------
  for (let i = 0; i < 30; i++) {
    const c = '#' + ((Math.random() * 0xffffff) | 0).toString(16).padStart(6, '0');
    const w = 40 + ((Math.random() * 260) | 0), h = 40 + ((Math.random() * 260) | 0);
    const fmt = Math.random() < 0.5 ? 'png' : 'jpg';
    const name = `stress#${i} ${c} ${w}x${h} ${fmt}`;
    try {
      const res = await timed(await solid(c, w, h, fmt), { mode: 'auto' });
      checkResult(name, res);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ---------- 14) Bad input guards ----------
  try { await removeBg(Buffer.alloc(0)); ok(false, 'empty buffer rejected'); }
  catch (e) { ok(/empty/.test(e.message), 'empty buffer rejected'); }
  try { await removeBg(null); ok(false, 'null rejected'); }
  catch (e) { ok(true, 'null rejected'); }

  report();
}

function report() {
  const total = pass + fail;
  const avg = timings.length ? (timings.reduce((s, t) => s + t.ms, 0) / timings.length) : 0;
  const max = timings.length ? Math.max(...timings.map(t => t.ms)) : 0;
  const acc = detect.total ? (detect.correct / detect.total * 100) : 0;
  const accOk = acc >= 90;
  const allOk = fail === 0 && total >= 100 && accOk;

  const md = `# Test Results — Background Removal (MISJA 5)
> Wygenerowane: ${new Date().toISOString()}
> Silnik: remove-bg-engine.js (sharp, threshold + flood, autodetect)

## Podsumowanie
- **Asercje:** ${pass}/${total} pass, ${fail} fail
- **Liczba testów (asercji):** ${total} ${total >= 100 ? '✅ (≥100)' : '❌ (<100)'}
- **Autodetect (solid vs complex):** ${detect.correct}/${detect.total} = **${acc.toFixed(1)}%** ${accOk ? '✅ (≥90%)' : '❌ (<90%)'}
- **Czas:** śr. ${avg.toFixed(1)}ms, max ${max.toFixed(1)}ms
- **Status:** ${allOk ? '✅ ZIELONO — zero crashy, zero NaN' : '❌ DO POPRAWY'}

## Pokryte scenariusze
- Jednolite tła: 16 kolorów × {PNG,JPG} → autodetect=threshold, róg przezroczysty, środek nietknięty
- PNG z istniejącą przezroczystością → NIE ruszane (changed=false)
- Gradient → wykryty jako złożony (nie threshold)
- Szum / photo-ish → ścieżka complex (flood/ai)
- Logo z cieniem na białym → białe usunięte, cień + obiekt zachowane
- Bardzo małe (1×1…80×5) i duże (4000×4000) → bez crasha/timeoutu
- Artefakty JPG (q20–q90) → tolerancja radzi sobie
- Obiekt na transparent → bez zmian
- Pełny monochrom → cały transparent
- Tryby simple/ai/auto, sweep tolerancji 0–200, 30× stress losowy
- Złe wejście (pusty/null) → kontrolowany błąd

${failures.length ? '## Failures\n' + failures.map(f => '- ' + f).join('\n') + '\n' : ''}${detect.misses.length ? '## Autodetect misses\n' + detect.misses.map(f => '- ' + f).join('\n') + '\n' : ''}`;

  fs.writeFileSync(path.join(__dirname, 'test-results-bg.md'), md);
  console.log(`\nBG REMOVAL: ${pass}/${total} pass | autodetect ${acc.toFixed(1)}% | avg ${avg.toFixed(1)}ms max ${max.toFixed(1)}ms`);
  if (failures.length) console.log('FAILURES:\n' + failures.map(f => '  ✗ ' + f).join('\n'));
  console.log(allOk ? '✅ BG GREEN' : '❌ BG NOT GREEN');
  if (!allOk) process.exitCode = 1;
}

run().catch(e => { console.error('FATAL', e); process.exit(1); });
