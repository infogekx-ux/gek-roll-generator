const express = require('express');
const cors = require('cors');
const sharp = require('sharp');
const multer = require('multer');
const tiffUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });

sharp.cache(false);
const SHARP_OPTS = { limitInputPixels: false };
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ===== CONFIG =====
const SB_URL = process.env.SUPABASE_URL || 'https://dkihhmphimfqhyuzajwc.supabase.co';
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const sb = createClient(SB_URL, SB_KEY);

const PX_PER_CM = 118.11; // 300 DPI
const LABEL_HEIGHT_CM = 3;
const GAP_AFTER_LABEL_CM = 1;
const BOTTOM_GAP_CM = 0.5;
const MAX_ROLL_LENGTH_CM = 1000; // 10 meter max per roll

// ===== LOGO CACHE =====
const logoCache = new Map();
const LOGO_CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getCachedLogo(url) {
  if (!url) return { buffer: null, meta: null };
  const cached = logoCache.get(url);
  if (cached && Date.now() - cached.timestamp < LOGO_CACHE_TTL) {
    return { buffer: cached.buffer, meta: cached.meta };
  }
  try {
    const resp = await fetch(url);
    if (resp.ok) {
      const buffer = Buffer.from(await resp.arrayBuffer());
      const meta = await sharp(buffer, SHARP_OPTS).metadata();
      logoCache.set(url, { buffer, meta, timestamp: Date.now() });
      return { buffer, meta };
    }
  } catch (e) {
    console.warn(`[ROLL] Logo download failed: ${e.message}`);
  }
  return { buffer: null, meta: null };
}

