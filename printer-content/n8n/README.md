# n8n — automatyzacja generowania klipów

**Szkielet** workflow, który bierze listę zdjęć referencyjnych, woła Higgsfield API
per zdjęcie z dopasowanym promptem, czeka aż klip się wygeneruje, pobiera go
i wrzuca do Supabase Storage. Na koniec wysyła Slack notyfikację „N klipów gotowych do composingu".

## Co zrobi automatycznie

```
Webhook POST → [for each photo] → Higgsfield: generate video
                                → wait & poll until ready
                                → download .mp4
                                → upload to Supabase Storage
                              → Slack: "5 klipów gotowych, idz do CapCut"
```

## Czego NIE zrobi (świadomie)

- **Composingu rolki** — TikTok algorytm karze fully-auto content. Surowiec robi n8n,
  hook + muzykę + tekst robisz ręcznie w CapCut. Patrz [`../README.md`](../README.md).
- **Wyboru który prompt do którego zdjęcia** — na razie statyczna mapa
  (numer pliku → prompt z [`PROMPTY.md`](../PROMPTY.md)).
  Wersja v2: LLM rozpoznaje co jest na zdjęciu i sam dobiera prompt.

## Wdrożenie (15 min)

### 1. Higgsfield API key
- Zaloguj się: https://platform.higgsfield.ai/
- Settings → API Keys → Create
- Zapisz klucz (zaczyna się od `hf_...`)

### 2. Import workflow do n8n
- n8n → Workflows → Import from File → wybierz `workflow.json`
- Otwórz workflow, w nodach z czerwonym restrykcyjnym znakiem ustaw credentials:
  - `Higgsfield API` → Header Auth: `Authorization: Bearer hf_TWOJ_KLUCZ`
  - `Supabase Storage` → URL + service key (z railway env vars z tego repo)
  - `Slack` → OAuth (opcjonalne, możesz wyrzucić node)

### 3. Wrzuć referencje
Najprościej:
- Wrzuć `r1-01.jpg` … `r1-12.jpg` do Google Drive / Supabase Storage public bucket
- Skopiuj URL-e

### 4. Trigger
Wyślij POST na webhook URL n8n:
```bash
curl -X POST https://twoj-n8n.com/webhook/printer-content \
  -H "Content-Type: application/json" \
  -d '{
    "shots": [
      {"id": "r1-04", "image_url": "https://...r1-04.jpg"},
      {"id": "r1-07", "image_url": "https://...r1-07.jpg"},
      {"id": "r1-09", "image_url": "https://...r1-09.jpg"}
    ]
  }'
```

n8n iteruje po `shots`, dla każdego bierze prompt z mapy (zaszytej w nodzie
`Map shot to prompt`) i woła Higgsfield.

### 5. Output
- Klipy lądują w Supabase Storage: `printer-content/YYYY-MM-DD/r1-XX.mp4`
- Slack pingnie cię gdy wszystkie gotowe
- Wchodzisz na bucket, pobierasz, składasz w CapCut → [`../compose.sh`](../compose.sh)

## Tańsza alternatywa: Replicate

Jeśli nie chcesz Higgsfield API (wymaga subskrypcji), Seedance jest też na Replicate
(pay-per-use, bez subscription). Zmień node `Higgsfield: generate video` na:

- Endpoint: `https://api.replicate.com/v1/predictions`
- Model: `bytedance/seedance-2-0` (sprawdź dokładną nazwę w Replicate)
- Auth: `Token r8_TWOJ_KLUCZ`

API kontrakt jest podobny (POST z prompt + image, polling GET aż `status=succeeded`).

## Skąd brać prompty bez wgrywania referencji?

Workflow domyślnie czyta `printer-content/PROMPTY.md` w formie statycznej mapy
zaszytej w nodzie `Set prompts`. Jeśli zmienisz prompty w `PROMPTY.md`, zsynchronizuj
ręcznie ten node (albo zrób v2 z node `Read GitHub file` który ciągnie świeże).
