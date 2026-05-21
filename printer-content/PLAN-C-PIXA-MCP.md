# PLAN C — Pixa MCP (no API key, najszybszy start)

**Cel:** zaorać AI b-roll w 3 minuty, bez Fal.ai konta, bez płacenia z góry.
Free tier wystarczy żeby przetestować czy ten pipeline w ogóle ci pasuje.

**Czas setup:** 3 min
**Koszt:** $0 na start (free tier credits), płatne plany od ok. $10/mc dla skali
**Modele dostępne:** Kling, Luma Dream Machine, Hailuo

---

## Krok 1: Instalacja w Claude Code

```bash
claude mcp add pixa --transport http https://mcp.pixa.com/mcp
```

W Claude Desktop alternatywnie:
- Settings → Connectors → Add Custom Connector
- URL: `https://mcp.pixa.com/mcp`
- Save

---

## Krok 2: Authenticate (jednorazowo)

```bash
claude
/mcp
> select pixa
> Authenticate
```

Otworzy się browser, zaloguj się przez Google. Dostaniesz free credits.

---

## Krok 3: Tools dostępne

Po podpięciu Claude widzi 6 tooli:
1. **Image generation** (text-to-image) — generuj polished hero shoty
2. **Video creation** (text-to-video LUB image-to-video) — Kling / Luma / Hailuo
3. **Background removal** — wytnij drukarkę z tła
4. **4× upscaling** (do 4096×4096) — z marnych telefonowych zdjęć
5. **Object erasure** — usuń bałagan / drobny element ze zdjęcia
6. **Asset library** — przeglądaj wygenerowane materiały

---

## Krok 4: Przykład promptu

W rozmowie z Claude:

> Użyj Pixa MCP. Zaanimuj to zdjęcie: https://twoja-supabase.../r1-04.jpg
> Model: Kling (cinematic, motion preservation)
> Prompt: Camera slowly pans 5cm to the right along the row of printer nozzles, holding razor-sharp focus, hyper-realistic macro
> Aspekt: 9:16
> Długość: 5s

Claude wybierze Kling i wywoła generację. Po ~60s dostaniesz URL.

---

## Wybór modelu Pixa

| Model | Mocne strony | Słabe |
|---|---|---|
| **Kling** | cinematic motion, najlepsza fizyka | wolniejszy |
| **Luma Dream Machine** | smooth camera movement, dobre dolly-in | mniej precyzyjny przy mechanice |
| **Hailuo** | najszybszy, dobry do iteracji | mniej szczegółu |

**Dla makro mechaniki (głowica, dysze):** Kling.
**Dla efektów (tusz, kropla, slow-mo):** Luma.
**Dla szybkich variant testów:** Hailuo.

---

## Free tier — ile starczy

Plan free Pixa daje credity wystarczające na ~3-8 video generations (zależy od modelu i długości).
Idealne żeby:
- Wygenerować 2-3 klipy testowe z zdjęć z Plan A
- Zobaczyć czy Kling/Luma dają jakość której szukasz
- Zdecydować czy przechodzisz na Fal.ai (Plan B) lub LoRA (Plan D)

---

## Ograniczenia Pixa vs Fal.ai

| Aspekt | Pixa | Fal.ai (PLAN B) |
|---|---|---|
| API key | nie trzeba | wymagany |
| Modele | Kling, Luma, Hailuo | 600+, w tym Seedance 2.0, Wan, Veo |
| Cena | flat plan | pay-per-use, taniej w skali |
| Kontrola parametrów | minimalna | pełna (mode, genre, resolution, seed) |
| Batch automation | ograniczony | pełen, idealny do n8n |

**Decyzja:**
- Tylko Pixa = wystarczy na 10-20 klipów/mc
- Tylko Fal.ai = lepsze dla 50+ klipów/mc i pipeline'u
- Oba podpięte = best of both (Pixa free do quick test, Fal.ai do production)

Można mieć oba MCP podpięte naraz w Claude. Tylko mów w promptcie który chcesz użyć.