// ===== HEALTH CHECK =====
app.get('/', (req, res) => {
  res.json({ 
    service: 'GEK Roll Generator', 
    version: '3.1.0',
    status: 'ok',
    maxRollLength: MAX_ROLL_LENGTH_CM + 'cm',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ===== HELPER: Escape SVG text =====
function escSvg(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ===== HELPER: Build label SVG =====
function buildLabelSvg(canvasW, labelHeightPx, textStartX, lines) {
  return Buffer.from(`<svg width="${canvasW}" height="${labelHeightPx}" xmlns="http://www.w3.org/2000/svg">
  <text x="${textStartX}" y="${Math.round(labelHeightPx * 0.35)}" font-family="sans-serif" font-weight="bold" font-size="${Math.round(PX_PER_CM * 0.4)}" fill="#333333">
    <tspan>${escSvg(lines.title)}</tspan>
  </text>
  <text x="${textStartX}" y="${Math.round(labelHeightPx * 0.58)}" font-family="sans-serif" font-size="${Math.round(PX_PER_CM * 0.3)}" fill="#666666">
    <tspan>${escSvg(lines.info)}</tspan>
  </text>
  <text x="${textStartX}" y="${Math.round(labelHeightPx * 0.76)}" font-family="sans-serif" font-size="${Math.round(PX_PER_CM * 0.22)}" fill="#999999">
    <tspan>${escSvg(lines.files)}</tspan>
  </text>
  <text x="${textStartX}" y="${Math.round(labelHeightPx * 0.93)}" font-family="sans-serif" font-weight="bold" font-size="${Math.round(PX_PER_CM * 0.25)}" fill="#444444">
    <tspan>${escSvg(lines.printer)}</tspan>
  </text>
</svg>`);
}

// ===== HELPER: Split placed items into rolls =====
function splitIntoRolls(placed, maxContentLengthCm) {
  const sorted = [...placed].sort((a, b) => a.y - b.y);
  const rolls = [];
  let currentRoll = [];
  let rollStartY = sorted.length > 0 ? sorted[0].y : 0;
  
  for (const item of sorted) {
    const itemBottom = item.y + item.h;
    const rollContentLength = itemBottom - rollStartY;
    
    if (currentRoll.length > 0 && rollContentLength > maxContentLengthCm) {
      rolls.push(currentRoll);
      currentRoll = [item];
      rollStartY = item.y;
    } else {
      currentRoll.push(item);
    }
  }
  if (currentRoll.length > 0) rolls.push(currentRoll);
  return rolls;
}

// ===== HELPER: Pre-resize all unique file×size combos =====
async function preResizeItems(allItems, fileBuffers, files, margin) {
  const cache = new Map(); // "fileName_WxH_rotated" -> buffer
  const needed = [];

  for (const item of allItems) {
    const sourceFile = files.find(f => f.fileNum === item.fileNum);
    if (!sourceFile || !fileBuffers[sourceFile.name]) continue;
    
    const targetW = Math.round((item.w - margin) * PX_PER_CM);
    const targetH = Math.round((item.h - margin) * PX_PER_CM);
    const key = `${sourceFile.name}_${targetW}x${targetH}_${item.rotated ? 'r' : 'n'}`;
    
    if (!cache.has(key)) {
      cache.set(key, null); // placeholder to deduplicate
      needed.push({ key, sourceName: sourceFile.name, targetW, targetH, rotated: item.rotated });
    }
  }

  console.log(`[ROLL] Pre-resize: ${needed.length} unique combos from ${allItems.length} items`);

  // Process in parallel batches of 8
  const BATCH = 8;
  for (let i = 0; i < needed.length; i += BATCH) {
    const batch = needed.slice(i, i + BATCH);
    await Promise.all(batch.map(async ({ key, sourceName, targetW, targetH, rotated }) => {
      try {
        let pipeline = sharp(fileBuffers[sourceName], { limitInputPixels: false });
        if (rotated) pipeline = pipeline.rotate(-90);
        const buf = await pipeline.resize(targetW, targetH, { fit: 'fill' }).png().toBuffer();
        cache.set(key, buf);
      } catch (e) {
        console.warn(`[ROLL]   Resize failed ${key}: ${e.message}`);
      }
    }));
  }

  return cache;
}

// ===== HELPER: Generate one roll image =====
async function generateRollImage({
  rollItems, canvasW, printableWidthPx, marginPx, margin,
  labelHeightPx, gapPx, totalOffsetPx, rollYOffset,
  logoBuffer, logoWidthInLabel, logoHeightInLabel,
  textStartX, files, config, rollLabel, infoLines,
  resizeCache
}) {
  const composites = [];
  
  let maxBottomY = 0;
  for (const item of rollItems) {
    const localBottom = (item.y - rollYOffset + item.h);
    if (localBottom > maxBottomY) maxBottomY = localBottom;
  }
  const contentHeightCm = maxBottomY;
  const canvasH = Math.round((contentHeightCm + LABEL_HEIGHT_CM * 2 + GAP_AFTER_LABEL_CM + BOTTOM_GAP_CM) * PX_PER_CM);

  // TOP LABEL
  const topTitle = rollLabel 
    ? `▶ START — ${infoLines.line1} — ${rollLabel}`
    : `▶ START — ${infoLines.line1}`;
  composites.push({ input: buildLabelSvg(canvasW, labelHeightPx, textStartX, {
    title: topTitle, info: infoLines.line2,
    files: infoLines.fileList.substring(0, 200), printer: infoLines.printerLine
  }), top: 0, left: 0 });

  // Logo in top label
  if (logoBuffer) {
    const resizedLogo = await sharp(logoBuffer, SHARP_OPTS)
      .resize(logoWidthInLabel, logoHeightInLabel, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png().toBuffer();
    composites.push({ input: resizedLogo, top: Math.round((labelHeightPx - logoHeightInLabel) / 2), left: Math.round(PX_PER_CM * 0.3) });
  }

  // PLACED ITEMS — use pre-resized cache (no sharp processing here!)
  for (const item of rollItems) {
    const sourceFile = files.find(f => f.fileNum === item.fileNum);
    if (!sourceFile) continue;

    const targetW = Math.round((item.w - margin) * PX_PER_CM);
    const targetH = Math.round((item.h - margin) * PX_PER_CM);
    const key = `${sourceFile.name}_${targetW}x${targetH}_${item.rotated ? 'r' : 'n'}`;
    const buf = resizeCache.get(key);
    if (!buf) continue;

    const x = Math.round(item.x * PX_PER_CM) - marginPx;
    const y = Math.round((item.y - rollYOffset) * PX_PER_CM) + totalOffsetPx;
    composites.push({ input: buf, top: y, left: x });
  }

  // BOTTOM LABEL
  const bottomY = canvasH - labelHeightPx;
  const bottomTitle = rollLabel
    ? `■ EINDE — ${infoLines.line1} — ${rollLabel}`
    : `■ EINDE — ${infoLines.line1}`;
  composites.push({ input: buildLabelSvg(canvasW, labelHeightPx, textStartX, {
    title: bottomTitle, info: infoLines.line2, files: '', printer: infoLines.printerLine
  }), top: bottomY, left: 0 });

  // Logo in bottom label
  if (logoBuffer) {
    const resizedLogo2 = await sharp(logoBuffer, SHARP_OPTS)
      .resize(logoWidthInLabel, logoHeightInLabel, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png().toBuffer();
    composites.push({ input: resizedLogo2, top: bottomY + Math.round((labelHeightPx - logoHeightInLabel) / 2), left: Math.round(PX_PER_CM * 0.3) });
  }

  // COMPOSE — high compression = smaller file = faster upload
  const rollPng = await sharp({
    create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    limitInputPixels: false
  })
  .composite(composites)
  .withMetadata({ density: 300 })
  .png({ compressionLevel: 9, adaptiveFiltering: false })
  .toBuffer();

  return { rollPng, canvasH, contentHeightCm };
}

// ===== MAIN ENDPOINT =====
app.post('/generate-roll', async (req, res) => {
  const startTime = Date.now();
  const timer = (label) => console.log(`[ROLL] ⏱ ${label}: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
  
  try {
    const { config, placed, totalLength, files, customer, orderFolder, orderId } = req.body;

    if (!config || !placed || !files || !orderFolder) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`[ROLL] Starting: ${placed.length} items, ${totalLength}cm, ${files.length} files`);

    // ===== DIMENSIONS =====
    const margin = config.cutMargin / 10;
    const printableWidthPx = Math.round(config.printableWidth * PX_PER_CM);
    const marginPx = Math.round(((config.rollWidth - config.printableWidth) / 2) * PX_PER_CM);
    const labelHeightPx = Math.round(LABEL_HEIGHT_CM * PX_PER_CM);
    const gapPx = Math.round(GAP_AFTER_LABEL_CM * PX_PER_CM);
    const totalOffsetPx = labelHeightPx + gapPx;
    const canvasW = printableWidthPx;

    // ===== PARALLEL: Download files + logo =====
    const bucket = config.supabaseBucket || 'printflow';
    
    const [fileBuffers, { buffer: logoBuffer, meta: logoMeta }] = await Promise.all([
      // All file downloads in parallel
      (async () => {
        const buffers = {};
        await Promise.all(files.map(async (f) => {
          const path = f.storagePath || `${orderFolder}/${f.name}`;
          try {
            const { data, error } = await sb.storage.from(bucket).download(path);
            if (error) { console.warn(`[ROLL]   Skip: ${error.message}`); return; }
            buffers[f.name] = Buffer.from(await data.arrayBuffer());
          } catch (e) {
            console.warn(`[ROLL]   Error: ${e.message}`);
          }
        }));
        return buffers;
      })(),
      // Logo (cached)
      getCachedLogo(config.printerLogo)
    ]);

    timer('Downloads');

    // ===== LABEL CONFIG =====
    let logoOffsetPx = 0, logoWidthInLabel = 0, logoHeightInLabel = 0;
    if (logoBuffer && logoMeta) {
      logoHeightInLabel = Math.round(labelHeightPx * 0.7);
      logoWidthInLabel = Math.round(logoHeightInLabel * (logoMeta.width / logoMeta.height));
      logoOffsetPx = logoWidthInLabel + Math.round(PX_PER_CM * 0.5);
    }
    const textStartX = Math.round(PX_PER_CM * 0.5) + logoOffsetPx;

    const dateStr = new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
      + ' ' + new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
    const custName = customer?.name || '';
    const custCompany = customer?.company || '';
    const infoLines = {
      line1: custName ? `${orderId || 'PF-???'}  |  ${custName}${custCompany ? ' — ' + custCompany : ''}` : 'GEK | SAAS™ — Preview',
      line2: `${files.length} bestanden | ${placed.length} items | ${totalLength.toFixed(1)}cm | ${dateStr}`,
      fileList: files.map(f => `${f.displayName || f.name} (${f.quantity || '?'}x)`).join('  |  '),
      printerLine: `Gedrukt door ${config.printerName || 'GEK | SAAS'} · GEK | SAAS™`
    };

    // ===== SPLIT INTO ROLLS =====
    const labelOverhead = LABEL_HEIGHT_CM * 2 + GAP_AFTER_LABEL_CM + BOTTOM_GAP_CM;
    const rollGroups = splitIntoRolls(placed, MAX_ROLL_LENGTH_CM - labelOverhead);
    const totalRolls = rollGroups.length;
    console.log(`[ROLL] ${totalRolls} roll(s)`);

    // ===== PRE-RESIZE: All unique file×size combos =====
    const resizeCache = await preResizeItems(rollGroups.flat(), fileBuffers, files, margin);
    timer('Pre-resize');

    // ===== GENERATE ALL ROLLS IN PARALLEL =====
    const timestamp = new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const companySlug = custCompany ? custCompany.replace(/[^a-zA-Z0-9]/g, '_') + '_' : '';
    const nameSlug = custName.replace(/[^a-zA-Z0-9]/g, '_');

    const generatedRolls = await Promise.all(rollGroups.map(async (rollItems, rollIdx) => {
      const rollNum = rollIdx + 1;
      const rollLabel = totalRolls > 1 ? `Roll ${rollNum}/${totalRolls}` : '';
      const rollYOffset = rollItems.length > 0 ? rollItems[0].y : 0;

      const { rollPng, canvasH, contentHeightCm } = await generateRollImage({
        rollItems, canvasW, printableWidthPx, marginPx, margin,
        labelHeightPx, gapPx, totalOffsetPx, rollYOffset,
        logoBuffer, logoWidthInLabel, logoHeightInLabel,
        textStartX, files, config, rollLabel, infoLines,
        resizeCache
      });

      const rollFileName = totalRolls > 1
        ? `${timestamp}_GS-DRS_${companySlug}${nameSlug}_rolindeling_${rollNum}van${totalRolls}_${config.printableWidth}cm.png`
        : `${timestamp}_GS-DRS_${companySlug}${nameSlug}_rolindeling_${config.printableWidth}cm.png`;

      console.log(`[ROLL]   Roll ${rollNum}: ${(rollPng.length / 1024 / 1024).toFixed(1)} MB`);
      return { rollNum, rollPng, rollFileName, contentHeightCm, canvasH, itemCount: rollItems.length };
    }));

    timer('Generation');

    // ===== UPLOAD ALL ROLLS IN PARALLEL =====
    const results = await Promise.all(generatedRolls.map(async ({ rollNum, rollPng, rollFileName, contentHeightCm, canvasH, itemCount }) => {
      const rollPath = `${orderFolder}/${rollFileName}`;
      
      const { error: uploadError } = await sb.storage
        .from(bucket)
        .upload(rollPath, rollPng, { contentType: 'image/png', upsert: true });

      if (uploadError) {
        console.error(`[ROLL]   Upload fail roll ${rollNum}: ${uploadError.message}`);
        return { error: uploadError.message, rollNum };
      }

      const { data: urlData } = sb.storage.from(bucket).getPublicUrl(rollPath);
      return {
        rollNum, rollUrl: urlData.publicUrl, rollPath, rollFileName,
        sizeMB: (rollPng.length / 1024 / 1024).toFixed(1),
        items: itemCount, lengthCm: contentHeightCm.toFixed(1),
        dimensions: `${canvasW}x${canvasH}px`
      };
    }));

    timer('Upload');

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[ROLL] ✅ Done in ${elapsed}s — ${totalRolls} roll(s)`);

    const firstRoll = results.find(r => r.rollUrl);
    res.json({
      success: true,
      rollUrl: firstRoll?.rollUrl || null,
      rollPath: firstRoll?.rollPath || null,
      rollFileName: firstRoll?.rollFileName || null,
      sizeMB: firstRoll?.sizeMB || '0',
      totalRolls, rolls: results,
      elapsed: elapsed + 's',
      items: placed.length,
      maxRollLengthCm: MAX_ROLL_LENGTH_CM
    });

  } catch (err) {
    console.error('[ROLL] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== TIFF CONVERTER (server-side, no browser canvas limits) =====
app.post('/convert-tiff', tiffUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const startTime = Date.now();
    const originalName = req.file.originalname || 'output.png';
    console.log(`[TIFF] Converting: ${originalName} (${(req.file.size / 1024 / 1024).toFixed(1)} MB)`);

    const inputBuffer = req.file.buffer;
    const meta = await sharp(inputBuffer, { limitInputPixels: false }).metadata();
    const { width, height } = meta;
    const dpi = meta.density || 300;

    console.log(`[TIFF] Dimensions: ${width}x${height} @ ${dpi} DPI (${(width * height / 1e6).toFixed(1)}M pixels)`);

    // Get raw RGBA pixels
    const { data: rgba } = await sharp(inputBuffer, { limitInputPixels: false })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // White fix — same logic as client-side TIFF Converter
    const rgb = Buffer.alloc(width * height * 3);
    let whiteFixed = 0;
    let transparentFixed = 0;

    for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
      const r = rgba[i], g = rgba[i + 1], b = rgba[i + 2], a = rgba[i + 3];
      if (a < 10) {
        // Transparent → pure white (no ink for FlexiRIP)
        rgb[j] = 255; rgb[j + 1] = 255; rgb[j + 2] = 255;
        transparentFixed++;
      } else if (r === 255 && g === 255 && b === 255) {
        // Design white → 252 blue (FlexiRIP sees as color → prints white ink)
        rgb[j] = 255; rgb[j + 1] = 255; rgb[j + 2] = 252;
        whiteFixed++;
      } else {
        rgb[j] = r; rgb[j + 1] = g; rgb[j + 2] = b;
      }
    }

    console.log(`[TIFF] White fix: ${whiteFixed.toLocaleString()} white, ${transparentFixed.toLocaleString()} transparent`);

    // Build TIFF — uncompressed RGB 8-bit (FlexiRIP compatible)
    const tiffBuffer = await sharp(rgb, {
      raw: { width, height, channels: 3 },
      limitInputPixels: false
    })
      .withMetadata({ density: dpi })
      .tiff({ compression: 'none', bitdepth: 8 })
      .toBuffer();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[TIFF] Done: ${(tiffBuffer.length / 1024 / 1024).toFixed(1)} MB in ${elapsed}s`);

    const outputName = originalName.replace(/\.png$/i, '') + '_FLEXIRIP.tiff';
    res.setHeader('Content-Type', 'image/tiff');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(outputName)}"`);
    res.setHeader('X-White-Fixed', whiteFixed.toString());
    res.setHeader('X-Transparent-Fixed', transparentFixed.toString());
    res.setHeader('X-DPI', dpi.toString());
    res.setHeader('X-Dimensions', `${width}x${height}`);
    res.setHeader('X-Elapsed', elapsed);
    res.send(tiffBuffer);

  } catch (err) {
    console.error('[TIFF] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🖨️ GEK Roll Generator v3.1.0 running on port ${PORT}`);
  console.log(`   Max roll: ${MAX_ROLL_LENGTH_CM}cm | TIFF Converter: /convert-tiff`);
});

