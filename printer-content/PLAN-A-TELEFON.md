# PLAN A — Telefon Pro + macro lens

**Cel:** w 1h zrobić materiał na 5-10 rolek bez AI. To jest to co robi większość
konkurencji DTF na TikToku (@eagledtfprint, @merchstudio_dtf) — i im wychodzi.

**Czas:** 1h sesji + 30 min składania na rolkę
**Koszt:** ~150 zł jednorazowo (lens + lampka), potem 0
**Jakość:** najwyższa autentyczność, TikTok algorytm faworyzuje real over AI

---

## Sprzęt (do kupienia raz)

| Co | Cena PL | Gdzie | Dlaczego |
|---|---|---|---|
| Sandmarc Macro Lens (iPhone) | ~600 zł | sandmarc.com | premium, kinematyczne |
| Apexel 15× Macro Clip-on | ~80 zł | Allegro | budżet, też daje radę |
| LED panel video 5500K 10W+ | ~50-150 zł | Allegro „panel LED video 5500K" | bez tego = niebieski cast od LED-ów drukarki |
| Statyw mini / Joby GorillaPod | ~80 zł | Allegro | macro = ZERO ręcznego trzymania |
| Mikrofibra | ~5 zł | każdy market | palce na obiektywie = śmierć makro |

**Minimum żeby zacząć:** Apexel + LED + statyw = ~200 zł.

---

## Ustawienia iPhone'a (KAŻDE ujęcie)

### iOS 17+ macro mode
1. Settings → Camera → **Macro Control: ON** (zapobiega skoku na ultra-wide)
2. W aplikacji Camera: zbliż się do obiektu — pojawi się **żółty kwiatek 🌼** = macro aktywne
3. **NIE używaj Cinematic mode** — nie obsługuje macro
4. **NIE używaj Portrait mode** — sztuczne rozmycie zabija detal

### Format
- Settings → Camera → Formats → **Apple ProRes: ON** (jeśli iPhone 13 Pro+)
- ProRes = pliki ~20× większe ale każdy edytor je weźmie bez utraty jakości
- Nagrywaj 4K 30fps (NIE 60fps — chyba że celowo slow-mo)

### Ekspozycja
- Stuknij obiekt w ekranie
- Pociągnij ikonkę słońca **w dół** do -0.3 lub -0.7
- Lekko niedoświetlony obraz = filmowy look, chroni highlights

### Focus
- Po tapnięciu, długo trzymaj na obiekcie → AE/AF Lock
- To zapobiega skakaniu autofocus podczas ruchu

### Aplikacje pro (opcjonalne)
- **Blackmagic Camera** (free, iOS) — manualne ISO/shutter, log color, lepsze niż natywka
- **Filmic Pro** — pełen ręczny tryb
- W obu: ISO 100-200, shutter speed 1/60 dla 30fps

---

## Macro lens — jak używać

1. Wyczyść obiektyw telefonu + soczewkę clip-on mikrofibrą
2. Załóż na obiektyw 1× (główny), NIE ultra-wide
3. Macro lens ma ostrość tylko w wąskim zakresie (3-5 cm) — zbliż/oddal CAŁY telefon
4. Statyw obowiązkowy — przy macro 1mm drgania = 1cm rozmycia
5. Skierowane światło z BOKU (nie z przodu — refleksy)

---

## Shot list dla Prestige R1

Pełna lista 12 ujęć: [`SHOT-LIST.md`](./SHOT-LIST.md).

**MINIMUM dla 1 rolki (45 min sesji):**

| # | Co | Ile sekund | Co pokazuje |
|---|---|---|---|
| 1 | Drukarka front, hero shot | 3-5s wide | Kontekst |
| 2 | Otwarta klapa, wnętrze | 3-5s tilt | Reveal |
| 3 | Głowica makro, panning po dyszach | 3-5s pan | Wow |
| 4 | Kropla tuszu na białej kartce | 3-5s static | Hook |
| 5 | Przelewany tusz do kartridża | 3-5s static | Satisfaction |
| 6 | Wydruk DTF / koszulka final | 3-5s push-in | Payoff |

= 18-30s surowego materiału → po cięciu 12-15s rolka.

---

## Workflow sesji (60 min net)

```
00:00-05:00  Setup: lampka z boku, czarny pleds/karton jako tło, statyw, mikrofibra
05:00-10:00  Test exposure, sprawdź ProRes działa, 3 testowe shoty
10:00-25:00  Ujęcia 1-3 (drukarka context) — drukarka wyłączona, statyczna
25:00-35:00  Ujęcia 4-5 (tusz) — kontrolowany mess, kartka A4 jako tło
35:00-45:00  Ujęcie 6 (wydruk final) — z prasy lub gotowy print
45:00-55:00  Włącz drukarkę, nagraj 2-3 takei jak działa (głowica w ruchu, motion)
55:00-60:00  Przegrywanie na komputer / Google Drive
```

---

## Composing (30 min na rolkę)

### Opcja 1: CapCut Mobile (rekomendowane na start)
1. Importuj 5-6 najlepszych klipów
2. **Hook 0-2s:** najmocniejsze ujęcie (zwykle kropla tuszu albo ECU głowicy)
3. **Build 2-10s:** sekwencja narracyjna (context → process → detail)
4. **Payoff 10-15s:** wydruk / koszulka final
5. **Sound:** TikTok Trending Sounds (zakładka „Sounds" → For You)
6. **Caption:** 1-2 słowa typu „inside a $X printer" — NIE polski opis (algorytm karze niszowy język na start)
7. **Aspekt:** 9:16 1080×1920 30fps H.264

### Opcja 2: FFmpeg (skrypt z repo)
```bash
cd printer-content
# Wrzuć klipy do output/clip-01.mp4 ... clip-06.mp4
./compose.sh output/clip-*.mp4
# Wynik: output/roll-YYYY-MM-DD-HHMM.mp4 (1080x1920, 30fps)
# Potem dorzuć muzykę i tekst w CapCut lub Premiere
```

---

## Co robić dalej

Po nagraniu materiału:
1. Zostaw zdjęcia (klatki z najlepszych klipów) → **PLAN B** użyje ich jako referencje do AI b-roll
2. Wybierz najlepsze 6-8s klipy → **PLAN E** (Clipify) zrobi z nich rolkę z auto-captions
3. Jak masz już 30-50 zdjęć drukarki z różnych sesji → **PLAN D** wytrenuj LoRA

Plan A nie jest ślepą uliczką — jest **fundamentem**. Każdy następny plan używa twoich
zdjęć / klipów żeby AI nie musiało zmyślać.
