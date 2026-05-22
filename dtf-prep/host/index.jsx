// ============================================================
// G|PRINT DTF Prep - Host ExtendScript
// Adobe Illustrator 2024-2026 (CEP 11)
// ============================================================

#target illustrator

// ---------- Utilities ----------

function _doc() {
    if (app.documents.length === 0) {
        throw new Error("No document open. Create or open a document first.");
    }
    return app.activeDocument;
}

function _json(obj) {
    // ExtendScript has no JSON.stringify by default in older versions; build manually
    if (obj === null || obj === undefined) return "null";
    if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
    if (typeof obj === "string") {
        return '"' + obj.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t") + '"';
    }
    if (obj instanceof Array) {
        var parts = [];
        for (var i = 0; i < obj.length; i++) parts.push(_json(obj[i]));
        return "[" + parts.join(",") + "]";
    }
    if (typeof obj === "object") {
        var arr = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) arr.push('"' + k + '":' + _json(obj[k]));
        }
        return "{" + arr.join(",") + "}";
    }
    return "null";
}

function _ok(payload) { return _json({ ok: true, data: payload }); }
function _err(msg)    { return _json({ ok: false, error: String(msg) }); }

// Collect every pathItem in document, including those inside compoundPathItems and nested groups
function _allPaths(container) {
    var out = [];
    var c = container || _doc();
    // pathItems collection (top level)
    var i;
    if (c.pathItems) {
        for (i = 0; i < c.pathItems.length; i++) out.push(c.pathItems[i]);
    }
    if (c.compoundPathItems) {
        for (i = 0; i < c.compoundPathItems.length; i++) {
            var cp = c.compoundPathItems[i];
            for (var j = 0; j < cp.pathItems.length; j++) out.push(cp.pathItems[j]);
        }
    }
    // Note: pathItems on a document already includes nested ones (recursive collection).
    // For groups passed in, we recurse manually.
    if (c.groupItems && c !== _doc()) {
        for (i = 0; i < c.groupItems.length; i++) {
            var nested = _allPaths(c.groupItems[i]);
            for (var k = 0; k < nested.length; k++) out.push(nested[k]);
        }
    }
    return out;
}

function _isRGBColor(col) {
    return col && col.typename === "RGBColor";
}

function _colorMatch(col, r, g, b, tol) {
    if (!_isRGBColor(col)) return false;
    var dr = Math.abs(col.red   - r);
    var dg = Math.abs(col.green - g);
    var db = Math.abs(col.blue  - b);
    return (dr + dg + db) <= tol;
}

function _makeRGB(r, g, b) {
    var c = new RGBColor();
    c.red   = r;
    c.green = g;
    c.blue  = b;
    return c;
}

// ---------- 1. Load Image ----------

function loadImage() {
    try {
        var doc = _doc();
        var f = File.openDialog("Select PNG or JPG", "Images:*.png;*.jpg;*.jpeg");
        if (!f) return _err("Cancelled.");
        var placed = doc.placedItems.add();
        placed.file = f;
        // Marker so we can recover the embedded raster regardless of API variant
        var marker = "DTF_LOAD_" + (new Date()).getTime();
        try { placed.name = marker; } catch (eN) {}
        var embedResult;
        try { embedResult = placed.embed(); } catch (eE) {}

        var rItem = null;
        // Some Illustrator builds return the new raster from embed()
        if (embedResult && typeof embedResult === "object" && embedResult.typename === "RasterItem") {
            rItem = embedResult;
        }
        // Otherwise look up by preserved name
        if (!rItem) {
            for (var i = 0; i < doc.rasterItems.length; i++) {
                if (doc.rasterItems[i].name === marker) { rItem = doc.rasterItems[i]; break; }
            }
        }
        // Fallback: newly added items are at the front of the z-order
        if (!rItem) rItem = doc.rasterItems[0];
        if (!rItem) return _err("Embedded raster not found.");

        return _ok({ name: f.name, width: Math.round(rItem.width), height: Math.round(rItem.height) });
    } catch (e) {
        return _err(e.message || e);
    }
}

