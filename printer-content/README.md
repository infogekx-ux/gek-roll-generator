# Printer Macro Content — Workflow GEK-X

Workflow do generowania krótkich rolek (TikTok / Reels / Shorts) z makro ujęciami
drukarki **Prestige R1**: tusz, głowica, kropla, mechanika.

## TL;DR — dlaczego dotychczas wychodziły „krowie cycki"

Każdy model tekst-to-video (Sora / Veo z samego promptu / Runway tekstowo)
**nie wie jak wygląda Prestige R1**. To niszowa drukarka DTF, w danych treningowych
go nie ma. Model halucynuje głowicę — stąd dysze jak wymiona.

**Rozwiązanie:** zamiast tekstu → daj modelowi **swoje zdjęcie** drukarki jako
„kotwicę". Wtedy generuje ruch wokół rzeczywistego obiektu zamiast zmyślać go
od zera.

To jest najbliższe „prompt → gotowy wynik" jakie dziś istnieje dla niszowego sprzętu.

## Pipeline (3 etapy, ~2h pierwsze uruchomienie, potem 20 min na rolkę)

```
[Etap 1: Sesja foto]   →   [Etap 2: Higgsfield Seedance 2.0]   →   [Etap 3: Composing]
   raz w życiu, 1h           image-to-video, 4-6s na klip            CapCut / FFmpeg
   12 zdjęć starczy          ~5-10 klipów = rolka                     12-18s gotowa
```

### Etap 1 — Sesja foto (raz, fundament całego workflow)
Patrz [`SHOT-LIST.md`](./SHOT-LIST.md) — konkretna lista 12 ujęć + parametry telefonu/lampki.

### Etap 2 — Generacja klipów
Patrz [`PROMPTY.md`](./PROMPTY.md) — gotowe prompty do skopiowania pod każde ujęcie z shot listy.

Modele (w kolejności jakości / kosztu):
- **Seedance 2.0** (`seedance_2_0`) — domyślny, image-to-video z preservation identity, 4–15s, do 1080p
- **Kling 3.0** (`kling3_0`) — multi-shot, motion-transfer, gdy chcesz pokazać ruch z innego wideo
- **Veo 3.1** (`veo3_1`) — ultra-realistyczne, ale tylko start_image (mniejsza kontrola końca klipu)
- **Marketing Studio Video** (`marketing_studio_video`) — gdy chcesz pełen ad-format (z hookiem, settingiem) zamiast surowego B-rollu

### Etap 3 — Composing
Patrz [`compose.sh`](./compose.sh) — FFmpeg skleja klipy w rolkę 1080×1920, dorzuca muzykę.
Alternatywa: CapCut Mobile (szybciej dla początku — drag & drop, gotowe szablony TikTok).

## Automatyzacja (opcjonalnie, gdy workflow już chodzi)

Patrz [`n8n/workflow.json`](./n8n/workflow.json) — szkielet n8n:
- Trigger: nowy folder w Google Drive (twoja sesja foto)
- → HTTP POST do Higgsfield API z każdym zdjęciem + promptem ze słownika
- → Polling jobów aż gotowe
- → Pobiera klipy do Supabase Storage (bucket `printer-content/`)
- → Slack / Email notyfikacja: „masz N klipów do złożenia"

**UWAGA:** Composing zostaje ręczny. Hook do rolki, muzyka, tekst — TikTok algorytm
karze fully-auto content. n8n daje ci surowiec; CapCut daje ci virala.

## Koszt orientacyjny (Higgsfield, stan: maj 2026)

- Seedance 2.0 720p, 5s ≈ 20–30 kredytów / klip
- Veo 3.1 ultra 8s ≈ 100+ kredytów / klip
- Marketing Studio Image (do generowania „polished" zdjęć z twojego zdjęcia) ≈ 5-10 kredytów

Rolka = ~5 klipów = ~100-150 kredytów = ok. 5-10 zł.

## Czego NIE robić (powtórki błędów)

1. **Nie próbuj tekst-to-video bez zdjęcia.** Veo / Sora / Runway tekstowo
   = krowie cycki, gwarantowane.
2. **Nie używaj zdjęć portretowych iPhone'a.** Tryb portret rozmywa makro.
   Tryb Pro, manualny focus, RAW.
3. **Nie używaj LED-ów drukarki jako jedynego światła.** Lampka boczna 5500K,
   inaczej zielony / niebieski cast.
4. **Nie generuj 1080p na próbę.** Najpierw 720p / fast mode → jak ujęcie działa,
   wtedy re-render w wyższej.
5. **Nie nazywaj produktu w prompcie modelu.** Model nie zna „Prestige R1" — pisz
   opisowo: „industrial DTF printer with black metal casing, white print head carriage".
   Identyfikacja przyjdzie z referencji zdjęciowej, nie z nazwy.
