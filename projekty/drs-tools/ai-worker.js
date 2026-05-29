'use strict';
// ============================================================
// MISJA 5 — AI worker (child process). ONNX/@imgly TYLKO tutaj.
// MUSI być izolowany od sharp: onnxruntime-node + sharp w jednym procesie
// powodują heap corruption (munmap_chunk). Dlatego osobny proces.
// Wywołanie: node ai-worker.js <inputPath.png> <outputPath.png>
// ============================================================
const fs = require('fs');
const { removeBackground } = require('@imgly/background-removal-node');

(async () => {
  const inPath = process.argv[2];
  const outPath = process.argv[3];
  if (!inPath || !outPath) { console.error('usage: ai-worker.js <in> <out>'); process.exit(2); }
  const blob = await removeBackground(inPath); // wejście znormalizowane do PNG przez rodzica
  const out = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync(outPath, out);
  process.exit(0);
})().catch((e) => { console.error(e && e.message ? e.message : String(e)); process.exit(1); });
