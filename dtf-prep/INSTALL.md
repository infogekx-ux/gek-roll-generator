# Install — G|PRINT DTF Prep

CEP panel extension for Adobe Illustrator 2024 / 2025 / 2026.

---

## macOS

### 1. Enable unsigned extensions

Open **Terminal** and run, one line at a time:

```bash
defaults write com.adobe.CSXS.11 PlayerDebugMode 1
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
```

(The two lines cover CEP 11 used by AI 2024/25 and CEP 12 used by AI 2026.)

### 2. Copy the extension folder

The CEP extensions folder lives at:

```
~/Library/Application Support/Adobe/CEP/extensions/
```

Copy the entire `dtf-prep` folder there and rename it to match the bundle ID:

```bash
mkdir -p ~/Library/Application\ Support/Adobe/CEP/extensions
cp -R /path/to/dtf-prep ~/Library/Application\ Support/Adobe/CEP/extensions/com.gekx.dtfprep
```

Final layout should be:

```
~/Library/Application Support/Adobe/CEP/extensions/com.gekx.dtfprep/
├── CSXS/manifest.xml
├── client/
├── host/
├── lib/
├── icons/
├── .debug
├── README.md
└── INSTALL.md
```

### 3. Restart Illustrator

Quit Illustrator completely (⌘Q), then reopen.

### 4. Open the panel

In Illustrator's menu (Polish: `Okno → Rozszerzenia → G|PRINT DTF Prep`):

```
Window → Extensions → G|PRINT DTF Prep
```

The panel docks like any other Illustrator panel. Done.

---

## Windows

### 1. Enable unsigned extensions

1. Press `Win + R`, type `regedit`, press Enter.
2. Navigate to:
   ```
   HKEY_CURRENT_USER\Software\Adobe\CSXS.11
   ```
3. Right-click → **New → String Value**
4. Name: `PlayerDebugMode`, Value: `1`
5. Repeat at `HKEY_CURRENT_USER\Software\Adobe\CSXS.12` for AI 2026.

(If `CSXS.11` or `CSXS.12` does not exist, create it as a new key first.)

### 2. Copy the extension folder

The Windows extensions folder is:

```
C:\Users\<YOUR-USERNAME>\AppData\Roaming\Adobe\CEP\extensions\
```

Copy the entire `dtf-prep` folder there and rename to `com.gekx.dtfprep`.

Final layout:

```
C:\Users\<YOUR-USERNAME>\AppData\Roaming\Adobe\CEP\extensions\com.gekx.dtfprep\
├── CSXS\manifest.xml
├── client\
├── host\
├── lib\
├── icons\
├── .debug
├── README.md
└── INSTALL.md
```

### 3. Restart Illustrator

Close all Illustrator windows, then relaunch.

### 4. Open the panel

```
Window → Extensions → G|PRINT DTF Prep
```

---

## Verifying it works

1. Open or create any document.
2. The panel should show the **G|PRINT** logo, version `v1.0`, and the status line `Ready.` at the bottom.
3. Click **Load Image** → pick a PNG/JPG. The status should report the file name and pixel dimensions.

---

## Troubleshooting

**Panel does not appear in `Window → Extensions`:**

* Verify `PlayerDebugMode` is set (step 1).
* Verify the folder is named exactly `com.gekx.dtfprep` and lives in the right `extensions` directory.
* Verify `CSXS/manifest.xml` exists inside it.
* Restart Illustrator (not just close the document).

**Panel opens but is blank / shows an error:**

* Open Chrome and visit `http://localhost:8088` — the panel's WebView is debuggable there (the `.debug` file enables this).
* Check the DevTools Console for errors.

**Buttons silently do nothing:**

* Ensure a document is open before clicking anything.
* For Trace/Color buttons, ensure a path/raster is selected first where the panel asks for one.
* The status line at the bottom of the panel reports errors in red.

**`Host error: EvalScript error.`:**

* The ExtendScript host script crashed. Open the **ExtendScript Toolkit** (or VS Code's ExtendScript Debugger) and run `host/index.jsx` directly to see the underlying error.

---

## Uninstall

Delete the folder:

* macOS: `~/Library/Application Support/Adobe/CEP/extensions/com.gekx.dtfprep`
* Windows: `C:\Users\<YOU>\AppData\Roaming\Adobe\CEP\extensions\com.gekx.dtfprep`

Restart Illustrator.
