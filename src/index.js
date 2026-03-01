const express = require('express');
const cors = require('cors');
const sharp = require('sharp');

// Allow massive images - DTF rolls can be 30m+ (1.5 billion pixels)
sharp.limitInputPixels(false);  // Disable input pixel limit
sharp.cache(false);             // Disable cache for large images to save RAM
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

// ===== HEALTH CHECK =====
app.get('/', (req, res) => {
  res.json({ 
    service: 'GEK Roll Generator', 
    version: '1.0.0',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ===== MAIN ENDPOINT =====
app.post('/generate-roll', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { 
      config,           // { rollWidth, printableWidth, cutMargin, printerName, printerLogo, printerEmail, productType, supabaseBucket }
      placed,           // [{ id, fileNum, x, y, w, h, fileName, rotated }]
      totalLength,      // cm
      files,            // [{ name, storagePath }] - paths in Supabase Storage
      customer,         // { name, company, email, phone, ... }
      orderFolder,      // e.g. "orders/01-03-2026_GS-DRS_Company_Name"
      orderId           // e.g. "PF-ABC123"
    } = req.body;

    // Validate
    if (!config || !placed || !files || !orderFolder) {
      return res.status(400).json({ error: 'Missing required fields: config, placed, files, orderFolder' });
    }

    console.log(`[ROLL] Starting generation: ${placed.length} items, ${totalLength}cm, ${files.length} files`);

    // ===== DIMENSIONS =====
    const margin = config.cutMargin / 10; // mm to cm
    const printableWidthPx = Math.round(config.printableWidth * PX_PER_CM);
    const marginPx = Math.round(((config.rollWidth - config.printableWidth) / 2) * PX_PER_CM);
    const labelHeightPx = Math.round(LABEL_HEIGHT_CM * PX_PER_CM);
    const gapPx = Math.round(GAP_AFTER_LABEL_CM * PX_PER_CM);
    const totalOffsetPx = labelHeightPx + gapPx;
    const canvasW = printableWidthPx;
    const canvasH = Math.round((totalLength + LABEL_HEIGHT_CM * 2 + GAP_AFTER_LABEL_CM + BOTTOM_GAP_CM) * PX_PER_CM);

    console.log(`[ROLL] Canvas: ${canvasW}x${canvasH}px (${(canvasW * canvasH / 1e6).toFixed(1)} MP)`);

    // ===== DOWNLOAD FILES FROM SUPABASE =====
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

    // ===== DOWNLOAD LOGO (if configured) =====
    let logoBuffer = null;
    let logoMeta = null;
    if (config.printerLogo) {
      try {
        console.log(`[ROLL] Downloading logo: ${config.printerLogo}`);
        const logoResp = await fetch(config.printerLogo);
        if (logoResp.ok) {
          const logoBuf = Buffer.from(await logoResp.arrayBuffer());
          logoMeta = await sharp(logoBuf).metadata();
          logoBuffer = logoBuf;
        }
      } catch (e) {
        console.warn(`[ROLL] Logo download failed: ${e.message}`);
      }
    }

    // ===== BUILD LABEL SVG =====
    const dateStr = new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
      + ' ' + new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
    const totalItems = placed.length;
    const custName = customer?.name || '';
    const custCompany = customer?.company || '';
    
    const line1 = custName 
      ? `${orderId || 'PF-???'}  |  ${custName}${custCompany ? ' — ' + custCompany : ''}` 
      : 'GEK | SAAS™ — Preview';
    const line2 = `${files.length} bestanden | ${totalItems} items | ${totalLength.toFixed(1)}cm | ${dateStr}`;
    const fileList = files.map(f => `${f.displayName || f.name} (${f.quantity || '?'}x)`).join('  |  ');
    const printerLine = `Gedrukt door ${config.printerName || 'GEK | SAAS'} · GEK | SAAS™`;

    // Calculate logo offset for labels
    let logoOffsetPx = 0;
    let logoWidthInLabel = 0;
    let logoHeightInLabel = 0;
    if (logoBuffer && logoMeta) {
      logoHeightInLabel = Math.round(labelHeightPx * 0.7);
      logoWidthInLabel = Math.round(logoHeightInLabel * (logoMeta.width / logoMeta.height));
      logoOffsetPx = logoWidthInLabel + Math.round(PX_PER_CM * 0.5);
    }

    const textStartX = Math.round(PX_PER_CM * 0.5) + logoOffsetPx;
    const maxTextW = printableWidthPx - textStartX - Math.round(PX_PER_CM * 0.3);

    function escSvg(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function buildLabelSvg(prefix) {
      return Buffer.from(`<svg width="${canvasW}" height="${labelHeightPx}" xmlns="http://www.w3.org/2000/svg">
  <text x="${textStartX}" y="${Math.round(labelHeightPx * 0.35)}" font-family="sans-serif" font-weight="bold" font-size="${Math.round(PX_PER_CM * 0.4)}" fill="#333333">
    <tspan>${escSvg(prefix + ' — ' + line1)}</tspan>
  </text>
  <text x="${textStartX}" y="${Math.round(labelHeightPx * 0.58)}" font-family="sans-serif" font-size="${Math.round(PX_PER_CM * 0.3)}" fill="#666666">
    <tspan>${escSvg(line2)}</tspan>
  </text>
  <text x="${textStartX}" y="${Math.round(labelHeightPx * 0.76)}" font-family="sans-serif" font-size="${Math.round(PX_PER_CM * 0.22)}" fill="#999999">
    <tspan>${escSvg(fileList.substring(0, 200))}</tspan>
  </text>
  <text x="${textStartX}" y="${Math.round(labelHeightPx * 0.93)}" font-family="sans-serif" font-weight="bold" font-size="${Math.round(PX_PER_CM * 0.25)}" fill="#444444">
    <tspan>${escSvg(printerLine)}</tspan>
  </text>
</svg>`);
    }

    function buildBottomLabelSvg() {
      return Buffer.from(`<svg width="${canvasW}" height="${labelHeightPx}" xmlns="http://www.w3.org/2000/svg">
  <text x="${textStartX}" y="${Math.round(labelHeightPx * 0.35)}" font-family="sans-serif" font-weight="bold" font-size="${Math.round(PX_PER_CM * 0.4)}" fill="#333333">
    <tspan>${escSvg('■ EINDE — ' + line1)}</tspan>
  </text>
  <text x="${textStartX}" y="${Math.round(labelHeightPx * 0.58)}" font-family="sans-serif" font-size="${Math.round(PX_PER_CM * 0.3)}" fill="#666666">
    <tspan>${escSvg(line2)}</tspan>
  </text>
  <text x="${textStartX}" y="${Math.round(labelHeightPx * 0.8)}" font-family="sans-serif" font-weight="bold" font-size="${Math.round(PX_PER_CM * 0.25)}" fill="#444444">
    <tspan>${escSvg(printerLine)}</tspan>
  </text>
</svg>`);
    }

    // ===== GENERATE ROLL IMAGE WITH SHARP =====
    console.log(`[ROLL] Compositing ${placed.length} items onto ${canvasW}x${canvasH} canvas...`);

    // Start with transparent canvas
    const composites = [];

    // TOP LABEL
    const topLabelSvg = buildLabelSvg('▶ START');
    composites.push({
      input: topLabelSvg,
      top: 0,
      left: 0,
    });

    // Logo in top label
    if (logoBuffer) {
      const resizedLogo = await sharp(logoBuffer)
        .resize(logoWidthInLabel, logoHeightInLabel, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      
      composites.push({
        input: resizedLogo,
        top: Math.round((labelHeightPx - logoHeightInLabel) / 2),
        left: Math.round(PX_PER_CM * 0.3),
      });
    }

    // PLACED ITEMS — composite each image
    for (let i = 0; i < placed.length; i++) {
      const item = placed[i];
      
      // Find the source file
      const sourceFile = files.find(f => f.fileNum === item.fileNum);
      if (!sourceFile) continue;
      
      const buf = fileBuffers[sourceFile.name];
      if (!buf) continue;

      const targetW = Math.round((item.w - margin) * PX_PER_CM);
      const targetH = Math.round((item.h - margin) * PX_PER_CM);
      const x = Math.round(item.x * PX_PER_CM) - marginPx;
      const y = Math.round(item.y * PX_PER_CM) + totalOffsetPx;

      try {
        let imgPipeline = sharp(buf, { limitInputPixels: false });
        
        // Rotate if needed
        if (item.rotated) {
          imgPipeline = imgPipeline.rotate(-90);
        }

        const resized = await imgPipeline
          .resize(targetW, targetH, { fit: 'fill' })
          .png()
          .toBuffer();

        composites.push({
          input: resized,
          top: y,
          left: x,
        });
      } catch (e) {
        console.warn(`[ROLL]   Failed to process item ${i}: ${e.message}`);
      }

      // Progress log every 50 items
      if ((i + 1) % 50 === 0) {
        console.log(`[ROLL]   Processed ${i + 1}/${placed.length} items...`);
      }
    }

    // BOTTOM LABEL
    const bottomY = canvasH - labelHeightPx;
    const bottomLabelSvg = buildBottomLabelSvg();
    composites.push({
      input: bottomLabelSvg,
      top: bottomY,
      left: 0,
    });

    // Logo in bottom label
    if (logoBuffer) {
      const resizedLogo2 = await sharp(logoBuffer)
        .resize(logoWidthInLabel, logoHeightInLabel, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      
      composites.push({
        input: resizedLogo2,
        top: bottomY + Math.round((labelHeightPx - logoHeightInLabel) / 2),
        left: Math.round(PX_PER_CM * 0.3),
      });
    }

    // ===== COMPOSE FINAL IMAGE =====
    console.log(`[ROLL] Composing final image (${composites.length} layers)...`);
    
    const rollPng = await sharp({
      create: {
        width: canvasW,
        height: canvasH,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent — DigiRIP handles white underbase
      }
    })
    .composite(composites)
    .png({ 
      compressionLevel: 6,
      // DPI metadata
      density: 300 
    })
    .toBuffer();

    console.log(`[ROLL] PNG generated: ${(rollPng.length / 1024 / 1024).toFixed(1)} MB`);

    // ===== UPLOAD TO SUPABASE STORAGE =====
    const timestamp = new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const companySlug = custCompany ? custCompany.replace(/[^a-zA-Z0-9]/g, '_') + '_' : '';
    const nameSlug = custName.replace(/[^a-zA-Z0-9]/g, '_');
    const rollFileName = `${timestamp}_GS-DRS_${companySlug}${nameSlug}_rolindeling_${config.printableWidth}cm.png`;
    const rollPath = `${orderFolder}/${rollFileName}`;

    console.log(`[ROLL] Uploading to Supabase: ${rollPath}`);
    
    const { error: uploadError } = await sb.storage
      .from(bucket)
      .upload(rollPath, rollPng, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error(`[ROLL] Upload failed: ${uploadError.message}`);
      return res.status(500).json({ error: 'Failed to upload roll image', details: uploadError.message });
    }

    // Get public URL
    const { data: urlData } = sb.storage.from(bucket).getPublicUrl(rollPath);
    const rollUrl = urlData.publicUrl;

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[ROLL] ✅ Done in ${elapsed}s — ${rollUrl}`);

    res.json({
      success: true,
      rollUrl,
      rollPath,
      rollFileName,
      sizeMB: (rollPng.length / 1024 / 1024).toFixed(1),
      elapsed: elapsed + 's',
      items: placed.length,
      dimensions: `${canvasW}x${canvasH}px`
    });

  } catch (err) {
    console.error('[ROLL] Error:', err);
    res.status(500).json({ error: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
  }
});

// ===== START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🖨️ GEK Roll Generator running on port ${PORT}`);
  console.log(`   Supabase: ${SB_URL}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
