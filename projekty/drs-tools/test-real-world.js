'use strict';
// ============================================================
// MISJA 5 — TESTY REAL-WORLD (300+). Scenariusz Dawida:
// "ktoś znajduje coś w necie, robi screenshot, wysyła drukarzowi
//  'chcę to na koszulce' — i zaczyna się problem."
// Te testy walą w DOKŁADNIE te wejścia: screenshoty, zdjęcia z telefonu
// (EXIF), logo zgrabione ze stron (artefakty JPG, halo), złe color-mody,
// niskie DPI, dziwne formaty — i sprawdzają że pipeline daje druk-ready output.
//
// node projekty/drs-tools/test-real-world.js → konsola + test-results-realworld.md
// ============================================================
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { removeBg } = require('./remove-bg-engine.js');
const { vectorize } = require('./vectorizer-engine.js');
const { processRemoveBg } = require('./remove-bg-service.js');

let pass = 0, fail = 0;
const failures = [];
const cat = {}; // per-category pass/fail
const timings = { bg: [], vec: [], ai: [] };
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
const ALLOWED = new Set(['threshold', 'flood', 'ai', 'none']);

function ok(c, name, detail) {
  const k = name.split(' ')[0];
  cat[k] = cat[k] || { p: 0, f: 0 };
  if (c) { pass++; cat[k].p++; }
  else { fail++; cat[k].f++; failures.push(name + (detail ? ' — ' + detail : '')); }
}
async function alphaAt(buf, x, y) {
  const { data, info } = await sharp(Buffer.from(buf)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const xx = Math.min(Math.max(0, x), info.width - 1), yy = Math.min(Math.max(0, y), info.height - 1);
  return data[(yy * info.width + xx) * 4 + 3];
}
function checkBg(name, r) {
  ok(r && Buffer.isBuffer(r.resultBuffer), name + ' [buf]');
  ok(r.resultBuffer && r.resultBuffer.slice(0, 4).equals(PNG_SIG), name + ' [png]');
  ok(ALLOWED.has(r.method), name + ' [method]', r.method);
  ok(Number.isFinite(r.confidence) && r.confidence >= 0 && r.confidence <= 1, name + ' [conf]', r.confidence);
  ok(Number.isInteger(r.width) && r.width > 0 && Number.isInteger(r.height) && r.height > 0, name + ' [dims]');
}
async function checkVec(name, r, targetDPI) {
  ok(typeof r.svg === 'string' && r.svg.indexOf('<svg') !== -1, name + ' [svg]');
  ok(r.pngBuffer instanceof Uint8Array && Buffer.from(r.pngBuffer.slice(0, 4)).equals(PNG_SIG), name + ' [png]');
  ok(Number.isInteger(r.pathCount) && r.pathCount >= 0, name + ' [paths]', r.pathCount);
  ok(r.outputDPI === targetDPI, name + ' [dpi]', r.outputDPI);
  ok(Number.isFinite(r.outWidth) && r.outWidth > 0 && Number.isFinite(r.outHeight) && r.outHeight > 0, name + ' [outdims]');
}

// ---------- realistic generators ----------
// A screenshot of a logo sitting on a web page (solid/near-solid page bg), JPEG-compressed.
async function webScreenshot(pageBg, logoCol, txtCol, w, h, q, withChrome) {
  let parts = `<rect width="${w}" height="${h}" fill="${pageBg}"/>`;
  if (withChrome) parts += `<rect width="${w}" height="${Math.round(h * 0.12)}" fill="#dfe1e5"/>` +
    `<circle cx="14" cy="${Math.round(h * 0.06)}" r="4" fill="#bbb"/>`;
  const cy = Math.round(h * (withChrome ? 0.55 : 0.42));
  parts += `<circle cx="${w / 2}" cy="${cy}" r="${Math.round(Math.min(w, h) * 0.18)}" fill="${logoCol}"/>` +
    `<text x="${w / 2}" y="${Math.round(h * 0.8)}" font-family="sans-serif" font-weight="900" font-size="${Math.round(h * 0.12)}" fill="${txtCol}" text-anchor="middle">BRAND</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${parts}</svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: q }).toBuffer();
}
// Phone photo: subject on a smooth/gradient background → AI territory. Optional EXIF orientation.
async function phonePhoto(w, h, orientation) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fc7e8"/><stop offset="1" stop-color="#33536e"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <ellipse cx="${w * 0.5}" cy="${h * 0.4}" rx="${w * 0.22}" ry="${h * 0.24}" fill="#e3b58a"/>
    <rect x="${w * 0.3}" y="${h * 0.6}" width="${w * 0.4}" height="${h * 0.38}" rx="${w * 0.12}" fill="#a8412f"/></svg>`;
  let p = sharp(Buffer.from(svg)).jpeg({ quality: 80 });
  if (orientation) p = sharp(await p.toBuffer()).withMetadata({ orientation });
  return p.toBuffer();
}
// Small web-grabbed logo with anti-aliased edges + faint near-white halo on white.
async function grabbedLogo(w, h, fmt, q) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="#ffffff"/>
    <circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) * 0.32}" fill="#1f6fb2"/></svg>`;
  let p = sharp(Buffer.from(svg));
  return fmt === 'jpg' ? p.jpeg({ quality: q || 70 }).toBuffer() : p.png().toBuffer();
}
async function textShot(w, h) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="#ffffff"/>
    <text x="10" y="${h * 0.68}" font-family="sans-serif" font-weight="800" font-size="${h * 0.5}" fill="#111">SALE</text></svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 60 }).toBuffer();
}