// ---------- 2. Trace ----------

function traceImage(preset, threshold) {
    try {
        var doc = _doc();
        if (doc.selection.length === 0) {
            // Try to select first raster
            if (doc.rasterItems.length === 0) return _err("No raster image to trace.");
            doc.selection = null;
            doc.rasterItems[0].selected = true;
        }
        var sel = doc.selection;
        var target = null;
        for (var i = 0; i < sel.length; i++) {
            if (sel[i].typename === "RasterItem" || sel[i].typename === "PlacedItem") {
                target = sel[i]; break;
            }
        }
        if (!target) return _err("Select a raster/placed image first.");

        var traced = target.trace();
        var opts = traced.tracing.tracingOptions;

        if (preset === "bw") {
            opts.tracingMode = TracingModeType.TRACINGMODEBLACKANDWHITE;
            opts.threshold = Math.max(0, Math.min(255, parseInt(threshold, 10) || 128));
            opts.pathFidelity = 80;
            opts.cornerFidelity = 50;
            opts.minimumArea = 10;
        } else if (preset === "silhouette") {
            opts.tracingMode = TracingModeType.TRACINGMODEBLACKANDWHITE;
            opts.threshold = 128;
            opts.pathFidelity = 50;
            opts.cornerFidelity = 75;
            opts.minimumArea = 25;
            opts.ignoreWhite = true;
        } else { // "detailed"
            opts.tracingMode = TracingModeType.TRACINGMODECOLOR;
            opts.tracingColorTypeValue = TracingColorType.LIMITEDCOLOR;
            opts.maxColors = 30;
            opts.pathFidelity = 90;
            opts.cornerFidelity = 75;
            opts.minimumArea = 5;
        }
        // Force preview refresh and keep the traced object selected so
        // expandAndUngroup() can act on it next.
        try { app.redraw(); } catch (eR) {}
        try {
            app.activeDocument.selection = null;
            traced.selected = true;
        } catch (eS) {}
        return _ok({ preset: preset });
    } catch (e) {
        return _err(e.message || e);
    }
}

// ---------- 3. Expand + Deep Ungroup ----------

function expandAndUngroup() {
    try {
        var doc = _doc();
        var didExpand = false;
        var expandMethod = "none";

        // Strategy 1: Tracing.expandTracing() — documented, locale-independent.
        // Any live-traced art lives as a PluginItem with a .tracing property.
        try {
            for (var p = doc.pluginItems.length - 1; p >= 0; p--) {
                var pi = doc.pluginItems[p];
                var trc = null;
                try { trc = pi.tracing; } catch (eT) {}
                if (trc) {
                    try { trc.expandTracing(); didExpand = true; expandMethod = "expandTracing"; }
                    catch (eE) {}
                }
            }
        } catch (eP) {}

        // Strategy 2: menu-command fallbacks. Internal command names are
        // English regardless of UI locale (verified on AI PL/EN builds).
        if (!didExpand) {
            var cmds = [
                "Live Trace/Expand",
                "Live Trace/Make and Expand",
                "expandStyle",
                "expand"
            ];
            for (var c = 0; c < cmds.length; c++) {
                try {
                    app.executeMenuCommand(cmds[c]);
                    didExpand = true; expandMethod = cmds[c];
                    break;
                } catch (eM) {}
            }
        }

        // Deep ungroup loop
        var safety = 50;
        while (safety-- > 0) {
            var groups = _collectGroups(doc);
            if (groups.length === 0) break;
            for (var i = groups.length - 1; i >= 0; i--) {
                var g = groups[i];
                try {
                    var parent = g.parent;
                    while (g.pageItems.length > 0) {
                        g.pageItems[0].move(parent, ElementPlacement.PLACEATBEGINNING);
                    }
                    g.remove();
                } catch (e) {}
            }
        }
        return _ok({
            paths: doc.pathItems.length,
            expanded: didExpand,
            method: expandMethod
        });
    } catch (e) {
        return _err(e.message || e);
    }
}

