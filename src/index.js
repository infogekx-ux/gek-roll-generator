const express = require('express');
const cors = require('cors');
const sharp = require('sharp');

// sharp v0.33+ removed static limitInputPixels — set per instance instead
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

// Constants matching client-side DTF Roll Studio
const PX_PER_CM = 118.11; // 300 DPI
const LABEL_HEIGHT_CM = 3;
const GAP_AFTER_LABEL_CM = 1;
const BOTTOM_GAP_CM = 0.5;
const MAX_ROLL_LENGTH_CM = 1000; // 10 meter max per roll

// ===== HEALTH CHECK =====
app.get('/', (req, res) => {
  res.json({ 
    service: 'GEK Roll Generator', 
    version: '2.0.0',
    status: 'ok',
    maxRollLength: MAX_ROLL_LENGTH_CM + 'cm',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

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
  
  if (currentRoll.length > 0) {
    rolls.push(currentRoll);
  }
  
  return rolls;
}

// ===== HELPER: Generate one roll image =====
async function generateRollImage({
  rollItems, canvasW, printableWidthPx, marginPx, margin,
  labelHeightPx, gapPx, totalOffsetPx, rollYOffset,
  logoBuffer, logoWidthInLabel, logoHeightInLabel,
  textStartX, fileBuffers, files, config, rollLabel, infoLines
}) {
  const composites = [];
  
  // Calculate canvas height for this roll
  let maxBottomY = 0;
  for (const item of rollItems) {
    const localBottom = (item.y - rollYOffset + item.h);
    if (localBottom > maxBottomY) maxBottomY = localBottom;
  }
  const contentHeightCm = maxBottomY;
  const canvasH = Math.round((contentHeightCm + LABEL_HEIGHT_CM * 2 + GAP_AFTER_LABEL_CM + BOTTOM_GAP_CM) * PX_PER_CM);
  
  console.log(`[ROLL]   ${rollLabel || 'Single roll'}: ${canvasW}x${canvasH}px (${(canvasW * canvasH / 1e6).toFixed(1)} MP), ${rollItems.length} items, ${contentHeightCm.toFixed(1)}cm`);

  // TOP LABEL
  const topTitle = rollLabel 
    ? `▶ START — ${infoLines.line1} — ${rollLabel}`
    : `▶ START — ${infoLines.line1}`;
  const topSvg = buildLabelSvg(canvasW, labelHeightPx, textStartX, {
    title: topTitle,
    info: infoLines.line2,
    files: infoLines.fileList.substring(0, 200),
    printer: infoLines.printerLine
  });
  composites.push({ input: topSvg, top: 0, left: 0 });

  // Logo in top label
  if (logoBuffer) {
    const resizedLogo = await sharp(logoBuffer, SHARP_OPTS)
      .resize(logoWidthInLabel, logoHeightInLabel, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    composites.push({
      input: resizedLogo,
      top: Math.round((labelHeightPx - logoHeightInLabel) / 2),
      left: Math.round(PX_PER_CM * 0.3),
    });
  }

  // PLACED ITEMS
  for (let i = 0; i < rollItems.length; i++) {
    const item = rollItems[i];
    const sourceFile = files.find(f => f.fileNum === item.fileNum);
    if (!sourceFile) continue;
    const buf = fileBuffers[sourceFile.name];
    if (!buf) continue;

    const targetW = Math.round((item.w - margin) * PX_PER_CM);
    const targetH = Math.round((item.h - margin) * PX_PER_CM);
    const x = Math.round(item.x * PX_PER_CM) - marginPx;
    const y = Math.round((item.y - rollYOffset) * PX_PER_CM) + totalOffsetPx;

    try {
      let imgPipeline = sharp(buf, { limitInputPixels: false });
      if (item.rotated) {
        imgPipeline = imgPipeline.rotate(-90);
      }
      const resized = await imgPipeline
        .resize(targetW, targetH, { fit: 'fill' })
        .png()
        .toBuffer();
      composites.push({ input: resized, top: y, left: x });
    } catch (e) {
      console.warn(`[ROLL]     Failed to process item ${i}: ${e.message}`);
    }

    if ((i + 1) % 50 === 0) {
      console.log(`[ROLL]     Processed ${i + 1}/${rollItems.length} items...`);
    }
  }

  // BOTTOM LABEL
  const bottomY = canvasH - labelHeightPx;
  const bottomTitle = rollLabel
    ? `■ EINDE — ${infoLines.line1} — ${rollLabel}`
    : `■ EINDE — ${infoLines.line1}`;
  const bottomSvg = buildLabelSvg(canvasW, labelHeightPx, textStartX, {
    title: bottomTitle,
    info: infoLines.line2,
    files: '',
    printer: infoLines.printerLine
  });
  composites.push({ input: bottomSvg, top: bottomY, left: 0 });

  // Logo in bottom label
  if (logoBuffer) {
    const resizedLogo2 = await sharp(logoBuffer, SHARP_OPTS)
      .resize(logoWidthInLabel, logoHeightInLabel, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    composites.push({
      input: resizedLogo2,
      top: bottomY + Math.round((labelHeightPx - logoHeightInLabel) / 2),
      left: Math.round(PX_PER_CM * 0.3),
    });
  }

  // COMPOSE
  const rollPng = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    },
    limitInputPixels: false
  })
  .composite(composites)
  .withMetadata({ density: 300 })
  .png({ compressionLevel: 6 })
  .toBuffer();

  return { rollPng, canvasH, contentHeightCm };
}

// ===== MAIN ENDPOINT =====
app.post('/generate-roll', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { 
      config, placed, totalLength, files, customer, orderFolder, orderId
    } = req.body;

    if (!config || !placed || !files || !orderFolder) {
      return res.status(400).json({ error: 'Missing required fields: config, placed, files, orderFolder' });
    }

    console.log(`[ROLL] Starting generation: ${placed.length} items, ${totalLength}cm, ${files.length} files`);

    // ===== DIMENSIONS =====
    const margin = config.cutMargin / 10;
    const printableWidthPx = Math.round(config.printableWidth * PX_PER_CM);
    const marginPx = Math.round(((config.rollWidth - config.printableWidth) / 2) * PX_PER_CM);
    const labelHeightPx = Math.round(LABEL_HEIGHT_CM * PX_PER_CM);
    const gapPx = Math.round(GAP_AFTER_LABEL_CM * PX_PER_CM);
    const totalOffsetPx = labelHeightPx + gapPx;
    const canvasW = printableWidthPx;

    // ===== DOWNLOAD FILES =====
    console.log(`[ROLL] Downloading ${files.length} source files...`);
    const bucket = config.supabaseBucket || 'printflow';
    const fileBuffers = {};

    for (const f of files) {
      const path = f.storagePath || `${orderFolder}/${f.name}`;
      console.log(`[ROLL]   Downloading: ${path}`);
      const { data, error } = await sb.storage.from(bucket).download(path);
      if (error) {
        console.warn(`[ROLL]   Warning: Could not download ${path}: ${error.message}`);
        continue;
      }
      const arrayBuf = await data.arrayBuffer();
      fileBuffers[f.name] = Buffer.from(arrayBuf);
    }
    console.log(`[ROLL] Downloaded ${Object.keys(fileBuffers).length}/${files.length} files`);

    // ===== DOWNLOAD LOGO =====
    let logoBuffer = null;
    let logoMeta = null;
    if (config.printerLogo) {
      try {
        const logoResp = await fetch(config.printerLogo);
        if (logoResp.ok) {
          const logoBuf = Buffer.from(await logoResp.arrayBuffer());
          logoMeta = await sharp(logoBuf, SHARP_OPTS).metadata();
          logoBuffer = logoBuf;
        }
      } catch (e) {
        console.warn(`[ROLL] Logo download failed: ${e.message}`);
      }
    }

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
    const line1 = custName 
      ? `${orderId || 'PF-???'}  |  ${custName}${custCompany ? ' — ' + custCompany : ''}` 
      : 'GEK | SAAS™ — Preview';
    const line2 = `${files.length} bestanden | ${placed.length} items | ${totalLength.toFixed(1)}cm | ${dateStr}`;
    const fileList = files.map(f => `${f.displayName || f.name} (${f.quantity || '?'}x)`).join('  |  ');
    const printerLine = `Gedrukt door ${config.printerName || 'GEK | SAAS'} · GEK | SAAS™`;
    const infoLines = { line1, line2, fileList, printerLine };

    // ===== SPLIT INTO ROLLS =====
    const labelOverhead = LABEL_HEIGHT_CM * 2 + GAP_AFTER_LABEL_CM + BOTTOM_GAP_CM;
    const maxContentPerRoll = MAX_ROLL_LENGTH_CM - labelOverhead;
    const rollGroups = splitIntoRolls(placed, maxContentPerRoll);
    const totalRolls = rollGroups.length;
    
    console.log(`[ROLL] Split into ${totalRolls} roll(s) (max ${MAX_ROLL_LENGTH_CM}cm per roll)`);

    // ===== GENERATE EACH ROLL =====
    const results = [];
    const timestamp = new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const companySlug = custCompany ? custCompany.replace(/[^a-zA-Z0-9]/g, '_') + '_' : '';
    const nameSlug = custName.replace(/[^a-zA-Z0-9]/g, '_');

    for (let rollIdx = 0; rollIdx < totalRolls; rollIdx++) {
      const rollItems = rollGroups[rollIdx];
      const rollNum = rollIdx + 1;
      const rollLabel = totalRolls > 1 ? `Rolka ${rollNum}/${totalRolls}` : '';
      const rollYOffset = rollItems.length > 0 ? rollItems[0].y : 0;

      console.log(`[ROLL] Generating roll ${rollNum}/${totalRolls}...`);

      const { rollPng, canvasH, contentHeightCm } = await generateRollImage({
        rollItems, canvasW, printableWidthPx, marginPx, margin,
        labelHeightPx, gapPx, totalOffsetPx, rollYOffset,
        logoBuffer, logoWidthInLabel, logoHeightInLabel,
        textStartX, fileBuffers, files, config, rollLabel, infoLines
      });

      console.log(`[ROLL]   Roll ${rollNum}: ${(rollPng.length / 1024 / 1024).toFixed(1)} MB`);

      // Build filename
      let rollFileName;
      if (totalRolls > 1) {
        rollFileName = `${timestamp}_GS-DRS_${companySlug}${nameSlug}_rolindeling_${rollNum}van${totalRolls}_${config.printableWidth}cm.png`;
      } else {
        rollFileName = `${timestamp}_GS-DRS_${companySlug}${nameSlug}_rolindeling_${config.printableWidth}cm.png`;
      }
      const rollPath = `${orderFolder}/${rollFileName}`;

      console.log(`[ROLL]   Uploading: ${rollPath}`);
      const { error: uploadError } = await sb.storage
        .from(bucket)
        .upload(rollPath, rollPng, { contentType: 'image/png', upsert: true });

      if (uploadError) {
        console.error(`[ROLL]   Upload failed: ${uploadError.message}`);
        results.push({ error: uploadError.message, rollNum });
        continue;
      }

      const { data: urlData } = sb.storage.from(bucket).getPublicUrl(rollPath);
      
      results.push({
        rollNum,
        rollUrl: urlData.publicUrl,
        rollPath,
        rollFileName,
        sizeMB: (rollPng.length / 1024 / 1024).toFixed(1),
        items: rollItems.length,
        lengthCm: contentHeightCm.toFixed(1),
        dimensions: `${canvasW}x${canvasH}px`
      });
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[ROLL] ✅ Done in ${elapsed}s — ${totalRolls} roll(s) generated`);

    // Backward compatible + multi-roll response
    const firstRoll = results.find(r => r.rollUrl);
    
    res.json({
      success: true,
      rollUrl: firstRoll?.rollUrl || null,
      rollPath: firstRoll?.rollPath || null,
      rollFileName: firstRoll?.rollFileName || null,
      sizeMB: firstRoll?.sizeMB || '0',
      totalRolls,
      rolls: results,
      elapsed: elapsed + 's',
      items: placed.length,
      maxRollLengthCm: MAX_ROLL_LENGTH_CM
    });

  } catch (err) {
    console.error('[ROLL] Error:', err);
    res.status(500).json({ error: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
  }
});

// ===== START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🖨️ GEK Roll Generator v2.0.0 running on port ${PORT}`);
  console.log(`   Max roll length: ${MAX_ROLL_LENGTH_CM}cm (${MAX_ROLL_LENGTH_CM / 100}m)`);
  console.log(`   Supabase: ${SB_URL}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
