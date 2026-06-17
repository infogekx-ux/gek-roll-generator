// OOM stress test for gek-roll-generator (NOT deployed — Dockerfile only copies src/).
// Run: SUPABASE_SERVICE_KEY=<srk> node --expose-gc test/oom-stress.js
// Reproduces Willem's 2300-piece / ~177m order against the real source images,
// renders segments, samples peak RSS, and validates ZIP + small-order backward-compat.

process.env.SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const M = require('../src/index.js');
const { splitIntoRolls, preResizeItems, generateRollImage, buildZipFromFiles, PX_PER_CM, LABEL_HEIGHT_CM, GAP_AFTER_LABEL_CM, BOTTOM_GAP_CM, SEGMENT_MAX_CM } = M;

const SB_URL = 'https://dkihhmphimfqhyuzajwc.supabase.co';
const SRK = process.env.SUPABASE_SERVICE_KEY;
const sb = createClient(SB_URL, SRK);
const BUCKET = 'printflow';
const ORDER = 'orders/2026-06-17_GS-DRS_willem_de_Groot';
const RENDER_FIRST_N = Number(process.env.RENDER_N) || 6; // render this many segments for the RAM proof

const mb = (b) => (b / 1024 / 1024).toFixed(0);
let PEAK = 0;
const sampler = setInterval(() => { const r = process.memoryUsage().rss; if (r > PEAK) PEAK = r; }, 40);

// ---- shelf packer: lay items L→R across printable width, wrap rows, track length ----
function buildPlaced(items, printableW) {
  const placed = []; let y = 0, x = 0, rowH = 0;
  for (const it of items) for (let q = 0; q < it.qty; q++) {
    if (x + it.w > printableW && x > 0) { y += rowH; x = 0; rowH = 0; }
    placed.push({ fileNum: it.fileNum, x, y, w: it.w, h: it.h, rotated: false });
    x += it.w; if (it.h > rowH) rowH = it.h;
  }
  y += rowH;
  return { placed, totalLengthCm: y };
}

async function dl(name) {
  const { data, error } = await sb.storage.from(BUCKET).download(`${ORDER}/${name}`);
  if (error) throw new Error(`download ${name}: ${error.message}`);
  return Buffer.from(await data.arrayBuffer());
}

function dims(config) {
  const printableWidthPx = Math.round(config.printableWidth * PX_PER_CM);
  const marginPx = Math.round(((config.rollWidth - config.printableWidth) / 2) * PX_PER_CM);
  const labelHeightPx = Math.round(LABEL_HEIGHT_CM * PX_PER_CM);
  const gapPx = Math.round(GAP_AFTER_LABEL_CM * PX_PER_CM);
  return { printableWidthPx, marginPx, labelHeightPx, gapPx, totalOffsetPx: labelHeightPx + gapPx, canvasW: printableWidthPx };
}

const infoLines = {
  line1: 'PF-TEST | Willem de Groot — DTF Specialist',
  line2: 'test | items | cm | now',
  fileList: 'bs de kasteeltuin (2355x) | dreamteam (8x) | FC Ramona (8x)',
  printerLine: 'Gedrukt door DTF Specialist · GEK | SAAS™'
};

async function renderGroups(groups, fileBuffers, files, config, limit) {
  const D = dims(config);
  const margin = config.cutMargin / 10;
  const resizeCache = await preResizeItems(groups.flat(), fileBuffers, files, margin);
  const n = limit ? Math.min(limit, groups.length) : groups.length;
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gek-roll-test-'));
  const segFiles = [];
  for (let i = 0; i < n; i++) {
    const rollItems = groups[i];
    const rollYOffset = rollItems.length ? rollItems[0].y : 0;
    const before = process.memoryUsage().rss;
    const { rollPng, canvasH, contentHeightCm } = await generateRollImage({
      rollItems, canvasW: D.canvasW, printableWidthPx: D.printableWidthPx, marginPx: D.marginPx, margin,
      labelHeightPx: D.labelHeightPx, gapPx: D.gapPx, totalOffsetPx: D.totalOffsetPx, rollYOffset,
      logoBuffer: null, logoWidthInLabel: 0, logoHeightInLabel: 0,
      textStartX: Math.round(PX_PER_CM * 0.5), files, config,
      rollLabel: groups.length > 1 ? `Deel ${i + 1}/${groups.length}` : '', infoLines, resizeCache
    });
    const after = process.memoryUsage().rss;
    console.log(`   seg ${i + 1}/${groups.length}: ${D.canvasW}x${canvasH}px (${contentHeightCm.toFixed(0)}cm) → ${(rollPng.length/1024/1024).toFixed(1)}MB PNG | RSS ${mb(before)}→${mb(after)}MB`);
    const p = path.join(tmpDir, `seg${i + 1}.png`); fs.writeFileSync(p, rollPng); segFiles.push({ name: `seg${i + 1}.png`, path: p });
    if (global.gc) global.gc();
  }
  return { tmpDir, segFiles };
}

