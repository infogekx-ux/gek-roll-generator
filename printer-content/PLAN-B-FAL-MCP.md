# PLAN B — Fal.ai MCP w Claude Code (Seedance 2.0 image-to-video)

**Cel:** z twoich zdjęć referencyjnych Claude generuje klipy w bieżącej rozmowie.
Najlepszy stosunek kontroli do prostoty.

**Czas setup:** 5 min
**Koszt:** $0.24–0.30 / sek wideo (Seedance 2.0), płacisz tylko za to co generujesz
**Modele dostępne:** Seedance 2.0, Kling, Veo 3, Nano Banana, Hailuo, Wan, więcej

---

## Krok 1: API key Fal.ai

1. Wejdź: https://fal.ai/dashboard/keys
2. Zaloguj się (Google / GitHub)
3. Create new key → skopiuj `fal_...`
4. Doładuj $10-20 na start (Settings → Billing, pay-as-you-go, nie ma subskrypcji)
   - $10 ≈ 30-40 klipów Seedance 2.0 720p 5s fast mode

---

## Krok 2: Instalacja MCP w Claude Code

Trzy opcje, do wyboru zależnie od preferencji:

### Opcja 2a — `fal-ai-mcp` (najpopularniejszy, najszerszy katalog modeli)
```bash
claude mcp add fal-ai -e FAL_KEY=fal_TWOJ_KLUCZ -- npx -y fal-ai-mcp
```
Plus: 600+ modeli (Seedance, Veo, Wan, Nano Banana, Kling, audio, upscale)
Repo: https://github.com/RamboRogers/fal-image-video-mcp

### Opcja 2b — `fal-mcp-server` (Claude Plugin Hub, oficjalna instalacja)
W Claude Code:
```
/plugin install fal-ai@raveenb/fal-mcp-server
```
Wymaga: `FAL_KEY` w env. Mniej modeli explicit (Kling, SVD, AnimateDiff), ale 600+ przez dynamic discovery.
Repo: https://github.com/raveenb/fal-mcp-server

### Opcja 2c — `seedance-skill` (single-purpose Skill, najprostszy)
W Claude Code:
```
/plugin install seedance-skill@robonuggets
```
Tylko Seedance 2.0 + helper do liquid-glass promptów. Idealne jeśli już wiesz że chcesz Seedance.
Repo: https://github.com/robonuggets/seedance-skill

**Rekomendacja:** Opcja 2a (`fal-ai-mcp`). Daje też nano_banana (do polished hero shotów) i wan-2.2 (open-source jakość).

---

## Krok 3: Restart Claude Code i verify

```bash
# W nowej sesji Claude Code:
/mcp
# Powinieneś zobaczyć fal-ai na liście, status: connected
```

---

## Krok 4: Generacja klipu — przykład

**W rozmowie z Claude:**

> Wygeneruj klip z zdjęcia: https://twoja-supabase.../r1-04.jpg
> Model: Seedance 2.0 image-to-video, fast mode, 720p, 5s, 9:16
> Prompt: Extreme close-up macro of a printer print head. Camera slowly pans 5cm to the right along the row of nozzles, holding the nozzle line in razor-sharp focus. Hyper-realistic macro photography style.

Claude wywoła `fal-ai/bytedance/seedance-2.0/image-to-video` z parametrami:
```json
{
  "image_url": "https://twoja-supabase.../r1-04.jpg",
  "prompt": "Extreme close-up macro of a printer print head...",
  "resolution": "720p",
  "duration": 5,
  "aspect_ratio": "9:16",
  "mode": "fast"
}
```

Po 30-90s dostajesz URL do `.mp4`.

---

## Krok 5: Hosting zdjęć referencyjnych

Fal.ai wymaga **publicznego URL** do `image_url`. Opcje:

### A. Supabase Storage (już masz w stacku GEK-X)
```js
// Wrzuć referencje do bucketu np. "printer-refs"
// Ustaw bucket jako public lub generuj signed URL
const { data } = await supabase.storage
  .from('printer-refs')
  .createSignedUrl('r1-04.jpg', 3600);
// data.signedUrl → użyj w prompt do Claude
```

### B. tmpfiles.org / imgbb (szybkie i brzydkie)
- https://tmpfiles.org/ → upload → masz public URL na 60 min
- Wystarczy dla testów

### C. Cloudflare R2 (najtaniej długoterminowo)
- $0.015/GB/mc, zero egress fees
- Klient: `wrangler` CLI albo S3-compatible SDK

---

## Krok 6: Batch — 5 klipów na jedno polecenie

W Claude:

> Wygeneruj 5 klipów Seedance 2.0 720p fast 5s 9:16, kolejność i prompty:
> 1. r1-07.jpg → kropla tuszu falling (drama)
> 2. r1-01.jpg → hero drukarki, dolly-in (drama)
> 3. r1-04.jpg → głowica panning (auto)
> 4. r1-09.jpg → przelewany tusz (drama)
> 5. r1-12.jpg → final print push-in (epic)
>
> Pełne prompty bierz z PROMPTY.md w tym repo. Zwróć URL-e do gotowych mp4.

Claude odpali 5 równoległych wywołań Fal, pobierze wyniki i poda ci linki.
Złożysz ze skryptem [`compose.sh`](./compose.sh) lub w CapCut.

---

## Modele które warto znać (poza Seedance 2.0)

| Model | Kiedy używać | Cena Fal.ai |
|---|---|---|
| **`bytedance/seedance-2.0/image-to-video`** | domyślny B-roll, preservation identity | $0.24-0.30/sek |
| `fal-ai/kling-video/v2/master/image-to-video` | cinematic motion, długie ujęcia 10s+ | $0.35/sek |
| `fal-ai/veo3/image-to-video` | ultra-realistic, ale tylko start_image | $0.50/sek |
| `fal-ai/wan-pro/image-to-video` | open-source quality, tanie | $0.18/sek |
| `fal-ai/nano-banana/edit` | retouching twoich zdjęć przed video (4K) | $0.04/obraz |

**Nano Banana jako pre-processing:** Wrzuć surowe zdjęcie z telefonu →
„zrób z tego cinematic product shot, soft rim light, black background" →
masz polished referencję → potem Seedance 2.0 ją ożywia. Dwustopniowy pipeline
daje znacząco lepszy efekt niż single-shot.

---

## Pułapki

1. **Seedance czasem zmienia kąt głowicy.** Jeśli krytyczny detal się rozjeżdża:
   - Skróć duration do 3-4s
   - `mode: std` zamiast `fast`
   - Prompt: dodaj „camera moves only, subject stays static"

2. **Audio domyślnie ON od 2.0.** Dla rolek wyłącz: `generate_audio: false`.
   I tak dorzucisz trending sound w CapCut.

3. **Aspect 9:16 z poziomego zdjęcia = crop.** Zdjęcia referencyjne rób w pionie albo
   przygotuj w Nano Banana (`aspect_ratio: 9:16`) przed wrzuceniem do Seedance.

4. **Limit rate:** Fal.ai domyślnie 10 równoległych jobów. Dla batcha 20+ klipów
   ustaw `concurrency_limit` w workflow.

---

## Co dalej

Po PLAN B masz powtarzalny pipeline „zdjęcie + prompt → klip".
- Skaluj do **PLAN F** (n8n) gdy chcesz daily content na autopilot
- Albo do **PLAN D** (LoRA) gdy chcesz unlimited generation bez kosztu per klip
