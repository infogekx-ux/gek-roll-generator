# PLAN D — Wan 2.2 + LoRA: „prompt → wynik" dla Prestige R1

**To jest dosłownie to o co pytałeś** — „najlepsze rozwiązanie to prompt i gotowy wynik
ale to nigdy nie działa".

Działa, ale wymaga jednorazowej inwestycji 2h + ~$2:
**uczysz model jak wygląda Prestige R1.** Potem każdy prompt = idealna drukarka,
bez krowich cycków, bez referencji per klip.

**Czas pierwszy raz:** 30 min przygotowania + 2h treningu (w tle, możesz robić co innego)
**Koszt:** ~$2 jednorazowo (RunPod RTX 4090, 2h, ~$0.69/h), potem $0.10-0.15 per klip
**Jakość:** porównywalna lub lepsza niż Seedance 2.0, ale BEZ wymogu referencji per klip

---

## Co to jest LoRA (po polsku)

LoRA = Low-Rank Adaptation. Mały „dodatek" do dużego modelu video (Wan 2.2).
Trenujesz go na **30 zdjęciach Prestige R1** — model „zapamiętuje":
- jak wygląda obudowa
- jak wygląda głowica (KRYTYCZNE — koniec krowich cycków)
- jakie ma proporcje
- gdzie ma LED-y, gdzie kable, jak działa karetka

Po treningu, w prompcie używasz **trigger word** (np. `prestige_r1`) i model
generuje TWOJĄ drukarkę w dowolnej scenie:

> A cinematic macro shot of prestige_r1 print head moving along the rail, ink droplet falling, slow motion, dark workshop

→ wychodzi POPRAWNA głowica twojej drukarki, bo model wie jak ona wygląda.

---

## Stack

- **Model bazowy:** Wan 2.2 (open-source, image-to-video, najlepsza jakość w open-source w 2026)
- **Trainer:** Realtime LoRA Trainer w ComfyUI (albo Kohya zewnętrznie)
- **Compute:** RunPod RTX 4090 24GB VRAM ($0.69/h) lub Vast.ai (czasem taniej)
- **Inference:** ComfyUI + LoRA loaded, generujesz lokalnie albo na tym samym RunPodzie

---

## Krok 1: Dataset zdjęć (30 min)

### Ile zdjęć
- **Minimum:** 15 (dla drukarki to mało, głowica może drifftować)
- **Sweet spot:** 30 (rekomendacja)
- **Maksymalnie sensowne:** 50 (więcej = dłuższy trening, marginalny zysk)

### Co zdjęcia muszą zawierać
- **Wszystkie kąty:** front, bok L, bok R, tył, góra (klapa otwarta), góra (klapa zamknięta)
- **Wszystkie stany:** wyłączona, włączona, w trakcie drukowania, otwarta do serwisu
- **Wszystkie odległości:** wide (1.5m), medium (0.5m), close (10cm), macro (3cm)
- **Różne oświetlenia:** dzienne, neonowe LED drukarki, lampka boczna, ciemne tło
- **Detal głowicy:** minimum 5 zdjęć z bliska (najważniejszy element żeby nie spaprać)

### Specs technicznych
- Rozdzielczość: 1024×1024 minimum (Wan 2.2 preferuje), 2048×2048 idealnie
- Format: PNG lub wysokiej jakości JPEG
- Tło: różne, nie wszystkie na białym (model zacznie myśleć że R1 zawsze ma białe tło)
- **WYŻEJ NIŻ teleobiektyw** — telefon na 1× lens, nie zoom

### Capcie (caption files) — KRYTYCZNE
Każde zdjęcie potrzebuje pliku `.txt` z opisem:
```
r1-01.jpg
r1-01.txt:    a prestige_r1 industrial DTF printer on a dark background, front view, soft rim light, hyper-realistic
```

