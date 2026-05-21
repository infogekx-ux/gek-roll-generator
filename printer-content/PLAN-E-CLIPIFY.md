# PLAN E — FNF Clipify (już masz w MCP!)

**Cel:** nagraj telefonem **jedno** dłuższe wideo (5-15 min) z procesu drukowania
i let Clipify wyciąć z niego **10-20 rolek z auto-captions** w 9:16.

To jest **przeciwieństwo PLAN B/C/D** — zero AI generation, tylko inteligentne
cięcie real footage. Najbardziej autentyczne, najszybsze do pierwszego viral'a.

**Czas:** 15 min nagrania + 5 min Clipify = 20 min na **10 rolek**.
**Koszt:** wliczone w plan MCP, którego używasz.
**MCP:** już aktywne (`personal_clipper_create`, `personal_clipper_jobs`, `personal_clipper_status`).

---

## Kiedy używać

✅ Masz proces który **trwa** i **wygląda dobrze surowo**:
- Drukowanie projektu od start do finish (5-10 min)
- Setup drukarki przed shiftem
- Czyszczenie głowicy
- Mixing custom kolorów tuszu
- Pakowanie zamówienia DTF → wysyłka

✅ Chcesz natural look, bez polished AI feels
✅ Masz dłuższy YouTube video który leży i mógłby pracować jako short-form

⚠️ Nie używaj dla:
- Statycznych zdjęć (do tego PLAN B/C/D)
- 30s klipów (Clipify potrzebuje min ~5 min materiału do podziału)

---

## Krok 1: Nagraj materiał (15-30 min)

### Sprzęt
- iPhone Pro / Samsung S Ultra na statywie
- Macro lens clip-on jak używasz
- Lampka LED 5500K
- Mic zewnętrzny (Rode VideoMicro ~250 zł) jeśli planujesz voice — bardzo poprawia retention

### Format
- 4K 30fps
- Tryb Pro / Blackmagic Camera
- ProRes ON
- Aspekt 16:9 (Clipify cropuje do 9:16 automatycznie, więc nagrywaj z marginesem)

### Co nagrywać (przykład 10-min wideo „making of jednego zamówienia"):
| Czas | Co | Detail |
|---|---|---|
| 0:00-0:30 | Hook intro | „This is what's inside a $X DTF printer" |
| 0:30-2:00 | Setup | załadowanie folii, kalibracja, startup |
| 2:00-5:00 | Print process | makro głowicy w ruchu, satisfying ink flow |
| 5:00-7:00 | Detail shots | kropla tuszu, dysze, sound design moments |
| 7:00-9:00 | Post-print | folia z gotowym wzorem, prasa termo |
| 9:00-10:00 | Reveal | gotowa koszulka, hook close-up |

Każde z tych ujęć Clipify zidentyfikuje jako potencjalnego klip-kandydata.

### Voice (opcjonalnie)
Jeśli mówisz na kamerę / off-camera:
- TIK-zwięzłe zdania, hooki typu „watch this", „check this out", „here's the wild part"
- Clipify ma transcription i wybiera fragmenty z najmocniejszymi hookami

---

## Krok 2: Wrzuć na YouTube (5 min)

Clipify bierze YouTube URL jako input. Opcje:
- Public YT video
- **Unlisted** YT video (rekomendowane — nie zaśmiecasz kanału surowymi)
- Private NIE działa — Clipify musi go pobrać

```
youtube.com → Create → Upload → wybierz plik 4K
→ Visibility: Unlisted
→ Title: „R1 print run 2026-05-21" (nieważne, prywatne)
→ skopiuj URL
```

---

## Krok 3: Uruchom Clipify (1 polecenie)

W Claude (tej sesji albo dowolnej z MCP):

> Wytnij 10 klipów 9:16 z czcionką subtitle Montserrat z YT URL: https://youtube.com/watch?v=ABC123

Claude wywoła `personal_clipper_create` z parametrami:
- `urls`: `[link YT]`
- `clips_num`: `10`
- `clip_aspect`: `9:16`
- `subtitle_font`: `Montserrat`

Dostajesz `row_id`. Status sprawdzasz przez:
> Sprawdź status Clipify joba `row_id`

(używa `personal_clipper_status`)

---

## Krok 4: Pobierz klipy

Po ~5-15 min (zależy od długości input) status = `done`.
Clipify zwraca URLs do `.mp4` klipów.

Każdy klip:
- 15-60s (Clipify dobiera „naturalny" punkt cięcia)
- 9:16 1080×1920
- Auto-subtitles (z mowy w wideo)
- Hook score (jak wirowo brzmi — najwyżej-scorowane wrzucasz pierwsze)

---

## Krok 5: Publish

Każdy klip = oddzielny post:
- TikTok: dodaj trending sound, hashtagi (#dtfprinter #behindthescenes)
- Reels: cross-post z TT, edytuj caption
- Shorts: tu nie ma trending sounds, więc keep original audio + hook w tytule

**Tip:** nie publikuj wszystkich 10 klipów jednego dnia. Rozłóż na 7-10 dni:
algorytm lubi consistency, nie burst.

---

## Limity wybór czcionki

Clipify pozwala wybrać:
- **Bebas Neue** — bold, classic TikTok creator look
- **Montserrat** — neutralne, professional B2B
- **Bangers** — meme / fun energy
- **Inter** — czysty modernizm
- **Permanent Marker** — handwritten, casual

Dla DTF / niche B2B: **Montserrat** albo **Bebas Neue**.

---

## Pułapki

1. **Clipify wybiera własne klipy.** Jeśli z 10 min ma być 10 rolek, niektóre będą słabe.
   Generuj `clips_num: 15` i wybierz top 8.

2. **Subtitle font jest narzucony.** Po wyborze nie można zmienić bez re-renderu.

3. **Bez voice = bez captions.** Clipify nie generuje text overlay z B-rolla. Jeśli
   nagrałeś silent process — dorzuć voice over w post (CapCut Mobile ma TTS).

4. **9:16 z 16:9 = crop center.** Jeśli krytyczny detal jest po prawej stronie kadru,
   przy croppingu zniknie. Komponuj nagranie tak, żeby najważniejsze było w środku.

---

## Synergia z PLAN A

PLAN A daje ci zdjęcia + krótkie klipy.
PLAN E daje ci długie wideo cięte w rolki.

**Łącznie:** raz w tygodniu nagrywasz 10-min „making of one order", Clipify robi 10 rolek,
masz materiał na 2 tygodnie postów bez polishu, bez AI, bez ryzyka kreowych cycków.

To **najszybsza droga do regular viral content** dla DTF / printing biznesu.