function _collectGroups(container) {
    var out = [];
    if (!container.groupItems) return out;
    for (var i = 0; i < container.groupItems.length; i++) {
        var g = container.groupItems[i];
        out.push(g);
        var nested = _collectGroups(g);
        for (var j = 0; j < nested.length; j++) out.push(nested[j]);
    }
    return out;
}

// ---------- 4. Color Operations ----------

function getSelectedColor() {
    try {
        var doc = _doc();
        if (doc.selection.length === 0) return _err("Select a path first.");
        var item = doc.selection[0];
        if (item.typename === "CompoundPathItem" && item.pathItems.length > 0) {
            item = item.pathItems[0];
        }
        if (item.typename !== "PathItem") return _err("Selection is not a path.");
        if (!item.filled || !_isRGBColor(item.fillColor)) {
            return _err("Selected path has no RGB fill.");
        }
        var c = item.fillColor;
        return _ok({
            r: Math.round(c.red),
            g: Math.round(c.green),
            b: Math.round(c.blue)
        });
    } catch (e) {
        return _err(e.message || e);
    }
}

function removeColor(r, g, b, tolerance) {
    try {
        _doc();
        var paths = _allPaths();
        var removed = 0;
        for (var i = paths.length - 1; i >= 0; i--) {
            var p = paths[i];
            try {
                if (p.filled && _colorMatch(p.fillColor, r, g, b, tolerance)) {
                    p.remove();
                    removed++;
                }
            } catch (e) {}
        }
        return _ok({ removed: removed });
    } catch (e) {
        return _err(e.message || e);
    }
}

function swapBlackWhite() {
    try {
        _doc();
        var paths = _allPaths();
        var swapped = 0;
        var BLACK = _makeRGB(0, 0, 0);
        var WHITE = _makeRGB(255, 255, 255);
        // Use a sentinel temp color (magenta 1,1,1 unlikely) to avoid double swap
        for (var i = 0; i < paths.length; i++) {
            var p = paths[i];
            if (!p.filled || !_isRGBColor(p.fillColor)) continue;
            var c = p.fillColor;
            if (c.red < 30 && c.green < 30 && c.blue < 30) {
                p.fillColor = WHITE; swapped++;
            } else if (c.red > 225 && c.green > 225 && c.blue > 225) {
                p.fillColor = BLACK; swapped++;
            }
        }
        return _ok({ swapped: swapped });
    } catch (e) {
        return _err(e.message || e);
    }
}

function invertAllColors() {
    try {
        _doc();
        var paths = _allPaths();
        var count = 0;
        for (var i = 0; i < paths.length; i++) {
            var p = paths[i];
            if (!p.filled || !_isRGBColor(p.fillColor)) continue;
            var c = p.fillColor;
            p.fillColor = _makeRGB(255 - c.red, 255 - c.green, 255 - c.blue);
            count++;
        }
        return _ok({ inverted: count });
    } catch (e) {
        return _err(e.message || e);
    }
}

// ---------- 5. Halftone ----------