async function run() {
  // ===== A) Web screenshots: logo on a page bg, JPEG, many combos (fast: threshold/flood) =====
  const pages = ['#ffffff', '#f5f5f7', '#000000', '#1d1d1f', '#0a84ff', '#fafafa'];
  const sizes = [[400, 300], [800, 600], [1280, 720], [1600, 1000]];
  let i = 0;
  for (const pg of pages) {
    const [w, h] = sizes[i % sizes.length]; i++;
    for (const q of [45, 75]) {
      const name = `screenshot ${pg}@${w}x${h}q${q}`;
      try {
        const img = await webScreenshot(pg, '#e74c3c', '#16a085', w, h, q, false);
        const t = Date.now();
        const r = await removeBg(img, { mode: 'auto', tolerance: 42 });
        timings.bg.push(Date.now() - t);
        checkBg(name, r);
        ok((await alphaAt(r.resultBuffer, 2, Math.floor(h / 2))) === 0, name + ' [edge bg gone]');
        ok((await alphaAt(r.resultBuffer, Math.floor(w / 2), Math.floor(h * 0.42))) === 255, name + ' [logo kept]');
      } catch (e) { ok(false, name, 'THREW ' + e.message); }
    }
  }

  // ===== B) Screenshots WITH browser chrome strip (realistic crop) =====
  for (const q of [40, 60, 85]) {
    const name = `chrome screenshot q${q}`;
    try {
      const img = await webScreenshot('#ffffff', '#8e44ad', '#2c3e50', 900, 650, q, true);
      const r = await removeBg(img, { mode: 'auto', tolerance: 45 });
      checkBg(name, r);
      ok((await alphaAt(r.resultBuffer, 2, 2)) === 0, name + ' [corner gone]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ===== C) JPG halo / tolerance: near-white edges from compression must clear =====
  for (const q of [20, 30, 45, 60, 75, 85]) {
    for (const tol of [30, 50]) {
      const name = `jpghalo q${q}tol${tol}`;
      try {
        const img = await grabbedLogo(260, 200, 'jpg', q);
        const r = await removeBg(img, { mode: 'simple', tolerance: tol });
        checkBg(name, r);
        if (tol >= 50) ok((await alphaAt(r.resultBuffer, 1, 1)) === 0, name + ' [halo cleared]');
      } catch (e) { ok(false, name, 'THREW ' + e.message); }
    }
  }

  // ===== D) Color modes: grayscale, CMYK, palette, partial-alpha, 1-bit, 16-bit =====
  const rgbLogo = await webScreenshot('#ffffff', '#c0392b', '#2980b9', 300, 240, 92, false);
  const modes = {
    grayscale: await sharp(rgbLogo).grayscale().jpeg().toBuffer(),
    cmyk: await sharp(rgbLogo).toColourspace('cmyk').jpeg().toBuffer(),
    palette: await sharp(rgbLogo).png({ palette: true, colours: 16 }).toBuffer(),
    sixteenbit: await sharp(rgbLogo).toColourspace('rgb16').png().toBuffer(),
    onebit: await sharp(rgbLogo).threshold(128).png().toBuffer(),
    partialAlpha: await sharp({ create: { width: 240, height: 240, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
      .composite([{ input: await sharp({ create: { width: 90, height: 90, channels: 4, background: { r: 200, g: 30, b: 30, alpha: 0.6 } } }).png().toBuffer(), left: 75, top: 75 }]).png().toBuffer(),
  };
  for (const [m, buf] of Object.entries(modes)) {
    const name = `colormode ${m}`;
    try {
      const r = await removeBg(buf, { mode: 'auto', tolerance: 40 });
      checkBg(name, r);
      // and it must also vectorize without crashing
      const v = await vectorize(buf, { colorMode: 'color', detail: 'medium', targetDPI: 300 });
      await checkVec(name + '-vec', v, 300);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ===== E) EXIF orientation 1..8: result must be auto-oriented (no sideways prints) =====
  for (let o = 1; o <= 8; o++) {
    const name = `exif o${o}`;
    try {
      const img = await phonePhoto(120, 180, o); // stored portrait 120x180
      const r = await removeBg(img, { mode: 'simple', tolerance: 40 });
      checkBg(name, r);
      const swapped = o >= 5; // 5,6,7,8 swap W/H after auto-orient
      const expW = swapped ? 180 : 120, expH = swapped ? 120 : 180;
      ok(r.width === expW && r.height === expH, name + ' [oriented]', `${r.width}x${r.height} exp ${expW}x${expH}`);
      const v = await vectorize(img, { colorMode: 'color', detail: 'low', targetDPI: 200, inputDPI: 72 });
      ok(Math.abs(v.srcWidth / v.srcHeight - expW / expH) < 0.05, name + '-vec [aspect oriented]', `${v.srcWidth}x${v.srcHeight}`);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ===== F) Vectorize realistic: screenshots/text/logos at low DPI → crisp high DPI =====
  let vi = 0;
  for (const gen of ['screenshot', 'text', 'grab']) {
    for (const detail of ['low', 'medium', 'high']) {
      for (const mode of ['color', 'bw']) {
        vi++;
        const name = `vecreal ${gen}/${detail}/${mode}#${vi}`;
        try {
          let img;
          if (gen === 'screenshot') img = await webScreenshot('#ffffff', '#e67e22', '#34495e', 360, 280, 55, false);
          else if (gen === 'text') img = await textShot(300, 110);
          else img = await grabbedLogo(200, 200, 'jpg', 50);
          const t = Date.now();
          const v = await vectorize(img, { colorMode: mode, detail, targetDPI: 300, inputDPI: 72 });
          timings.vec.push(Date.now() - t);
          await checkVec(name, v, 300);
          ok(v.outWidth > v.srcWidth, name + ' [upscaled to print DPI]', `${v.srcWidth}→${v.outWidth}`);
          ok(v.pathCount > 0, name + ' [has contours]', v.pathCount);
        } catch (e) { ok(false, name, 'THREW ' + e.message); }
      }
    }
  }

  // ===== G) THE MONEY PATH: screenshot → remove bg → vectorize → print-ready =====
  for (let k = 0; k < 10; k++) {
    const name = `pipeline #${k}`;
    try {
      const w = 320 + k * 30, h = 240 + k * 20;
      const shot = await webScreenshot('#ffffff', '#16a085', '#2c3e50', w, h, 50, k % 2 === 0);
      const bg = await removeBg(shot, { mode: 'auto', tolerance: 45 });
      checkBg(name + '-bg', bg);
      ok((await alphaAt(bg.resultBuffer, 1, 1)) === 0, name + ' [bg transparent]');
      // vectorize the cleaned PNG → high DPI, transparency preserved
      const v = await vectorize(bg.resultBuffer, { colorMode: 'color', detail: 'high', targetDPI: 300, inputDPI: 72 });
      await checkVec(name + '-vec', v, 300);
      ok((await alphaAt(v.pngBuffer, 1, 1)) < 250, name + ' [print-ready: transparent + hi-dpi]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ===== H) AI path on real photos (limited count — slow) =====
  for (let k = 0; k < 8; k++) {
    const name = `ai photo #${k}`;
    try {
      const photo = await phonePhoto(280 + k * 10, 280 + k * 10, 0);
      const t = Date.now();
      const r = await processRemoveBg(photo, { mode: 'auto' });
      timings.ai.push(Date.now() - t);
      checkBg(name, r);
      ok(r.method === 'ai', name + ' [routed to AI]', r.method);
      ok((await alphaAt(r.resultBuffer, 2, 2)) < 60, name + ' [bg removed]');
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  // ===== I) Robustness: corrupt / truncated / garbage / wrong type (must not crash process) =====
  const badInputs = [
    ['empty', Buffer.alloc(0)],
    ['garbage', Buffer.from('this is not an image at all, just text')],
    ['truncated-png', (await grabbedLogo(100, 100, 'png')).slice(0, 40)],
    ['truncated-jpg', (await grabbedLogo(100, 100, 'jpg')).slice(0, 60)],
    ['random-bytes', Buffer.from(Array.from({ length: 500 }, () => (Math.random() * 256) | 0))],
    ['png-header-only', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
  ];
  for (const [label, buf] of badInputs) {
    const name = `robust ${label}`;
    // Invalid input MUST reject with a controlled Error (never crash, never return junk).
    let bgErr = null, bgRes = null;
    try { bgRes = await removeBg(buf, { mode: 'auto' }); } catch (e) { bgErr = e; }
    ok(bgErr instanceof Error, name + ' [bg rejects cleanly]', bgRes ? 'returned instead of throwing' : '');
    let vecErr = null, vecRes = null;
    try { vecRes = await vectorize(buf, {}); } catch (e) { vecErr = e; }
    ok(vecErr instanceof Error, name + ' [vec rejects cleanly]', vecRes ? 'returned instead of throwing' : '');
  }

  // ===== J) Extreme dimensions / aspect ratios =====
  for (const [w, h] of [[1, 1], [3000, 40], [40, 3000], [2500, 2500], [16, 16], [5000, 100]]) {
    const name = `extreme ${w}x${h}`;
    try {
      const img = await webScreenshot('#ffffff', '#333', '#999', w, h, 70, false);
      const r = await removeBg(img, { mode: 'simple', tolerance: 40 });
      checkBg(name, r);
      const v = await vectorize(img, { colorMode: 'bw', detail: 'low', targetDPI: 300 });
      await checkVec(name + '-vec', v, 300);
    } catch (e) { ok(false, name, 'THREW ' + e.message); }
  }

  report();
}

function report() {
  const total = pass + fail;
  const avg = (a) => a.length ? (a.reduce((s, x) => s + x, 0) / a.length).toFixed(0) : '—';
  const max = (a) => a.length ? Math.max(...a).toFixed(0) : '—';
  const allOk = fail === 0 && total >= 300;
  const catLines = Object.entries(cat).map(([k, v]) => `- ${k}: ${v.p}/${v.p + v.f}` + (v.f ? ' ❌' : ' ✅')).join('\n');

  const md = `# Test Results — REAL-WORLD (MISJA 5)
> Wygenerowane: ${new Date().toISOString()}
> Scenariusz: "screenshot z neta → drukarz → dramat". Te testy walą w realne, problematyczne wejścia.

## Podsumowanie
- **Asercje:** ${pass}/${total} pass, ${fail} fail ${total >= 300 ? '✅ (≥300)' : '❌ (<300)'}
- **Czas:** BG śr ${avg(timings.bg)}ms / max ${max(timings.bg)}ms · VEC śr ${avg(timings.vec)}ms / max ${max(timings.vec)}ms · AI śr ${avg(timings.ai)}ms / max ${max(timings.ai)}ms
- **Status:** ${allOk ? '✅ ZIELONO — zero crashy, zero NaN' : '❌ DO POPRAWY'}

## Kategorie
${catLines}

## Co pokryte (real-world)
- **Screenshoty stron** (logo na tle strony, JPEG q40–85, 6 teł × 4 rozmiary) — tło znika, logo zostaje
- **Screenshoty z paskiem przeglądarki** (realny crop)
- **Halo z kompresji JPG** (q20–85) — near-white krawędzie czyszczone tolerancją
- **Color-mody:** grayscale, **CMYK**, paleta/indexed, **16-bit**, 1-bit, partial-alpha — dekodują i przetwarzają bez crasha
- **EXIF orientation 1–8** — wynik auto-zorientowany (koniec bokiem drukowanych zdjęć z telefonu)
- **Wektoryzacja realna** (screenshot/tekst/logo, low/med/high, kolor+BW) — niskie DPI → ostry druk-DPI
- **ŚCIEŻKA PIENIĘDZY:** screenshot → remove bg → vectorize → druk-ready (transparent + hi-DPI)
- **AI na zdjęciach** (gradient/subject) — routing do AI, tło usunięte
- **Odporność:** pusty/garbage/truncated/random/header-only — proces przeżywa, błąd kontrolowany
- **Ekstremalne wymiary:** 1×1, 3000×40, 40×3000, 2500², 5000×100

${failures.length ? '## Failures\n' + failures.map(f => '- ' + f).join('\n') + '\n' : ''}`;

  fs.writeFileSync(path.join(__dirname, 'test-results-realworld.md'), md);
  console.log(`\nREAL-WORLD: ${pass}/${total} pass`);
  console.log(`  BG avg ${avg(timings.bg)}ms · VEC avg ${avg(timings.vec)}ms · AI avg ${avg(timings.ai)}ms (max ${max(timings.ai)}ms)`);
  Object.entries(cat).forEach(([k, v]) => { if (v.f) console.log(`  ❌ ${k}: ${v.p}/${v.p + v.f}`); });
  if (failures.length) console.log('FAILURES:\n' + failures.slice(0, 40).map(f => '  ✗ ' + f).join('\n'));
  console.log(allOk ? '✅ REAL-WORLD GREEN' : '❌ NOT GREEN');
  if (!allOk) process.exitCode = 1;
}

run().catch(e => { console.error('FATAL', e); process.exit(1); });
