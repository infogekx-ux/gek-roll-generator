# Printer Macro Content — Workflow GEK-X (v2, post-research)

Workflow do generowania krótkich rolek (TikTok / Reels / Shorts) z makro
ujęciami drukarki **Prestige R1**: tusz, głowica, kropla, mechanika.

Po researchu (maj 2026) — dawny single-path (Higgsfield) zamieniony na
**6 niezależnych ścieżek**, każda działa samodzielnie, można je też łączyć.

---

## TL;DR — diagnoza i wybór

**Dlaczego dotychczas wychodziły „krowie cycki":** żaden model tekst-to-video
(Sora z samego promptu, Veo bez referencji, Runway tekstowo) **nie zna Prestige R1**.
Niszowa drukarka DTF, nie ma jej w treningu. Model halucynuje głowicę → wymiona.

**Trzy działające strategie żeby to obejść:**
1. **Daj modelowi referencję** (twoje zdjęcie) — image-to-video, model trzyma się obrazka
2. **Wytrenuj model na drukarce** (LoRA) — model UCZY SIĘ jak wygląda Prestige R1
3. **Nagraj kamerą / telefonem, nie generuj** — najszybszy, najautentyczniejszy

W praktyce: łącz wszystkie trzy. Sekcja niżej rekomenduje konkretną mieszankę.

---

## Wybór ścieżki — co kiedy

| Sytuacja | Ścieżka | Plik |
|---|---|---|
| **Chcę post jutro, mam telefon** | A — Telefon Pro + macro lens | [`PLAN-A-TELEFON.md`](./PLAN-A-TELEFON.md) |
| **Mam zdjęcia, chcę AI b-roll na klip** | B — Fal.ai MCP (Seedance 2.0) | [`PLAN-B-FAL-MCP.md`](./PLAN-B-FAL-MCP.md) |
| **Zero API keys, szybki test AI** | C — Pixa MCP (free tier) | [`PLAN-C-PIXA-MCP.md`](./PLAN-C-PIXA-MCP.md) |
| **Chcę „prompt → wynik" jak dla popularnych produktów** | D — Wan 2.2 LoRA na drukarce | [`PLAN-D-LORA.md`](./PLAN-D-LORA.md) |
| **Mam dłuższe wideo, chcę rolki** | E — FNF Clipify (MCP wbudowane) | [`PLAN-E-CLIPIFY.md`](./PLAN-E-CLIPIFY.md) |
| **Daily autopilot na TT/IG/YT** | F — n8n + Fal.ai + Blotato | [`n8n/README.md`](./n8n/README.md) |

**Moja rekomendacja dla ciebie (Prestige R1, mały zespół, niszowy B2B):**

```
Tydzień 1:  PLAN A (telefon + macro lens) → masz 12 referencji + 1 rolkę
Tydzień 2:  PLAN B (Fal.ai MCP) → animujesz referencje, masz 5 rolek
Miesiąc 2:  PLAN E (Clipify) → 1 dłuższy YT = 10 rolek z subtitles
Miesiąc 3:  PLAN D (LoRA) → trenujesz raz, generujesz nielimitowanie
Później:    PLAN F (n8n) → daily content na autopilot
```

---

## Co już wiemy o konkurencji DTF na TikToku (case studies)

Przeanalizowane kanały:
- [`@eagledtfprint`](https://www.tiktok.com/@eagledtfprint/) — behind-the-scenes, telefonem, ~10-30k views/post
- [`@merchstudio_dtf`](https://www.tiktok.com/@merchstudio_dtf/) — workspace tours, satisfying process
- [`@mtutechprinters`](https://www.tiktok.com/@mtutechprinters/) — UV printer factory shots, „what really happens behind the camera"
- Screen printer viral video — ~10M views, czysta produkcja + ruch maszyny + hook na 1s

**Co działa:**
- Hook w 0–2s (kropla tuszu, zbliżenie głowicy, „you won't believe what's inside")
- Satisfying process (przelewanie tuszu, ruch głowicy)
- ZERO sprzedaży w klipie, payoff w opisie / linku
- Telefon, nie polished filmówka. TT karze „za-AI"-owy content.

**Czego unikać:**
- Voice-over na cały klip (tylko hook + outro)
- Tekstu który zasłania makro
- Logo GEK-X na środku (TT bany na shameless promo)
- Stockowych przejść (whoosh / glitch — wygląda jak boomerski klip)

---

## Koszty orientacyjne (maj 2026, USD → PLN ≈ 4.0)

| Komponent | Koszt | Per rolka |
|---|---|---|
| iPhone macro lens (Sandmarc / Apexel) | $20–60 jednorazowo | 0 |
| LED panel 5500K 10W | $10 jednorazowo | 0 |
| Fal.ai Seedance 2.0 fast 720p 5s | $1.21 | $6–8 (5 klipów) |
| Fal.ai Seedance 2.0 std 1080p 8s | $2.42 | $12–15 (5 klipów) |
| Pixa MCP free tier | $0 | $0 (limit ~5 klipów/mc) |
| RunPod RTX 4090 / LoRA training | $0.69/h × 2h | $1.40 jednorazowo |
| Wan 2.2 inference RunPod | $0.10/klip | $0.50 (5 klipów) |
| FNF Clipify (już w MCP) | depends on plan | tanie |
| n8n self-host | $0 | $0 |
| Blotato (auto-publishing) | $25/mc | dystrybucja N rolek |

**Najefektywniej koszt vs jakość:** PLAN A (telefon) → PLAN D (LoRA) → unlimited generation za grosze.

---

## Struktura plików w repo

```
printer-content/
  README.md                  ← jesteś tu, mapa
  PLAN-A-TELEFON.md          ← shot list, ustawienia iPhone, macro lens
  PLAN-B-FAL-MCP.md          ← Fal.ai MCP w Claude Code, Seedance 2.0
  PLAN-C-PIXA-MCP.md         ← Pixa MCP no-API-key
  PLAN-D-LORA.md             ← Wan 2.2 LoRA training na RunPod
  PLAN-E-CLIPIFY.md          ← FNF Clipify (już w MCP), długie YT → 10 rolek
  PROMPTY.md                 ← prompty per ujęcie pod Seedance / Wan / Kling
  SHOT-LIST.md               ← 12 ujęć do nagrania (sesja 1h)
  CASE-STUDIES.md            ← linki do DTF konkurencji + analiza co działa
  compose.sh                 ← FFmpeg sklejka klipów w rolkę 9:16
  n8n/
    README.md                ← jak wdrożyć
    workflow.json            ← importowalny, Fal.ai zamiast Higgsfielda
```
