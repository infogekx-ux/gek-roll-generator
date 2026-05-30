# Test Results — Background Removal (MISJA 5)
> Wygenerowane: 2026-05-29T11:24:53.614Z
> Silnik: remove-bg-engine.js (sharp, threshold + flood, autodetect)

## Podsumowanie
- **Asercje:** 1053/1053 pass, 0 fail
- **Liczba testów (asercji):** 1053 ✅ (≥100)
- **Autodetect (solid vs complex):** 48/48 = **100.0%** ✅ (≥90%)
- **Czas:** śr. 5.7ms, max 249.2ms
- **Status:** ✅ ZIELONO — zero crashy, zero NaN

## Pokryte scenariusze
- Jednolite tła: 16 kolorów × {PNG,JPG} → autodetect=threshold, róg przezroczysty, środek nietknięty
- PNG z istniejącą przezroczystością → NIE ruszane (changed=false)
- Gradient → wykryty jako złożony (nie threshold)
- Szum / photo-ish → ścieżka complex (flood/ai)
- Logo z cieniem na białym → białe usunięte, cień + obiekt zachowane
- Bardzo małe (1×1…80×5) i duże (4000×4000) → bez crasha/timeoutu
- Artefakty JPG (q20–q90) → tolerancja radzi sobie
- Obiekt na transparent → bez zmian
- Pełny monochrom → cały transparent
- Tryby simple/ai/auto, sweep tolerancji 0–200, 30× stress losowy
- Złe wejście (pusty/null) → kontrolowany błąd

