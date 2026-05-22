# G|PRINT DTF Prep

CEP panel extension for **Adobe Illustrator 2024–2026** that automates the most repetitive steps of preparing artwork for DTF (Direct-to-Film) transfer printing on garments.

Part of the **GEK-X** ecosystem.

---

## What it does

A docked panel inside Illustrator (`Window → Extensions → G|PRINT DTF Prep`) with these sections:

| Section  | Operations                                                                                          |
|----------|-----------------------------------------------------------------------------------------------------|
| Load     | Open a PNG/JPG and place it on the active artboard                                                  |
| Trace    | Image Trace with three DTF-tuned presets (B&W logo, detailed, silhouette) → expand → deep ungroup   |
| Colors   | Capture a fill color from any path, then bulk-remove that color within a tolerance. Swap black↔white. Invert all colors. |
| Preview  | Drop a black or white rectangle behind the art to preview how it will read on a dark or light shirt |
| Export   | Render the artboard as a transparent PNG at a target physical width (cm) and DPI, with optional horizontal mirror for DTF transfer |

---

## Architecture

```
┌──────────────────────────────────────┐
│  Illustrator window                  │
│  ┌────────────────────────────────┐  │
│  │  CEP Panel (HTML / CSS / JS)   │  │  ← client/
│  │   – buttons, sliders, swatch   │  │
│  └──────────────┬─────────────────┘  │
│                 │ evalScript()       │
│                 ▼                    │
│  ┌────────────────────────────────┐  │
│  │  ExtendScript (host)           │  │  ← host/index.jsx
│  │   – manipulates DOM, exports   │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

* **CSInterface 11** bridges the two sides.
* The panel and host always exchange JSON envelopes: `{ok:true,data:…}` or `{ok:false,error:…}`.

---

## Files

```
dtf-prep/
├── CSXS/manifest.xml      CEP manifest (panel registration, host range, geometry)
├── .debug                 Enables remote debugging on port 8088
├── client/
│   ├── index.html         Panel markup
│   ├── style.css          Dark theme matching Illustrator UI
│   └── main.js            UI logic + CSInterface bridge
├── host/index.jsx         ExtendScript: all Illustrator DOM operations
├── lib/CSInterface.js     Adobe CEP 11 client library (official)
├── icons/
│   ├── icon-light.png     23×23 dark-stroke icon (for light Illustrator UI)
│   └── icon-dark.png      23×23 light-stroke icon (for dark Illustrator UI)
├── INSTALL.md             Install steps for macOS and Windows
└── README.md              This file
```

---

## Install

See **INSTALL.md** for step-by-step instructions (macOS + Windows).

TL;DR (macOS):

```bash
defaults write com.adobe.CSXS.11 PlayerDebugMode 1
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
cp -R dtf-prep ~/Library/Application\ Support/Adobe/CEP/extensions/com.gekx.dtfprep
# Restart Illustrator → Window → Extensions → G|PRINT DTF Prep
```

---

## Debugging

With `.debug` present and `PlayerDebugMode` enabled:

* Open Chrome and visit `http://localhost:8088` to inspect the panel.
* `console.log(...)` from `client/main.js` shows up in DevTools.
* `$.writeln(...)` from `host/index.jsx` shows up in the ExtendScript Toolkit / VS Code ExtendScript Debugger output.

---

## Notes

* This is a **CEP** extension, not UXP. UXP is not available to third-party developers for Illustrator 2026.
* Tested target: Adobe Illustrator 28.x – 29.x (2024 / 2025 / 2026), macOS and Windows.
* Color matching tolerance is the L1 distance of R+G+B (`|Δr|+|Δg|+|Δb|`), 0–50 in the UI.
* Mirror-on-export flips every visible top-level item around the active artboard center, exports, then flips back.

---

Built by **GEK-X** · `info.gekx@gmail.com`
