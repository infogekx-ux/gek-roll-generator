'use strict';
// ============================================================
// MISJA 5 — Orkiestrator Background Removal (Level 3 autodetect).
// Łączy szybkie ścieżki (sharp: threshold/flood) z prawdziwym AI (child proc).
//
//   mode 'auto'   → solidne tło: threshold; złożone: AI (fallback flood)
//   mode 'simple' → threshold (jednolite tła)
//   mode 'flood'  → border flood-fill (połączone tła)
//   mode 'ai'     → wymuszone AI (fallback flood gdy AI niedostępne)
//
// processRemoveBg(imageBuffer, { mode, tolerance })
//   → { resultBuffer, method, bgColor, confidence, changed, width, height, note? }
// ============================================================
const sharp = require('sharp');
const { removeBg, detectBackground } = require('./remove-bg-engine.js');
const { aiRemoveBg } = require('./ai-remove-bg.js');

async function processRemoveBg(imageBuffer, options = {}) {
  if (!imageBuffer || imageBuffer.length === 0) throw new Error('processRemoveBg: empty input');
  const mode = options.mode || 'auto';
  const tolerance = Number.isFinite(options.tolerance) ? options.tolerance : 30;

  const det = await detectBackground(imageBuffer, tolerance);

  // Tło już usunięte → nie ruszaj.
  if (det.alreadyTransparent && mode === 'auto') {
    const out = await sharp(imageBuffer).png().toBuffer();
    return { resultBuffer: out, method: 'none', bgColor: det.bgColor, confidence: 0.99,
      changed: false, width: det.width, height: det.height };
  }

  const wantAI = mode === 'ai' || (mode === 'auto' && det.complex);

  if (wantAI) {
    try {
      const aiPng = await aiRemoveBg(imageBuffer, { timeoutMs: options.timeoutMs || 120000 });
      const meta = await sharp(aiPng).metadata();
      return { resultBuffer: aiPng, method: 'ai', bgColor: det.bgColor,
        confidence: 0.92, changed: true, width: meta.width, height: meta.height };
    } catch (e) {
      // AI niedostępne → graceful fallback na flood (lepsze niż nic).
      const r = await removeBg(imageBuffer, { mode: 'flood', tolerance });
      return { resultBuffer: r.resultBuffer, method: 'flood', bgColor: r.bgColor,
        confidence: r.confidence, changed: r.changed, width: r.width, height: r.height,
        note: 'ai_unavailable: ' + e.message };
    }
  }

  // Ścieżki sharp (threshold/flood/simple)
  const engineMode = mode === 'auto' ? (det.solid ? 'simple' : 'flood') : mode;
  const r = await removeBg(imageBuffer, { mode: engineMode === 'simple' ? 'simple' : engineMode, tolerance });
  return { resultBuffer: r.resultBuffer, method: r.method, bgColor: r.bgColor,
    confidence: r.confidence, changed: r.changed, width: r.width, height: r.height };
}

module.exports = { processRemoveBg };
