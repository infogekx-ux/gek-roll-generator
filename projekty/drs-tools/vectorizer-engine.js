'use strict';
// ============================================================
// MISJA 5 — SILNIK 2: Vectorizer (standalone, server-side)
// Raster (PNG/JPG, często niskie DPI) → SVG (wektor) + render PNG w docelowym DPI.
//
// Pipeline:
//   1. decode (sharp) → opcjonalny downscale dużych wejść (limit czasu trace'a)
//   2. trace (imagetracerjs): kolor (numberofcolors) lub B&W (2 kolory)
//   3. SVG (resolution-independent)
//   4. render SVG → PNG @ targetDPI (sharp/librsvg)
//
// API:
//   vectorize(imageBuffer, { colorMode='color'|'bw', targetDPI=300,
//                            detail='low'|'medium'|'high', inputDPI=72 })
//     → { svg, pngBuffer(Uint8Array), pathCount, outputDPI,
//         srcWidth, srcHeight, outWidth, outHeight }
//
// UWAGA: wektoryzacja NIE jest perfekcyjna — UI ZAWSZE pokazuje before/after
//        + ostrzeżenie "Result may differ from original. Review before printing."
// ============================================================
const sharp = require('sharp');
const ImageTracer = require('imagetracerjs');

const TRACE_MAX = 1000;   // max bok obrazu wchodzącego do trace'a (szybkość)
const OUT_MAX = 8000;     // cap wymiaru renderu (bezpieczeństwo pamięci)

function detailOptions(detail, colorMode) {
  const bw = colorMode === 'bw';
  // imagetracerjs: ltres/qtres = dokładność krzywych, pathomit = pomijaj drobne
  // ścieżki (szum), numberofcolors = paleta, colorquantcycles = jakość kwantyzacji.
  const base = bw
    ? { colorsampling: 0, numberofcolors: 2, mincolorratio: 0 }
    : { colorsampling: 2, mincolorratio: 0, colorquantcycles: 3 };
  const byDetail = {
    low:    { ltres: 1.5, qtres: 1.5, pathomit: 12, numberofcolors: bw ? 2 : 6,  roundcoords: 1 },
    medium: { ltres: 1.0, qtres: 1.0, pathomit: 8,  numberofcolors: bw ? 2 : 12, roundcoords: 1 },
    high:   { ltres: 0.5, qtres: 0.5, pathomit: 4,  numberofcolors: bw ? 2 : 24, roundcoords: 2 },
  };
  return Object.assign({ scale: 1, strokewidth: 0, linefilter: false },
    base, byDetail[detail] || byDetail.medium);
}

async function vectorize(imageBuffer, options = {}) {
  if (!imageBuffer || imageBuffer.length === 0) throw new Error('vectorize: empty input buffer');
  const colorMode = options.colorMode === 'bw' ? 'bw' : 'color';
  const detail = options.detail || 'medium';
  const targetDPI = Number.isFinite(options.targetDPI) && options.targetDPI > 0 ? options.targetDPI : 300;
  const inputDPI = Number.isFinite(options.inputDPI) && options.inputDPI > 0 ? options.inputDPI : 72;

  const meta = await sharp(imageBuffer).metadata();
  const srcWidth = meta.width || 0, srcHeight = meta.height || 0;
  if (!srcWidth || !srcHeight) throw new Error('vectorize: cannot read image dimensions');

  // downscale tylko gdy za duży — zachowaj proporcje
  let pipe = sharp(imageBuffer).ensureAlpha();
  const longSide = Math.max(srcWidth, srcHeight);
  if (longSide > TRACE_MAX) {
    const s = TRACE_MAX / longSide;
    pipe = pipe.resize(Math.max(1, Math.round(srcWidth * s)), Math.max(1, Math.round(srcHeight * s)));
  }
  if (colorMode === 'bw') pipe = pipe.grayscale();

  const { data, info } = await pipe.raw().toBuffer({ resolveWithObject: true });
  const tw = info.width, th = info.height, tch = info.channels;

  // imagetracerjs wymaga RGBA ImageData; sharp da nam 4 kanały (ensureAlpha).
  let rgba;
  if (tch === 4) {
    rgba = new Uint8ClampedArray(data.buffer, data.byteOffset, data.length);
  } else {
    rgba = new Uint8ClampedArray(tw * th * 4);
    for (let p = 0; p < tw * th; p++) {
      const s = p * tch, d = p * 4;
      rgba[d] = data[s]; rgba[d + 1] = data[s + (tch > 1 ? 1 : 0)];
      rgba[d + 2] = data[s + (tch > 2 ? 2 : 0)]; rgba[d + 3] = 255;
    }
  }

  const imgd = { width: tw, height: th, data: rgba };
  const opts = detailOptions(detail, colorMode);
  let svg = ImageTracer.imagedataToSVG(imgd, opts);
  if (typeof svg !== 'string' || svg.indexOf('<svg') === -1) {
    throw new Error('vectorize: tracer produced no SVG');
  }

  const pathCount = (svg.match(/<path/g) || []).length;

  // render SVG → PNG @ targetDPI. Wektor jest skalowalny, więc renderujemy w
  // rozdzielczości docelowej: outScale = targetDPI/inputDPI względem oryginału.
  const outScale = targetDPI / inputDPI;
  let outWidth = Math.round(srcWidth * outScale);
  let outHeight = Math.round(srcHeight * outScale);
  const cap = Math.max(outWidth, outHeight);
  if (cap > OUT_MAX) {
    const s = OUT_MAX / cap;
    outWidth = Math.max(1, Math.round(outWidth * s));
    outHeight = Math.max(1, Math.round(outHeight * s));
  }

  const pngBuffer = await sharp(Buffer.from(svg))
    .resize(outWidth, outHeight, { fit: 'fill' })
    .png()
    .toBuffer();

  return {
    svg,
    pngBuffer: new Uint8Array(pngBuffer),
    pathCount,
    outputDPI: targetDPI,
    srcWidth, srcHeight,
    traceWidth: tw, traceHeight: th,
    outWidth, outHeight,
    colorMode, detail,
  };
}

module.exports = { vectorize, _internals: { detailOptions, TRACE_MAX, OUT_MAX } };
