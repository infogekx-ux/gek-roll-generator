// =============================================================
// G|PRINT DTF Prep — Standalone Test Script
//
// USAGE (in Illustrator):
//   File  →  Scripts  →  Other Script…  →  select this file
//   (Polish: Plik → Skrypty → Inny skrypt…)
//
// What it does:
//   1. Loads host/index.jsx from the installed extension folder
//   2. Asks you to pick a test PNG (e.g. polska-czarna.png)
//   3. Creates a new A4/RGB document
//   4. Runs every public host function and verifies its result
//   5. Writes dtf-prep-test-report.txt next to the test image
//      plus dtf-prep-test-export.png / -mirror.png
// =============================================================

#target illustrator

(function () {

    // ---------- Report buffer ----------
    var REPORT = [];
    function log(s) { REPORT.push(String(s)); try { $.writeln(s); } catch (e) {} }
    function hr()   { log("------------------------------------------------------------"); }

    log("G|PRINT DTF Prep — Test Report");
    log("Date:       " + (new Date()).toString());
    log("App:        " + app.name + " " + app.version);
    log("Locale:     " + $.locale);
    log("Script dir: " + (new File($.fileName)).path);
    hr();

    // ---------- Resolve & load the host script ----------
    function findHost() {
        var candidates = [];
        try { candidates.push(new File(Folder.userData.fsName + "/Adobe/CEP/extensions/com.gekx.dtfprep/host/index.jsx")); } catch (e) {}
        try { candidates.push(new File(Folder("~/Library/Application Support/Adobe/CEP/extensions/com.gekx.dtfprep").fsName + "/host/index.jsx")); } catch (e) {}
        // Also check next to this test script (host/index.jsx one folder up)
        try {
            var here = new File($.fileName);
            candidates.push(new File(here.path + "/../host/index.jsx"));
        } catch (e) {}
        for (var i = 0; i < candidates.length; i++) {
            if (candidates[i] && candidates[i].exists) return candidates[i];
        }
        return null;
    }

    var hostFile = findHost();
    if (!hostFile) {
        var paths = "";
        try { paths += "  " + Folder.userData.fsName + "/Adobe/CEP/extensions/com.gekx.dtfprep/host/index.jsx\n"; } catch (e) {}
        alert("host/index.jsx not found. Install the extension first.\n\nLooked in:\n" + paths);
        return;
    }
    try {
        $.evalFile(hostFile);
        log("LOADED host: " + hostFile.fsName);
    } catch (eHost) {
        alert("Could not load host script:\n" + hostFile.fsName + "\n\n" + eHost.message);
        return;
    }
    hr();

    // ---------- Ask for a test image ----------
    var imgFile = File.openDialog("Pick test PNG (black bg + white element)", "Images:*.png;*.jpg;*.jpeg");
    if (!imgFile) {
        alert("Cancelled — pick an image to test against.");
        return;
    }
    log("Test image: " + imgFile.fsName);

    var outDir       = new Folder(imgFile.path);
    var reportFile   = new File(outDir.fsName + "/dtf-prep-test-report.txt");
    var exportFile   = new File(outDir.fsName + "/dtf-prep-test-export.png");
    var exportMirror = new File(outDir.fsName + "/dtf-prep-test-export-mirror.png");

    // ---------- Build a fresh A4 RGB doc ----------
    var doc;
    try {
        doc = app.documents.add(DocumentColorSpace.RGB, 595.28, 841.89);
        log("OK: new A4 RGB doc (" + Math.round(doc.width) + "x" + Math.round(doc.height) + " pt)");
    } catch (e) {
        log("FAIL doc.add: " + e.message);
        flushReport();
        return;
    }
    hr();

    // ---------- Helpers ----------
    function jsLit(v) {
        if (v === null || v === undefined) return "null";
        if (typeof v === "string") {
            return '"' + v.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
        }
        return String(v);
    }

    // Invoke a host function by name; functions return a JSON string.
    function call(fnName, args) {
        var raw;
        try {
            var argStr = [];
            for (var i = 0; i < args.length; i++) argStr.push(jsLit(args[i]));
            raw = eval(fnName + "(" + argStr.join(",") + ")");
        } catch (e) {
            return { ok: false, error: "JS throw: " + (e.message || e) };
        }
        if (!raw) return { ok: false, error: "Empty result from " + fnName };
        try { return eval("(" + raw + ")"); }
        catch (e) { return { ok: false, error: "JSON parse failed: " + String(raw) }; }
    }

    function countByColor(rr, gg, bb, tol) {
        tol = tol || 6;
        var n = 0;
        var items = doc.pathItems;
        for (var i = 0; i < items.length; i++) {
            var it = items[i];
            if (!it.filled) continue;
            if (it.name === "DTF_PREVIEW_BG") continue;
            var c = it.fillColor;
            if (c && c.typename === "RGBColor") {
                if (Math.abs(c.red - rr) + Math.abs(c.green - gg) + Math.abs(c.blue - bb) <= tol) n++;
            }
        }
        return n;
    }

    function hasPreviewBg() {
        for (var i = 0; i < doc.pathItems.length; i++) {
            if (doc.pathItems[i].name === "DTF_PREVIEW_BG") return true;
        }
        return false;
    }

    // ---------- T1: loadImage() — patch File.openDialog so it returns our test file
    log("\n[T1] loadImage()");
    var _origOpen = File.openDialog;
    File.openDialog = function () { return imgFile; };
    var r1 = call("loadImage", []);
    File.openDialog = _origOpen;
    if (r1.ok) log("  PASS  " + r1.data.name + "  " + r1.data.width + "x" + r1.data.height + " px");
    else      log("  FAIL  " + r1.error);

    // Select the loaded raster for the trace step
    try {
        doc.selection = null;
        if (doc.rasterItems.length > 0) doc.rasterItems[doc.rasterItems.length - 1].selected = true;
    } catch (eSel) {}

    // ---------- T2: traceImage('bw', 128)
    log("\n[T2] traceImage('bw', 128)");
    var r2 = call("traceImage", ["bw", 128]);
    log(r2.ok ? "  PASS  preset=" + r2.data.preset : "  FAIL  " + r2.error);

    // ---------- T3: expandAndUngroup()
    log("\n[T3] expandAndUngroup()");
    var r3 = call("expandAndUngroup", []);
    if (r3.ok) log("  PASS  paths=" + r3.data.paths + "  expanded=" + r3.data.expanded + "  method=" + r3.data.method);
    else       log("  FAIL  " + r3.error);

    // Need at least one path for downstream tests
    if (doc.pathItems.length === 0) {
        log("  (no paths produced — color tests will be skipped)");
    }

    // ---------- T4: getSelectedColor()
    log("\n[T4] getSelectedColor()");
    try {
        doc.selection = null;
        if (doc.pathItems.length > 0) doc.pathItems[0].selected = true;
    } catch (eS4) {}
    var r4 = call("getSelectedColor", []);
    if (r4.ok) log("  PASS  rgb(" + r4.data.r + "," + r4.data.g + "," + r4.data.b + ")");
    else       log("  FAIL  " + r4.error);

    // ---------- T5: swapBlackWhite()
    log("\n[T5] swapBlackWhite()");
    var blackBefore = countByColor(0, 0, 0);
    var whiteBefore = countByColor(255, 255, 255);
    var r5 = call("swapBlackWhite", []);
    var blackAfter  = countByColor(0, 0, 0);
    var whiteAfter  = countByColor(255, 255, 255);
    if (r5.ok) {
        var swapWorked = (blackBefore + whiteBefore) === (blackAfter + whiteAfter);
        log("  " + (swapWorked ? "PASS" : "WARN") +
            "  swapped=" + r5.data.swapped +
            "  before(b=" + blackBefore + " w=" + whiteBefore + ")" +
            "  after(b="  + blackAfter  + " w=" + whiteAfter  + ")");
    } else log("  FAIL  " + r5.error);

    // ---------- T6: invertAllColors()
    log("\n[T6] invertAllColors()");
    var r6 = call("invertAllColors", []);
    log(r6.ok ? "  PASS  inverted=" + r6.data.inverted : "  FAIL  " + r6.error);

    // ---------- T7: addPreviewBackground('#000000')
    log("\n[T7] addPreviewBackground('#000000')");
    var r7 = call("addPreviewBackground", ["#000000"]);
    var bgPresent = hasPreviewBg();
    if (r7.ok) log("  " + (bgPresent ? "PASS" : "FAIL") + "  bg present=" + bgPresent);
    else       log("  FAIL  " + r7.error);

    // ---------- T8: removePreviewBackground()
    log("\n[T8] removePreviewBackground()");
    var r8 = call("removePreviewBackground", []);
    var bgStillPresent = hasPreviewBg();
    if (r8.ok) log("  " + (bgStillPresent ? "FAIL" : "PASS") + "  removed=" + r8.data.removed + "  still present=" + bgStillPresent);
    else       log("  FAIL  " + r8.error);

    // ---------- T9: exportDTF(25, 300, false)
    log("\n[T9] exportDTF(25, 300, false)");
    var _origSave = File.saveDialog;
    File.saveDialog = function () { return exportFile; };
    var r9 = call("exportDTF", [25, 300, false]);
    File.saveDialog = _origSave;
    if (r9.ok) {
        try { exportFile.refresh && exportFile.refresh(); } catch (eR9) {}
        log("  PASS  " + exportFile.fsName + "  (" + exportFile.length + " bytes, scale=" + r9.data.scale + "%)");
    } else log("  FAIL  " + r9.error);

    // ---------- T10: exportDTF(25, 300, true) — mirror
    log("\n[T10] exportDTF(25, 300, true)  [mirror]");
    File.saveDialog = function () { return exportMirror; };
    var r10 = call("exportDTF", [25, 300, true]);
    File.saveDialog = _origSave;
    if (r10.ok) {
        try { exportMirror.refresh && exportMirror.refresh(); } catch (eR10) {}
        log("  PASS  " + exportMirror.fsName + "  (" + exportMirror.length + " bytes)");
    } else log("  FAIL  " + r10.error);

    // ---------- Summary
    hr();
    var results = [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10];
    var passes = 0, fails = 0;
    for (var s = 0; s < results.length; s++) {
        if (results[s] && results[s].ok) passes++; else fails++;
    }
    log("SUMMARY: " + passes + " passed / " + fails + " failed (of " + results.length + ")");
    hr();

    flushReport();

    function flushReport() {
        try {
            reportFile.encoding = "UTF-8";
            reportFile.open("w");
            reportFile.write(REPORT.join("\n"));
            reportFile.close();
            alert("Test complete.\n\n" +
                  passes + " passed / " + fails + " failed.\n\n" +
                  "Report:  " + reportFile.fsName + "\n" +
                  "Export:  " + exportFile.fsName + "\n" +
                  "Mirror:  " + exportMirror.fsName);
        } catch (eW) {
            alert("Test done but report write failed:\n" + eW.message + "\n\n" + REPORT.join("\n"));
        }
    }

})();
