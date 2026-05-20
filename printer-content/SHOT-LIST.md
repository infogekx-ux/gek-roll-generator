# Shot List — sesja foto Prestige R1

Cel: **12 zdjęć referencyjnych** które wystarczą na 6 miesięcy contentu.
Sesja jednorazowa, ~1h pracy, telefon + lampka LED + ewentualnie clip-on macro lens.

## Sprzęt minimum (~50 zł jeśli nic nie masz)

- Telefon z trybem Pro (iPhone 12+ Pro, Samsung S/Ultra, Pixel 7+)
- Lampka LED panel 5500K, 10W+ (Allegro: „panel LED video 5500K" ~40 zł)
- Statyw / podpórka (książka też zadziała)
- Opcjonalnie: clip-on macro lens 15× (Apexel, ~30 zł)
- Ściereczka mikrofibra (palce na obiektywie = śmierć makro)

## Ustawienia telefonu — KAŻDE ujęcie

| Parametr | Wartość | Dlaczego |
|---|---|---|
| Tryb | **Pro / Manual** | nie Portrait, nie Auto |
| ISO | 100–200 | mniej szumu |
| Czas | 1/60s minimum, 1/125s bezpiecznie | brak rozmycia drgań ręki |
| Focus | **Manual**, dotknij obiekt | autofocus skacze na makro |
| Format | RAW jeśli można, inaczej JPEG max | Higgsfield i tak skompresuje, ale RAW = lepszy materiał na overlay |
| White Balance | 5500K (Daylight) | dopasowane do lampki LED |
| Rozdzielczość foto | maksymalna telefonu | crop później |

## Lista 12 ujęć (numeracja → użyj w nazwach plików: `r1-01.jpg` itd.)

### Sekcja A — Drukarka jako obiekt (wide / context)
**01. Drukarka — front, ostre, na ciemnym tle**
- Odległość: 1.5m, obiektyw szeroki / 1x
- Cel: hero shot, kotwica całej rolki
- Tło: czarne / ciemnoszare (zwinięty pleds, karton)

**02. Drukarka — pod kątem 3/4, otwarta klapa górna**
- Pokazuje wnętrze: szyny, głowicę, mechanikę
- Odległość: 0.8m
- Naświetl wnętrze osobno (lampka skierowana w środek)

**03. Drukarka — z góry, widok prostopadły**
- Odległość: 0.5m, telefon nad drukarką
- Cel: ujęcie planimetryczne, dobrze nadaje się do animacji ruchu kamery „dolly down"

### Sekcja B — Głowica drukująca (najważniejsze!)
**04. Głowica drukująca — z bliska, ostro na dyszach**
- Odległość: 5–10 cm, użyj clip-on macro
- Focus na rządku dysz
- **TO JEST UJĘCIE KTÓRE WCZEŚNIEJ WYCHODZIŁO JAK KROWIE CYCKI** — z prawdziwego zdjęcia model już nie spierdoli

**05. Głowica drukująca — z boku, profil**
- Odległość: 10 cm
- Pokazuje grubość, mocowanie, kable

**06. Głowica drukująca — w trakcie ruchu (motion blur)**
- Włącz drukarkę, daj jej zrobić test print
- Czas naświetlania 1/15s → lekki blur ruchu
- ALTERNATYWA: nagraj wideo 4K/60fps i wyciągnij klatkę

### Sekcja C — Tusz (najlepiej viral'uje na social)
**07. Kropla tuszu — makro, na białym papierze**
- Wyciśnij 1 kroplę z butelki (CMYK + biel — 5 kropel obok siebie)
- Macro lens, odległość 3-5 cm
- Cel: ujęcie do animacji „ink drop falling" w Seedance

**08. Tusz w butelce — z bliska, etykieta widoczna**
- Odległość: 15 cm
- LED z boku, lekki refleks na butelce
- Cel: brand recognition (jeśli to twoje custom tusze GEK-X)

**09. Tusz wylewany do kartridża / pojemnika**
- Statyw KONIECZNIE — masz tylko jedne ręce
- Czas 1/60s
- Cel: ujęcie ruchu, świetne do „pouring" animacji

### Sekcja D — Wydruk / produkt końcowy
**10. Folia DTF z wydrukiem — z bliska, ostre kolory**
- Odległość: 10 cm
- Cel: pokazujesz co WYCHODZI z drukarki (storytelling: drukarka → produkt)

**11. Wydruk + prasa termo / transfer w trakcie**
- Para z prasy, koszulka, transfer
- Cel: emocjonalny payoff rolki

**12. Detal wzoru DTF — pełen detal koloru**
- Makro 2-3 cm od materiału
- Cel: hero shot „look at this quality"

## Workflow sesji (45 min net)

1. **5 min:** ustaw lampkę, czarne tło, statyw
2. **5 min:** wyczyść telefon, ustaw tryb Pro, zrób 3 testowe na ekspozycję
3. **20 min:** ujęcia 01–06 (drukarka + głowica) — drukarka stoi nieruchomo
4. **10 min:** ujęcia 07–09 (tusz) — w innym miejscu, kontrolowany bałagan
5. **5 min:** ujęcia 10–12 (wydruk / efekt końcowy)

## Po sesji

1. Przejrzyj — z każdej serii wybierz 1 najlepszą klatkę (12 zdjęć total)
2. Lekka korekta w Lightroom Mobile / Snapseed: kontrast +10, jasność +5, ostrość +20, NIC więcej (Seedance lepiej działa na neutralnym wejściu)
3. Eksport JPEG, długi bok 2048px (Higgsfield i tak resize'uje)
4. Wrzuć do folderu `printer-content/refs/` (gitignored, nie commituj surowych zdjęć — patrz [`.gitignore`](./.gitignore))
5. Nazwij: `r1-01.jpg` … `r1-12.jpg`
6. Przejdź do [`PROMPTY.md`](./PROMPTY.md) — każde ujęcie ma już pasujący prompt
