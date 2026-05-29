# Test Results — Vectorizer (MISJA 5)
> Wygenerowane: 2026-05-29T11:24:57.296Z
> Silnik: vectorizer-engine.js (imagetracerjs trace + sharp SVG→PNG render)

## Podsumowanie
- **Asercje:** 575/575 pass, 0 fail
- **Liczba testów (asercji):** 575 ✅ (≥100)
- **Czas:** śr. 49.3ms, max 1062.2ms ✅ (<10s)
- **Status:** ✅ ZIELONO — zero crashy, zero NaN, render OK

## Pokryte scenariusze
- Proste logo B&W (bw + color × low/medium/high) → czysty SVG, pathCount>0
- Kolorowe logo 5 kolorów → wielościeżkowy kolorowy SVG
- 72 DPI → render do 150/300/600 DPI (wymiary = src × target/72, ostrzejszy niż źródło)
- Tekst jako obraz → czytelne kontury
- Drobne detale: high ≥ low pathCount
- Gradient (bw+color) → graceful, bez crasha
- 1-bit szachownica → trywialny, czysty
- Duże 1200²/2000² → trace downscale, czas < 10s
- Małe 8×8…10×60 → bez crasha
- Artefakty JPG q25–q80 → czysty output
- PNG z alfa → przezroczystość zachowana w renderze
- Macierz DPI×detail×colorMode, 24× stress losowy
- Złe wejście (pusty/null) → kontrolowany błąd