// Convert each selected solid-fill path into a vector halftone pattern
// (grid of dots, squares, diamonds, or rows of lines).
// Replaces the original path; pattern is clipped to the original silhouette.
//
//   dotSize   - max shape size in pt   (typ. 2-16)
//   spacing   - center-to-center pitch (typ. dotSize * 1.5..2.5)
//   shape     - 'circle' | 'square' | 'diamond' | 'line'
//   angle     - grid rotation in degrees (0..90, classic DTF screen is 45)
function applyHalftone(dotSize, spacing, shape, angle) {
    try {
        var doc = _doc();
        var sel = doc.selection;
        if (!sel || sel.length === 0) return _err("Select artwork first.");

        dotSize = parseFloat(dotSize);   if (!(dotSize > 0)) dotSize = 6;
        spacing = parseFloat(spacing);   if (!(spacing > 0)) spacing = dotSize * 2;
        shape   = String(shape || "circle").toLowerCase();
        if (shape !== "circle" && shape !== "square" && shape !== "diamond" && shape !== "line") {
            shape = "circle";
        }
        angle = parseFloat(angle); if (isNaN(angle)) angle = 45;

        // Floor on spacing so we don't blow up the path count
        var minSpacing = Math.max(1.2, dotSize * 0.6);
        if (spacing < minSpacing) spacing = minSpacing;

        var rad = angle * Math.PI / 180;
        var cos = Math.cos(rad);
        var sin = Math.sin(rad);

        // Gather all solid paths to process (handles groups + compound paths)
        var targets = [];
        for (var i = 0; i < sel.length; i++) {
            var collected = _halftoneCollect(sel[i]);
            for (var k = 0; k < collected.length; k++) targets.push(collected[k]);
        }
        if (targets.length === 0) return _err("Selection has no fillable paths.");

        var totalDots = 0;
        var pathsProcessed = 0;
        for (var p = 0; p < targets.length; p++) {
            var n = _halftoneOnePath(targets[p], dotSize, spacing, shape, cos, sin);
            if (n > 0) { totalDots += n; pathsProcessed++; }
        }

        return _ok({
            dotSize:        dotSize,
            spacing:        spacing,
            shape:          shape,
            angle:          angle,
            dotsCreated:    totalDots,
            pathsProcessed: pathsProcessed
        });
    } catch (e) {
        return _err("Halftone failed: " + (e.message || e));
    }
}

// Walks selection, returning PathItems AND CompoundPathItems as units.
// CompoundPathItems are kept whole so their inner holes stay holes.
function _halftoneCollect(item) {
    var out = [];
    if (!item) return out;
    var t = item.typename;
    if (t === "PathItem" || t === "CompoundPathItem") {
        out.push(item);
    } else if (t === "GroupItem") {
        for (var i = 0; i < item.pathItems.length; i++)         out.push(item.pathItems[i]);
        for (var j = 0; j < item.compoundPathItems.length; j++) out.push(item.compoundPathItems[j]);
        for (var k = 0; k < item.groupItems.length; k++) {
            var nested = _halftoneCollect(item.groupItems[k]);
            for (var n = 0; n < nested.length; n++) out.push(nested[n]);
        }
    }
    return out;
}

