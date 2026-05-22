/* ============================================================
   G|PRINT DTF Prep — Panel Client Script
   Bridges UI ↔ ExtendScript via CSInterface.evalScript()
   ============================================================ */

(function () {
  'use strict';

  var cs = new CSInterface();
  var $ = function (id) { return document.getElementById(id); };

  // Captured color state (RGB 0-255)
  var captured = { r: 0, g: 0, b: 0, has: false };

  // ---------- Status helpers ----------

  function status(msg, kind) {
    var el = $('status');
    el.textContent = msg || '';
    el.className = 'status ' + (kind || '');
  }

  function busy(msg) { status(msg || 'Working…', 'busy'); }
  function ok(msg)   { status(msg, 'ok'); }
  function err(msg)  { status(msg, 'err'); }

  // ---------- Host call ----------

  function callHost(fnName, args, cb) {
    var parts = [];
    args = args || [];
    for (var i = 0; i < args.length; i++) parts.push(JSON.stringify(args[i]));
    var script = fnName + '(' + parts.join(',') + ')';

    cs.evalScript(script, function (result) {
      var payload;
      try {
        payload = JSON.parse(result);
      } catch (e) {
        // ExtendScript can return "EvalScript error." or undefined
        err('Host error: ' + result);
        return;
      }
      if (!payload || payload.ok === false) {
        err((payload && payload.error) || 'Unknown error');
        return;
      }
      if (cb) cb(payload.data || {});
    });
  }

  // ---------- 1. Load ----------

  $('btnLoad').addEventListener('click', function () {
    busy('Loading image…');
    callHost('loadImage', [], function (data) {
      $('loadMeta').textContent = data.name + ' — ' + data.width + '×' + data.height + ' px';
      ok('Loaded ' + data.name);
    });
  });

  // ---------- 2. Trace ----------

  var presetSel = $('presetSel');
  var thresholdGroup = $('thresholdGroup');
  var thresholdSlider = $('thresholdSlider');
  var thresholdVal = $('thresholdVal');

  function updateThresholdVisibility() {
    thresholdGroup.style.display = (presetSel.value === 'bw') ? '' : 'none';
  }

  presetSel.addEventListener('change', updateThresholdVisibility);
  updateThresholdVisibility();

  thresholdSlider.addEventListener('input', function () {
    thresholdVal.textContent = thresholdSlider.value;
  });

  $('btnTrace').addEventListener('click', function () {
    busy('Tracing…');
    callHost('traceImage', [presetSel.value, parseInt(thresholdSlider.value, 10)], function (data) {
      ok('Traced (' + data.preset + ')');
    });
  });

  $('btnExpand').addEventListener('click', function () {
    busy('Expanding + ungrouping…');
    callHost('expandAndUngroup', [], function (data) {
      ok('Expanded → ' + data.paths + ' paths');
    });
  });

  // ---------- 3. Colors ----------

  var tolSlider = $('tolSlider');
  var tolVal = $('tolVal');
  tolSlider.addEventListener('input', function () {
    tolVal.textContent = tolSlider.value;
  });

  $('btnGetColor').addEventListener('click', function () {
    busy('Getting color…');
    callHost('getSelectedColor', [], function (data) {
      captured.r = data.r; captured.g = data.g; captured.b = data.b; captured.has = true;
      $('swatch').style.background = 'rgb(' + data.r + ',' + data.g + ',' + data.b + ')';
      $('swatchRGB').textContent = 'rgb(' + data.r + ', ' + data.g + ', ' + data.b + ')';
      ok('Captured rgb(' + data.r + ',' + data.g + ',' + data.b + ')');
    });
  });

  $('btnRemoveColor').addEventListener('click', function () {
    if (!captured.has) { err('Capture a color first.'); return; }
    busy('Removing matching paths…');
    callHost('removeColor', [captured.r, captured.g, captured.b, parseInt(tolSlider.value, 10)], function (data) {
      ok('Removed ' + data.removed + ' paths');
    });
  });

  $('btnSwap').addEventListener('click', function () {
    busy('Swapping black ↔ white…');
    callHost('swapBlackWhite', [], function (data) {
      ok('Swapped ' + data.swapped + ' paths');
    });
  });

  $('btnInvert').addEventListener('click', function () {
    busy('Inverting colors…');
    callHost('invertAllColors', [], function (data) {
      ok('Inverted ' + data.inverted + ' paths');
    });
  });

  // ---------- 3.5 Halftone ----------

  var halftoneShape = $('halftoneShape');
  var dotSlider     = $('dotSlider');
  var dotVal        = $('dotVal');
  var spacingSlider = $('spacingSlider');
  var spacingVal    = $('spacingVal');
  var angleSlider   = $('angleSlider');
  var angleVal      = $('angleVal');

  // Keep spacing >= dotSize so dots don't overlap by default.
  // Bumps spacing along with dot size unless the user has dragged spacing past it.
  var spacingTouched = false;
  spacingSlider.addEventListener('input', function () {
    spacingTouched = true;
    spacingVal.textContent = spacingSlider.value;
  });
  dotSlider.addEventListener('input', function () {
    dotVal.textContent = dotSlider.value;
    var dot = parseInt(dotSlider.value, 10);
    if (!spacingTouched || parseInt(spacingSlider.value, 10) < dot) {
      spacingSlider.value = Math.max(parseInt(spacingSlider.value, 10), dot * 2);
      spacingVal.textContent = spacingSlider.value;
    }
  });
  angleSlider.addEventListener('input', function () {
    angleVal.textContent = angleSlider.value;
  });

  $('btnHalftone').addEventListener('click', function () {
    var dot     = parseInt(dotSlider.value, 10);
    var spacing = parseInt(spacingSlider.value, 10);
    var shape   = halftoneShape.value;
    var angle   = parseInt(angleSlider.value, 10);
    busy('Applying halftone (' + shape + ', ' + dot + 'pt)…');
    callHost('applyHalftone', [dot, spacing, shape, angle], function (data) {
      ok('Halftone: ' + data.dotsCreated + ' shapes on ' + data.pathsProcessed + ' paths');
    });
  });

  // ---------- 4. Preview ----------

  $('btnPrevBlack').addEventListener('click', function () {
    busy('Adding black preview…');
    callHost('addPreviewBackground', ['#000000'], function () { ok('Preview: black'); });
  });

  $('btnPrevWhite').addEventListener('click', function () {
    busy('Adding white preview…');
    callHost('addPreviewBackground', ['#FFFFFF'], function () { ok('Preview: white'); });
  });

  $('btnPrevRemove').addEventListener('click', function () {
    busy('Removing preview…');
    callHost('removePreviewBackground', [], function () { ok('Preview removed'); });
  });

  // ---------- 5. Export ----------

  $('btnExport').addEventListener('click', function () {
    var w  = parseFloat($('widthInput').value) || 25;
    var d  = parseInt($('dpiSel').value, 10) || 300;
    var m  = $('mirrorChk').checked;
    busy('Exporting PNG @ ' + d + ' DPI…');
    callHost('exportDTF', [w, d, m], function (data) {
      ok('Saved → ' + data.path);
    });
  });

  // ---------- Theme sync with Illustrator ----------

  function syncTheme() {
    try {
      var info = cs.getHostEnvironment().appSkinInfo;
      var c = info.panelBackgroundColor.color;
      // Illustrator returns 0-255 RGB; if it's very dark, keep our dark theme; just sync body bg precisely.
      var bg = 'rgb(' + Math.round(c.red) + ',' + Math.round(c.green) + ',' + Math.round(c.blue) + ')';
      document.body.style.background = bg;
    } catch (e) { /* fallback to CSS default */ }
  }

  syncTheme();
  cs.addEventListener('com.adobe.csxs.events.ThemeColorChanged', syncTheme);

  status('Ready.', '');
})();
