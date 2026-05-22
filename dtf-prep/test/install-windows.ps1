# =============================================================
# G|PRINT DTF Prep — Windows installer (one-shot)
#
# Run in PowerShell:
#   iwr -useb https://dkihhmphimfqhyuzajwc.supabase.co/storage/v1/object/public/gek-x-hub/projekty/dtf-prep/test/install-windows.ps1 | iex
#
# Or save this file and run:
#   powershell -ExecutionPolicy Bypass -File install-windows.ps1
#
# What it does:
#   1. Sets PlayerDebugMode = 1 for CSXS 11 and 12 (unsigned extensions allowed)
#   2. Downloads every plugin file from Supabase hub
#   3. Installs into %APPDATA%\Adobe\CEP\extensions\com.gekx.dtfprep\
#   4. Downloads the standalone test script to your Desktop
#   5. Tells you what to do next
# =============================================================

$ErrorActionPreference = "Stop"

$SRK  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRraWhobXBoaW1mcWh5dXphandjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUzMjQ3NCwiZXhwIjoyMDg3MTA4NDc0fQ.PX-XYXw0ttqlqYLSj3z8VKhqbqBsyAa9wWCZY7w5PtQ"
$URL  = "https://dkihhmphimfqhyuzajwc.supabase.co"
$BASE = "projekty/dtf-prep"

$DEST     = Join-Path $env:APPDATA "Adobe\CEP\extensions\com.gekx.dtfprep"
$TESTDIR  = Join-Path ([Environment]::GetFolderPath("Desktop")) "test-dtf"

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " G|PRINT DTF Prep - Windows installer" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# ---------- 1. PlayerDebugMode ----------
Write-Host "[1/4] Enabling unsigned extensions (PlayerDebugMode)..." -ForegroundColor Yellow
foreach ($v in @("11","12")) {
    $key = "HKCU:\Software\Adobe\CSXS.$v"
    if (-not (Test-Path $key)) { New-Item -Path $key -Force | Out-Null }
    Set-ItemProperty -Path $key -Name "PlayerDebugMode" -Value "1" -Type String -Force
    Write-Host "    set $key\PlayerDebugMode = 1"
}

# ---------- 2. Plugin files ----------
Write-Host ""
Write-Host "[2/4] Downloading plugin to $DEST" -ForegroundColor Yellow

$headers = @{
    "apikey"        = $SRK
    "Authorization" = "Bearer $SRK"
}

$files = @(
    ".debug",
    "CSXS/manifest.xml",
    "client/index.html",
    "client/main.js",
    "client/style.css",
    "host/index.jsx",
    "lib/CSInterface.js",
    "icons/icon-light.png",
    "icons/icon-dark.png",
    "INSTALL.md",
    "README.md"
)

foreach ($rel in $files) {
    $target = Join-Path $DEST ($rel -replace "/","\")
    $parent = Split-Path $target -Parent
    if (-not (Test-Path $parent)) { New-Item -Path $parent -ItemType Directory -Force | Out-Null }
    $src = "$URL/storage/v1/object/gek-x-hub/$BASE/$rel"
    try {
        Invoke-WebRequest -Uri $src -Headers $headers -OutFile $target -UseBasicParsing
        $size = (Get-Item $target).Length
        Write-Host ("    OK  {0,8:N0}b  {1}" -f $size, $rel)
    } catch {
        Write-Host "    FAIL  $rel  --  $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ---------- 3. Test script ----------
Write-Host ""
Write-Host "[3/4] Downloading test script to $TESTDIR" -ForegroundColor Yellow
if (-not (Test-Path $TESTDIR)) { New-Item -Path $TESTDIR -ItemType Directory -Force | Out-Null }
$testTarget = Join-Path $TESTDIR "test-dtf-prep.jsx"
Invoke-WebRequest -Uri "$URL/storage/v1/object/gek-x-hub/$BASE/test/test-dtf-prep.jsx" `
    -Headers $headers -OutFile $testTarget -UseBasicParsing
Write-Host "    OK  $testTarget"

# ---------- 4. Verify ----------
Write-Host ""
Write-Host "[4/4] Verifying installation" -ForegroundColor Yellow
$installed = Get-ChildItem -Path $DEST -Recurse -File | Sort-Object FullName
Write-Host ""
Write-Host "  Installed files in $DEST :"
foreach ($f in $installed) {
    $rel = $f.FullName.Substring($DEST.Length + 1)
    Write-Host ("    {0,8:N0}b  {1}" -f $f.Length, $rel)
}
Write-Host ""
Write-Host "  Count: $($installed.Count) files"

# Sanity: manifest must exist
$manifest = Join-Path $DEST "CSXS\manifest.xml"
if (-not (Test-Path $manifest)) {
    Write-Host ""
    Write-Host "  WARN: manifest.xml missing!" -ForegroundColor Red
}

Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host " Done." -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Quit Illustrator if it's open."
Write-Host "  2. Open Illustrator."
Write-Host "  3. Menu: Okno -> Rozszerzenia -> G|PRINT DTF Prep"
Write-Host "     (English: Window -> Extensions -> G|PRINT DTF Prep)"
Write-Host ""
Write-Host "To run the automated tests:"
Write-Host "  - Put a test PNG in $TESTDIR  (e.g. polska-czarna.png)"
Write-Host "  - In Illustrator: Plik -> Skrypty -> Inny skrypt..."
Write-Host "  - Pick: $testTarget"
Write-Host "  - Then pick your test PNG when asked"
Write-Host "  - Report is written next to the image:"
Write-Host "    dtf-prep-test-report.txt"
Write-Host ""