function _halftoneOnePath(item, dotSize, spacing, shape, cos, sin) {
    // Pick the path we read the fill color from (compound: first child path)
    var colorSrc = item;
    if (item.typename === "CompoundPathItem") {
        if (item.pathItems.length === 0) return 0;
        colorSrc = item.pathItems[0];
    }
    if (!colorSrc.filled || !_isRGBColor(colorSrc.fillColor)) return 0;

    var c = colorSrc.fillColor;
    // Perceptual darkness 0..1 (Rec.601 luma)
    var lum = (0.299 * c.red + 0.587 * c.green + 0.114 * c.blue) / 255;
    var darkness = 1 - lum;
    if (darkness < 0.02) return 0; // skip near-white

    var dotDiam = dotSize * darkness;
    if (shape === "line") {
        // For line halftone, "darkness" maps to stroke weight directly
        if (dotDiam < 0.25) return 0;
    } else {
        if (dotDiam < 0.30) return 0;
    }

    var b = item.geometricBounds; // [left, top, right, bottom] (top > bottom)
    var left = b[0], top = b[1], right = b[2], bottom = b[3];
    var cx = (left + right) / 2;
    var cy = (top + bottom) / 2;
    var w  = right - left;
    var h  = top - bottom;
    var halfDiag = Math.sqrt(w * w + h * h) / 2 + spacing * 2;

    var parent    = item.parent;
    var fillColor = _makeRGB(c.red, c.green, c.blue);

    var container = parent.groupItems.add();
    container.name = "DTF_HALFTONE";

    var nDots = 0;

    if (shape === "line") {
        // Horizontal stripes in the rotated frame
        for (var ly = -halfDiag; ly <= halfDiag; ly += spacing) {
            var x1L = -halfDiag, x2L = halfDiag;
            var x1 = cx + (x1L * cos - ly * sin);
            var y1 = cy + (x1L * sin + ly * cos);
            var x2 = cx + (x2L * cos - ly * sin);
            var y2 = cy + (x2L * sin + ly * cos);
            var stripe = container.pathItems.add();
            stripe.setEntirePath([[x1, y1], [x2, y2]]);
            stripe.filled = false;
            stripe.stroked = true;
            stripe.strokeColor = fillColor;
            stripe.strokeWidth = dotDiam;
            nDots++;
        }
    } else {
        // Grid of dots in rotated frame; cull far-out points before drawing
        var margin = dotDiam + spacing;
        for (var lyG = -halfDiag; lyG <= halfDiag; lyG += spacing) {
            for (var lxG = -halfDiag; lxG <= halfDiag; lxG += spacing) {
                var x = cx + (lxG * cos - lyG * sin);
                var y = cy + (lxG * sin + lyG * cos);
                if (x + margin < left || x - margin > right)   continue;
                if (y + margin < bottom || y - margin > top)   continue;
                _drawHalftoneDot(container, shape, x, y, dotDiam, fillColor);
                nDots++;
            }
        }
    }

    if (nDots === 0) {
        try { container.remove(); } catch (e) {}
        return 0;
    }

    // Add the clipping silhouette LAST so it ends up topmost in the group's z-order
    var clip = item.duplicate(container, ElementPlacement.PLACEATBEGINNING);
    clip.clipping = true;
    if (clip.typename === "PathItem") {
        clip.filled  = false;
        clip.stroked = false;
    } else if (clip.typename === "CompoundPathItem") {
        for (var ci = 0; ci < clip.pathItems.length; ci++) {
            clip.pathItems[ci].filled  = false;
            clip.pathItems[ci].stroked = false;
        }
    }
    container.clipped = true;

    // Put the new group where the original lived, then remove the original
    try { container.move(item, ElementPlacement.PLACEBEFORE); } catch (eMv) {}
    try { item.remove(); } catch (eRm) {}

    return nDots;
}

function _drawHalftoneDot(parent, shape, x, y, diameter, color) {
    var r = diameter / 2;
    var item;
    // pathItems.ellipse(top, left, width, height) — top is the upper Y edge
    if (shape === "square") {
        item = parent.pathItems.rectangle(y + r, x - r, diameter, diameter);
    } else if (shape === "diamond") {
        item = parent.pathItems.add();
        item.setEntirePath([
            [x,     y + r],
            [x + r, y    ],
            [x,     y - r],
            [x - r, y    ]
        ]);
        item.closed = true;
    } else { // circle (default)
        item = parent.pathItems.ellipse(y + r, x - r, diameter, diameter);
    }
    item.stroked   = false;
    item.filled    = true;
    item.fillColor = color;
    return item;
}

// ---------- 6. Preview Backgrounds ----------

function addPreviewBackground(colorHex) {
    try {
        var doc = _doc();
        removePreviewBackground(); // ensure single

        var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()];
        var rect = ab.artboardRect; // [left, top, right, bottom]
        var left = rect[0], top = rect[1], right = rect[2], bottom = rect[3];
        var w = right - left;
        var h = top - bottom;

        var bg = doc.pathItems.rectangle(top, left, w, h);
        bg.name = "DTF_PREVIEW_BG";
        bg.stroked = false;
        bg.filled = true;

        var hex = (colorHex || "#000000").replace("#", "");
        var r = parseInt(hex.substring(0,2), 16);
        var g = parseInt(hex.substring(2,4), 16);
        var b = parseInt(hex.substring(4,6), 16);
        bg.fillColor = _makeRGB(r, g, b);
        bg.zOrder(ZOrderMethod.SENDTOBACK);
        return _ok({ hex: colorHex });
    } catch (e) {
        return _err(e.message || e);
    }
}

