'use strict';
// ============================================================
// MISJA 5 — DRS image tools UI (DELTA — APPEND po studio.js, nie replace!)
// Dodaje [Remove BG] + [Vectorize] na każdym wierszu designu, spinner,
// panel before/after, Apply/Cancel. Wszystko server-side przez edge functions
// (remove-bg / vectorize → Railway). NIE rusza istniejących funkcji studio.js.
// Załaduj PO js/studio.js:  <script src="js/studio-with-tools.js"></script>
// ============================================================
(function () {
  if (typeof window === 'undefined' || !window.DRS) return;
  var DRS = window.DRS;

  function T(key, fallback) {
    try { var v = DRS.t ? DRS.t(key) : null; return (v && v !== key) ? v : fallback; }
    catch (e) { return fallback; }
  }

  function dpiOf(f) {
    return (f.loaded && f.widthCm > 0) ? Math.round(f.width / (f.widthCm / 2.54)) : 300;
  }

  // Original design → PNG data URL (źródło dla backendu).
  function entryToDataURL(f) {
    var img = f.imgEl;
    if (img && (img.naturalWidth || img.width)) {
      var c = document.createElement('canvas');
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      c.getContext('2d').drawImage(img, 0, 0);
      return c.toDataURL('image/png');
    }
    return f.url || null;
  }

  // Edge function call (frontend → Supabase edge → Railway). Zwraca data.
  function callEdge(fn, body) {
    if (!DRS.sb || !DRS.sb.functions) return Promise.reject(new Error('Supabase client unavailable'));
    return DRS.sb.functions.invoke(fn, { body: body }).then(function (res) {
      if (res.error) throw new Error(res.error.message || 'edge error');
      if (res.data && res.data.error) throw new Error(res.data.error);
      return res.data;
    });
  }

  function setSpinner(row, on) {
    var thumb = row.querySelector('.file-thumb');
    if (!thumb) return;
    var sp = thumb.querySelector('.thumb-spinner');
    if (on && !sp) { sp = document.createElement('div'); sp.className = 'thumb-spinner'; thumb.appendChild(sp); }
    else if (!on && sp) { sp.remove(); }
  }

  function clearCompare(row) {
    var c = row.querySelector('.design-preview-compare');
    if (c) c.remove();
  }

  // Wstaw panel before/after do .file-info
  function showCompare(row, f, opts) {
    clearCompare(row);
    var info = row.querySelector('.file-info');
    if (!info) return;
    var panel = document.createElement('div');
    panel.className = 'design-preview-compare';
    panel.innerHTML =
      '<div class="design-compare-pane design-compare-before">' +
        '<div class="design-preview-label">' + T('tool_before', 'Before') + '</div>' +
        '<img src="' + opts.beforeSrc + '" alt="">' +
      '</div>' +
      '<div class="design-compare-pane design-compare-after">' +
        '<div class="design-preview-label">' + T('tool_after', 'After') + '</div>' +
        '<img src="' + opts.afterSrc + '" alt="">' +
      '</div>' +
      '<div class="design-compare-meta">' +
        '<div class="design-compare-info">' + opts.info + '</div>' +
        (opts.warn ? '<div class="design-compare-warn">' + opts.warn + '</div>' : '') +
        '<div class="design-compare-actions">' +
          '<button class="btn-apply">' + opts.applyLabel + '</button>' +
          '<button class="btn-cancel">' + T('tool_cancel', 'Keep original') + '</button>' +
        '</div>' +
      '</div>';
    info.appendChild(panel);
    panel.querySelector('.btn-apply').onclick = function () { opts.onApply(); clearCompare(row); };
    panel.querySelector('.btn-cancel').onclick = function () { clearCompare(row); };
  }

  // Podmień obraz w DRS.files. kind: 'bg' (zachowaj DPI, przelicz cm)
  //                                'vector' (zachowaj cm, przelicz DPI w górę)
  function applyImage(f, dataURL, kind, flags) {
    var img = new Image();
    img.onload = function () {
      f.imgEl = img;
      f.url = dataURL;
      f.origWidth = img.naturalWidth; f.origHeight = img.naturalHeight;
      if (DRS.trimTransparency) {
        try {
          var trim = DRS.trimTransparency(img, false);
          f.width = trim.width; f.height = trim.height; f.trimmedUrl = trim.url; f._trimCanvas = trim.canvas;
        } catch (e) { f.width = img.naturalWidth; f.height = img.naturalHeight; f.trimmedUrl = dataURL; }
      } else { f.width = img.naturalWidth; f.height = img.naturalHeight; f.trimmedUrl = dataURL; }

      if (kind === 'vector') {
        // ten sam fizyczny rozmiar, wyższa rozdzielczość → przelicz DPI
        if (f.widthCm > 0) { f.dpiW = Math.round(f.width / (f.widthCm / 2.54)); f.dpiH = Math.round(f.height / (f.heightCm / 2.54)); }
      } else {
        // bg removal: zachowaj DPI, przelicz wymiar fizyczny z nowych pikseli
        var dpi = (f.dpiW && f.dpiW > 0) ? f.dpiW : dpiOf(f);
        f.widthCm = Math.round((f.width / dpi) * 2.54 * 10) / 10;
        f.heightCm = Math.round((f.height / dpi) * 2.54 * 10) / 10;
      }
      f.loaded = true;
      f.isJpg = false; // wynik to zawsze PNG
      if (flags) for (var k in flags) f[k] = flags[k];
      if (DRS.renderStudioAll) DRS.renderStudioAll(); else DRS.renderFileList();
      if (DRS.toast) DRS.toast(T('tool_applied', 'Applied'), 'success');
    };
    img.src = dataURL;
  }

  function runRemoveBg(f, row, btn) {
    btn.classList.add('processing'); setSpinner(row, true);
    var before = entryToDataURL(f);
    callEdge('remove-bg', { imageBase64: before, mode: 'auto' }).then(function (data) {
      setSpinner(row, false); btn.classList.remove('processing');
      if (!data || !data.resultBase64) throw new Error('no result');
      var method = data.method || 'threshold';
      var info = T('tool_bg_done', 'Background removed') +
        ' · <strong>' + method.toUpperCase() + '</strong>' +
        (data.bgColor ? ' · ' + data.bgColor : '');
      var warn = (method === 'ai')
        ? T('tool_bg_ai_warn', 'AI-processed — review the result before printing.')
        : (data.changed === false ? T('tool_bg_nochange', 'Image already had a transparent background.') : '');
      showCompare(row, f, {
        beforeSrc: f.trimmedUrl || f.url, afterSrc: data.resultBase64,
        info: info, warn: warn, applyLabel: T('tool_apply', 'Apply'),
        onApply: function () { applyImage(f, data.resultBase64, 'bg', { bgRemoved: true }); },
      });
    }).catch(function (e) {
      setSpinner(row, false); btn.classList.remove('processing');
      if (DRS.toast) DRS.toast(T('tool_bg_fail', 'Background removal failed') + ': ' + e.message, 'error');
    });
  }

  function runVectorize(f, row, btn) {
    btn.classList.add('processing'); setSpinner(row, true);
    var srcDpi = dpiOf(f);
    var before = entryToDataURL(f);
    callEdge('vectorize', { imageBase64: before, colorMode: 'color', detail: 'high', targetDPI: 300, inputDPI: srcDpi })
      .then(function (data) {
        setSpinner(row, false); btn.classList.remove('processing');
        if (!data || !data.pngBase64) throw new Error('no result');
        var info = T('tool_vec_orig', 'Original') + ': ' + srcDpi + ' DPI → ' +
          T('tool_vec_out', 'Vectorized') + ': ' + (data.outputDPI || 300) + ' DPI · ' +
          (data.pathCount || 0) + ' ' + T('tool_vec_paths', 'paths');
        showCompare(row, f, {
          beforeSrc: f.trimmedUrl || f.url, afterSrc: data.pngBase64,
          info: info,
          warn: T('tool_vec_warn', 'Vectorized result may differ from original. Review before printing.'),
          applyLabel: T('tool_vec_apply', 'Apply vectorized'),
          onApply: function () { applyImage(f, data.pngBase64, 'vector', { vectorized: true }); },
        });
      }).catch(function (e) {
        setSpinner(row, false); btn.classList.remove('processing');
        if (DRS.toast) DRS.toast(T('tool_vec_fail', 'Vectorize failed') + ': ' + e.message, 'error');
      });
  }

  // Wstrzyknij pasek narzędzi do każdego wiersza (do .file-info, bez psucia gridu).
  function injectToolButtons() {
    var rows = document.querySelectorAll('#fileList .file-row');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var f = DRS.files[i];
      if (!f) continue;
      var info = row.querySelector('.file-info');
      if (!info || info.querySelector('.design-tools')) continue;
      var dpi = dpiOf(f);
      var bar = document.createElement('div');
      bar.className = 'design-tools';
      bar.innerHTML =
        '<button class="design-action-btn" data-act="bg" type="button"><i class="ti ti-eraser"></i> ' + T('tool_remove_bg', 'Remove BG') + '</button>' +
        '<button class="design-action-btn' + (dpi < 150 ? ' dpi-suggest' : '') + '" data-act="vec" type="button"><i class="ti ti-vector"></i> ' + T('tool_vectorize', 'Vectorize') + '</button>';
      info.appendChild(bar);
      (function (f, row) {
        bar.querySelector('[data-act=bg]').addEventListener('click', function () { runRemoveBg(f, row, this); });
        bar.querySelector('[data-act=vec]').addEventListener('click', function () { runVectorize(f, row, this); });
      })(f, row);
    }
  }

  // Monkey-patch renderFileList: po oryginalnym renderze wstrzyknij narzędzia.
  var origRenderFileList = DRS.renderFileList;
  if (typeof origRenderFileList === 'function') {
    DRS.renderFileList = function () {
      var r = origRenderFileList.apply(this, arguments);
      try { injectToolButtons(); } catch (e) { /* nigdy nie wywracaj studio.js */ }
      return r;
    };
  }

  DRS.tools = { runRemoveBg: runRemoveBg, runVectorize: runVectorize, injectToolButtons: injectToolButtons };

  // jeśli lista już wyrenderowana
  if (document.getElementById('fileList')) { try { injectToolButtons(); } catch (e) {} }
})();
