'use strict';
// ============================================================
// MISJA 5 — AI background removal wrapper (parent side).
// Normalizuje wejście do PNG (sharp, w TYM procesie — bezpieczne, bo onnx
// uruchamiamy w child процесie ai-worker.js), potem spawnuje worker.
// API: aiRemoveBg(imageBuffer, { timeoutMs=120000 }) → Promise<Buffer(PNG+alpha)>
// ============================================================
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

async function aiRemoveBg(imageBuffer, opts = {}) {
  if (!imageBuffer || imageBuffer.length === 0) throw new Error('aiRemoveBg: empty input');
  const timeoutMs = opts.timeoutMs || 120000;
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const inP = path.join(os.tmpdir(), `bgai-in-${id}.png`);
  const outP = path.join(os.tmpdir(), `bgai-out-${id}.png`);

  // Normalize → PNG + EXIF auto-orient (parent uses sharp; child uses onnx — separate procs).
  const png = await sharp(imageBuffer).rotate().png().toBuffer();
  fs.writeFileSync(inP, png);

  const cleanup = () => { try { fs.unlinkSync(inP); } catch (e) {} try { fs.unlinkSync(outP); } catch (e) {} };

  return new Promise((resolve, reject) => {
    const worker = path.join(__dirname, 'ai-worker.js');
    const child = spawn(process.execPath, [worker, inP, outP], { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    child.stderr.on('data', (d) => { err += d.toString(); });
    const timer = setTimeout(() => { child.kill('SIGKILL'); cleanup(); reject(new Error('aiRemoveBg: timeout')); }, timeoutMs);
    child.on('error', (e) => { clearTimeout(timer); cleanup(); reject(e); });
    child.on('exit', (code) => {
      clearTimeout(timer);
      try {
        if (code === 0 && fs.existsSync(outP)) {
          const buf = fs.readFileSync(outP);
          cleanup();
          if (!buf || buf.length === 0) return reject(new Error('aiRemoveBg: empty output'));
          resolve(buf);
        } else {
          cleanup();
          reject(new Error('aiRemoveBg: worker failed (' + (err.trim() || ('exit ' + code)) + ')'));
        }
      } catch (e) { cleanup(); reject(e); }
    });
  });
}

module.exports = { aiRemoveBg };
