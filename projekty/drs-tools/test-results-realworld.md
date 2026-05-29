# Test Results — REAL-WORLD (MISJA 5)
> Wygenerowane: 2026-05-29T12:46:22.021Z
> Scenariusz: "screenshot z neta → drukarz → dramat". Te testy walą w realne, problematyczne wejścia.

## Podsumowanie
- **Asercje:** 658/658 pass, 0 fail ✅ (≥300)
- **Czas:** BG śr 18ms / max 37ms · VEC śr 155ms / max 317ms · AI śr 5231ms / max 15636ms
- **Status:** ✅ ZIELONO — zero crashy, zero NaN

## Kategorie
- screenshot: 84/84 ✅
- chrome: 18/18 ✅
- jpghalo: 66/66 ✅
- colormode: 60/60 ✅
- exif: 56/56 ✅
- vecreal: 126/126 ✅
- pipeline: 120/120 ✅
- ai: 56/56 ✅
- robust: 12/12 ✅
- extreme: 60/60 ✅

## Co pokryte (real-world)
- **Screenshoty stron** (logo na tle strony, JPEG q40–85, 6 teł × 4 rozmiary) — tło znika, logo zostaje
- **Screenshoty z paskiem przeglądarki** (realny crop)
- **Halo z kompresji JPG** (q20–85) — near-white krawędzie czyszczone tolerancją
- **Color-mody:** grayscale, **CMYK**, paleta/indexed, **16-bit**, 1-bit, partial-alpha — dekodują i przetwarzają bez crasha
- **EXIF orientation 1–8** — wynik auto-zorientowany (koniec bokiem drukowanych zdjęć z telefonu)
- **Wektoryzacja realna** (screenshot/tekst/logo, low/med/high, kolor+BW) — niskie DPI → ostry druk-DPI
- **ŚCIEŻKA PIENIĘDZY:** screenshot → remove bg → vectorize → druk-ready (transparent + hi-DPI)
- **AI na zdjęciach** (gradient/subject) — routing do AI, tło usunięte
- **Odporność:** pusty/garbage/truncated/random/header-only — proces przeżywa, błąd kontrolowany
- **Ekstremalne wymiary:** 1×1, 3000×40, 40×3000, 2500², 5000×100