function removePreviewBackground() {
    try {
        var doc = _doc();
        var removed = 0;
        for (var i = doc.pathItems.length - 1; i >= 0; i--) {
            if (doc.pathItems[i].name === "DTF_PREVIEW_BG") {
                doc.pathItems[i].remove();
                removed++;
            }
        }
        return _ok({ removed: removed });
    } catch (e) {
        return _err(e.message || e);
    }
}

// ---------- 7. Export DTF PNG ----------

function exportDTF(widthCm, dpi, mirror) {
    try {
        var doc = _doc();
        widthCm = parseFloat(widthCm) || 25;
        dpi     = parseInt(dpi, 10)   || 300;

        // Find DTF_PREVIEW_BG and hide it temporarily for clean export
        var bg = null;
        for (var i = 0; i < doc.pathItems.length; i++) {
            if (doc.pathItems[i].name === "DTF_PREVIEW_BG") {
                bg = doc.pathItems[i];
                bg.hidden = true;
                break;
            }
        }

        var mirrored = false;
        if (mirror) {
            // Flip every top-level pageItem around the artboard center
            var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()];
            var r = ab.artboardRect;
            var cx = (r[0] + r[2]) / 2;
            for (var k = 0; k < doc.pageItems.length; k++) {
                var it = doc.pageItems[k];
                if (it.hidden) continue;
                // Translate so center is origin, scale -1, translate back
                it.translate(-cx, 0);
                it.resize(-100, 100); // horizontal flip
                it.translate(cx, 0);
            }
            mirrored = true;
        }

        var saveFile = File.saveDialog("Save DTF PNG", "PNG:*.png");
        if (!saveFile) {
            if (mirrored) _unmirror(doc);
            if (bg) bg.hidden = false;
            return _err("Cancelled.");
        }
        if (!/\.png$/i.test(saveFile.fsName)) {
            saveFile = new File(saveFile.fsName + ".png");
        }

        // Compute scale factor: artboard width is in points (1pt = 1/72 inch).
        // Target px = widthCm / 2.54 * dpi
        var ab2 = doc.artboards[doc.artboards.getActiveArtboardIndex()];
        var rect = ab2.artboardRect;
        var artW_pt = rect[2] - rect[0];
        var artW_in = artW_pt / 72;
        var targetW_in = widthCm / 2.54;
        var scalePercent = (targetW_in / artW_in) * (dpi / 72) * 100;

        var opts = new ExportOptionsPNG24();
        opts.transparency      = true;
        opts.antiAliasing      = true;
        opts.artBoardClipping  = true;
        opts.horizontalScale   = scalePercent;
        opts.verticalScale     = scalePercent;

        doc.exportFile(saveFile, ExportType.PNG24, opts);

        if (mirrored) _unmirror(doc);
        if (bg) bg.hidden = false;

        return _ok({ path: saveFile.fsName, scale: scalePercent });
    } catch (e) {
        return _err(e.message || e);
    }
}

function _unmirror(doc) {
    var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    var r = ab.artboardRect;
    var cx = (r[0] + r[2]) / 2;
    for (var k = 0; k < doc.pageItems.length; k++) {
        var it = doc.pageItems[k];
        if (it.hidden) continue;
        it.translate(-cx, 0);
        it.resize(-100, 100);
        it.translate(cx, 0);
    }
}

// ---------- 8. Diagnostics ----------

function dtfPing() {
    try {
        return _ok({
            app: app.name,
            version: app.version,
            docs: app.documents.length
        });
    } catch (e) {
        return _err(e.message || e);
    }
}
