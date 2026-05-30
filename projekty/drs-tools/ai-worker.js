'use strict';
// ============================================================
// MISJA 5 — AI worker (child process). ONNX/@imgly TYLKO tutaj.
// MUSI być izolowany od sharp: onnxruntime-node + sharp w jednym procesie
// powodują heap corruption (munmap_chunk). Dlatego osobny proces.
// Wywołanie: node ai-worker.js <inputPath.png> <outputPath.png>
// ============================================================
const fs = require('fs');
const path = require('path');
const { removeBackground } = require('@imgly/background-removal-node');

// KRYTYCZNE: @imgly domyślnie szuka resources (model .onnx + resources.json)
// względem process.cwd(). Na Railway/innych cwd to się sypie (ENOENT resources.json).
// Ustawiamy publicPath jawnie na katalog dist pakietu — cwd-niezależnie.
function pkgPublicPath() {
  try {
    // main entry resolves to <pkg>/dist/index.cjs — resources.json lives next to it.
    // (require.resolve on '/package.json' is blocked by the package's "exports" field.)
    const main = require.resolve('@imgly/background-removal-node'); // .../dist/index.cjs
    return 'file://' + path.dirname(main) + '/';
  } catch (e) { return undefined; }
}

(async () => {
  const inPath = process.argv[2];
  const outPath = process.argv[3];
  if (!inPath || !outPath) { console.error('usage: ai-worker.js <in> <out>'); process.exit(2); }
  const publicPath = pkgPublicPath();
  const config = publicPath ? { publicPath, debug: false } : {};
  const blob = await removeBackground(inPath, config); // wejście znormalizowane do PNG przez rodzica
  const out = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync(outPath, out);
  process.exit(0);
})().catch((e) => { console.error(e && e.message ? e.message : String(e)); process.exit(1); });