(async () => {
  console.log(`\n=== OOM STRESS TEST — segment cap ${SEGMENT_MAX_CM}cm, expose-gc=${!!global.gc} ===\n`);
  const overhead = LABEL_HEIGHT_CM * 2 + GAP_AFTER_LABEL_CM + BOTTOM_GAP_CM;

  // ---- download real sources ----
  console.log('Downloading real source images...');
  const fileBuffers = {
    'bs de kasteeltuin-Photoroom.png': await dl('bs de kasteeltuin-Photoroom.png'),
    'dreamteam.png': await dl('dreamteam.png'),
    'FC Ramona.png': await dl('FC Ramona.png'),
    'Photoroom-20260613_134101602 1.png': await dl('Photoroom-20260613_134101602 1.png'),
    'Annelies.png': await dl('Annelies.png')
  };
  console.log('  sources loaded:', Object.entries(fileBuffers).map(([k,v]) => `${k.slice(0,18)}=${mb(v.length)}MB`).join(', '));

  const files = [
    { fileNum: 1, name: 'bs de kasteeltuin-Photoroom.png', displayName: 'bs de kasteeltuin', quantity: 2355 },
    { fileNum: 2, name: 'dreamteam.png', displayName: 'dreamteam', quantity: 8 },
    { fileNum: 3, name: 'FC Ramona.png', displayName: 'FC Ramona', quantity: 8 },
    { fileNum: 4, name: 'Photoroom-20260613_134101602 1.png', displayName: 'Photoroom', quantity: 4 },
    { fileNum: 5, name: 'Annelies.png', displayName: 'Annelies', quantity: 4 }
  ];
  const config = { rollWidth: 35, printableWidth: 33, cutMargin: 3, supabaseBucket: BUCKET, printerName: 'DTF Specialist', printerLogo: null };

  // ---- BIG order (~177m) ----
  const bigItems = [
    { fileNum: 1, w: 15, h: 13.8, qty: 2300 },
    { fileNum: 1, w: 27, h: 24.8, qty: 55 },
    { fileNum: 2, w: 10, h: 3.3, qty: 8 },
    { fileNum: 3, w: 30, h: 4.7, qty: 8 },
    { fileNum: 4, w: 10, h: 10, qty: 2 }, { fileNum: 4, w: 20, h: 20, qty: 2 },
    { fileNum: 5, w: 10, h: 10, qty: 2 }, { fileNum: 5, w: 25, h: 25, qty: 2 }
  ];
  const big = buildPlaced(bigItems, config.printableWidth);
  const bigGroups = splitIntoRolls(big.placed, SEGMENT_MAX_CM - overhead);
  const maxSegCm = Math.max(...bigGroups.map(g => { const yo = g[0].y; return Math.max(...g.map(it => it.y - yo + it.h)); }));
  console.log(`\n[BIG] ${big.placed.length} items, ${(big.totalLengthCm/100).toFixed(1)}m → ${bigGroups.length} segments (largest segment content ${maxSegCm.toFixed(0)}cm, cap ${SEGMENT_MAX_CM-overhead}cm)`);
  console.log(`[BIG] rendering first ${RENDER_FIRST_N} segments for the RAM proof...`);
  const { tmpDir, segFiles } = await renderGroups(bigGroups, fileBuffers, files, config, RENDER_FIRST_N);

  // ---- ZIP integrity (disk-streamed) ----
  const zipPath = path.join(tmpDir, 'bundle.zip');
  buildZipFromFiles(segFiles, zipPath);
  const zipSize = fs.statSync(zipPath).size;
  // verify zip with system unzip
  const { execSync } = require('child_process');
  let zipOk = false;
  try { execSync(`unzip -t "${zipPath}"`, { stdio: 'pipe' }); zipOk = true; } catch (e) { zipOk = false; }
  console.log(`\n[ZIP] ${segFiles.length} segs → ${mb(zipSize)}MB, unzip -t: ${zipOk ? 'VALID ✓' : 'INVALID ✗'}`);

  // ---- SMALL order (~1.78m) backward-compat ----
  const smallItems = [{ fileNum: 1, w: 15, h: 13.8, qty: 24 }];
  const small = buildPlaced(smallItems, config.printableWidth);
  const smallGroups = splitIntoRolls(small.placed, SEGMENT_MAX_CM - overhead);
  console.log(`\n[SMALL] ${small.placed.length} items, ${(small.totalLengthCm/100).toFixed(2)}m → ${smallGroups.length} segment(s) ${smallGroups.length === 1 ? '(single PNG, unchanged ✓)' : '(REGRESSION ✗)'}`);

  fs.rmSync(tmpDir, { recursive: true, force: true });
  clearInterval(sampler);
  const final = process.memoryUsage().rss; if (final > PEAK) PEAK = final;
  console.log(`\n====================================================`);
  console.log(`PEAK RSS: ${mb(PEAK)}MB  | target <2048MB → ${PEAK/1024/1024 < 2048 ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log(`BIG: ${bigGroups.length} segs, largest ${maxSegCm.toFixed(0)}cm ≤ ${SEGMENT_MAX_CM-overhead}cm | ZIP ${zipOk?'valid':'BAD'} | SMALL ${smallGroups.length===1?'1 PNG':'BROKEN'}`);
  console.log(`====================================================\n`);
  process.exit(0);
})().catch(e => { clearInterval(sampler); console.error('TEST FAILED:', e); process.exit(1); });