`prestige_r1` to **twój trigger word**. Wybierz unikalny ciąg (nie używaj „printer" — zbyt generyczne).

Tip: użyj **GPT-4 Vision** albo Claude żeby auto-wygenerować captions z 30 zdjęć:
> Dla każdego z tych 30 zdjęć wygeneruj caption w formacie: „a prestige_r1 [opis ujęcia, oświetlenie, tło]". Zwróć w formacie JSON.

---

## Krok 2: Setup RunPod (10 min)

1. Załóż konto: https://www.runpod.io/
2. Doładuj $10 (na 14h GPU plus rezerwa)
3. Deploy: **GPU Pod** → **RTX 4090 24GB** → Template: **ComfyUI**
   - Oficjalny template: „ComfyUI" by RunPod (CUDA 12.8, pre-installed Manager + KJNodes)
4. Spin up → poczekaj ~3 min aż się uruchomi
5. Connect przez Jupyter terminal albo bezpośrednio do ComfyUI URL (`https://...runpod.io:8188`)

---

## Krok 3: Załaduj dataset (5 min)

```bash
# W RunPodzie, w terminalu:
mkdir -p /workspace/training-data/prestige-r1
cd /workspace/training-data/prestige-r1

# Wrzuć 30 jpg + 30 txt przez Jupyter Files UI
# Albo użyj rclone do Drive / Supabase

# Verify
ls *.jpg | wc -l   # → 30
ls *.txt | wc -l   # → 30
```

---

## Krok 4: Trening (1-4h, w tle)

W ComfyUI:
1. Open workflow: **Wan 2.2 LoRA Training** (template w Manager)
2. Ustawienia:
   - **Network rank:** 32
   - **Network alpha:** 16
   - **Learning rate:** 1e-4
   - **Steps:** 2000
   - **Batch size:** 2 (dla 24GB VRAM)
   - **Dataset path:** `/workspace/training-data/prestige-r1`
   - **Output:** `/workspace/loras/prestige_r1_v1.safetensors`
3. Queue Prompt → ComfyUI startuje trening
4. Pasek postępu pokazuje step / loss. Zostaw na ~2h.

Loss powinien spadać. Jeśli stoi w miejscu od step 500 — przerwij, mało zdjęć
lub captions są złe.

---

## Krok 5: Test inference (5 min)

W ComfyUI, nowy workflow:
1. Load **Wan 2.2 Image-to-Video** workflow
2. Dodaj node **LoraLoaderModelOnly** → ustaw na `prestige_r1_v1.safetensors` strength 0.8
3. Połącz z modelem
4. Prompt:
   ```
   prestige_r1 industrial DTF printer, extreme close-up macro of print head, camera slowly pans along nozzles, cinematic lighting, hyper-realistic
   ```
5. Aspect 9:16, duration 5s, 720p
6. Queue Prompt → po 1-2 min masz klip

**Verify:** głowica wygląda jak twoja prawdziwa, nie jak wymiona.

---

## Krok 6: Production loop

Teraz każdy klip kosztuje tylko czas GPU (~$0.10-0.15 / 5s klip):

```
Prompt → ComfyUI z LoRA → 5s klip → CapCut → publish
```

Możesz wygenerować 20 wariantów na jeden temat (np. „głowica w ruchu") i wybrać
najlepsze. Brak per-klip cost na inference modelu (jak Fal.ai $1-2 / klip).

---

## Krok 7: Hosting LoRA (żeby mieć trwale)

Po treningu pobierz `.safetensors` (~150 MB) na lokalny dysk + backup do:
- Google Drive
- Supabase Storage (bucket `models/`)
- Civitai (jeśli chcesz public; nie polecam dla brand asset)

Następnym razem nie trzeba trenować od nowa — load LoRA, generuj.

---

## Realistyczne expectations

✅ **Działa świetnie dla:**
- Konsystentnej drukarki w różnych scenach (workshop, biały studio, dramatic light)
- Generowania 10+ wariantów hero shotu w 30 min
- Multi-shot rolek gdzie drukarka pojawia się 5× pod różnymi kątami

⚠️ **Słabsze dla:**
- Hyper-makro skali (dysze pojedyncze) — referencje image-to-video w PLAN B będą lepsze
- Ekstremalnych ruchów kamery (full 360°) — LoRA czasem zmyśla tylne ujęcie
- Bardzo małych detali (LED status, serial number) — to lepiej pokazać telefonem

❌ **Nie zadziała:**
- Bez dobrych captions — model nauczy się błędnych asocjacji
- Z 5-10 zdjęciami — za mało, drifftuje
- Z fotkami portretowymi (rozmycie tła) — model uczy się że R1 zawsze ma bokeh

---

## TL;DR — czy warto

**TAK, jeśli:**
- Robisz content systematycznie (10+ rolek/mc)
- Chcesz prawdziwego „prompt → wynik" dla Prestige R1
- Masz 2-3h żeby raz to ogarnąć

**NIE, jeśli:**
- Robisz 1-2 rolki/mc → PLAN B (Fal.ai) wystarczy
- Nie chcesz dotykać ComfyUI / RunPod → PLAN B/C są łatwiejsze
- Drukarka będzie zmieniana — LoRA jest zafiksowana na konkretny model

Plan D to inwestycja 2h + $2 która eliminuje koszt referencji per klip
i daje ci unlimited generation na zawsze. Dla biznesu który chce content velocity
to **najlepszy ROI w stacku**.
