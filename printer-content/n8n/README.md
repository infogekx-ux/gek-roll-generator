# n8n — automatyzacja generowania klipów (Fal.ai)

**Szkielet** workflow który bierze listę zdjęć referencyjnych, woła Fal.ai
Seedance 2.0 image-to-video per zdjęcie z dopasowanym promptem, czeka aż klip
się wygeneruje, pobiera go i wrzuca do Supabase Storage. Slack notyfikacja na końcu.

Inspirowane Dr. Firas Seedance pipeline ([n8n.io/workflows/5338](https://n8n.io/workflows/5338-generate-ai-viral-videos-with-seedance-and-upload-to-tiktok-youtube-and-instagram/)),
odchudzone z OpenAI / Blotato / multi-platform publish — zostaje czysta produkcja klipów.

## Co zrobi automatycznie

```
Webhook POST → [for each photo] → Fal.ai: Seedance 2.0 i2v (queue)
                                → poll status_url until COMPLETED
                                → fetch response_url → mp4 URL
                                → download .mp4
                                → upload to Supabase Storage
                              → Slack: "5 klipów gotowych, idz do CapCut"
```

## Czego NIE zrobi (świadomie)

- **Composingu rolki** — TikTok algorytm karze fully-auto content. Surowiec robi n8n,
  hook + muzykę + tekst robisz ręcznie w CapCut. Patrz [`../README.md`](../README.md).
- **Auto-publish do TT/IG/YT** — jeśli chcesz, dodaj Blotato node (ich pełen template
  to n8n.io workflow 5338). Risk: TT i IG karzą za zbyt automated content.

## Wdrożenie (15 min)

### 1. Fal.ai API key
- https://fal.ai/dashboard/keys → Create new key (`fal_...`)
- Doładuj $10-20 (Settings → Billing). Wystarczy na 30-40 klipów Seedance 720p 5s fast.

### 2. Import workflow do n8n
- n8n → Workflows → Import from File → wybierz `workflow.json`
- Otwórz workflow, w nodach z restrykcyjnym znakiem ustaw credentials:
  - `Fal.ai (Authorization: Key fal_...)` → Header Auth:
    - Name: `Authorization`
    - Value: `Key fal_TWOJ_KLUCZ`
  - `Supabase Service Role` → URL z env + service key (te same co używasz w głównym serverze GEK Roll Generator)
  - `Slack OAuth` → opcjonalne, możesz wyrzucić node jeśli nie używasz Slacka

### 3. Wrzuć referencje (publiczne URL)
Fal.ai potrzebuje publicznych URL-i. Opcje:

**Najszybciej:** wrzuć `r1-01.jpg` ... `r1-12.jpg` do bucketu w Supabase Storage
i ustaw bucket jako public LUB generuj signed URL z 1h TTL.

**Alternatywnie:** Google Drive public folder, Cloudflare R2, tmpfiles.org dla testów.

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

n8n iteruje po `shots`, dla każdego bierze prompt z mapy w nodzie `Map shot to prompt`
i woła Fal.ai. Każde ID ma własną mapowaną resolution / mode / duration
(np. r1-04 i r1-07 idą w 1080p std bo to hero shoty; reszta 720p fast).

### 5. Output
- Klipy lądują w Supabase Storage: `printer-content/YYYY-MM-DD/r1-XX.mp4`
- Slack pingnie cię gdy wszystkie gotowe
- Wchodzisz na bucket, pobierasz, składasz w CapCut → [`../compose.sh`](../compose.sh)

## Fal.ai API kontrakt (skrót)

Submit (POST):
```
POST https://queue.fal.run/fal-ai/bytedance/seedance-2.0/image-to-video
Authorization: Key fal_...

{
  "prompt": "...",
  "image_url": "https://...",
  "resolution": "720p",
  "duration": 5,
  "aspect_ratio": "9:16",
  "mode": "fast",
  "generate_audio": false
}

Response:
{
  "request_id": "abc-123",
  "status_url": "https://queue.fal.run/fal-ai/.../requests/abc-123/status",
  "response_url": "https://queue.fal.run/fal-ai/.../requests/abc-123",
  "status": "IN_QUEUE"
}
```

Poll (GET na `status_url`):
```
{
  "status": "IN_PROGRESS" | "COMPLETED" | "FAILED",
  "queue_position": 0,
  "logs": [...]
}
```

Fetch (GET na `response_url` gdy `status === "COMPLETED"`):
```
{
  "video": { "url": "https://fal.media/.../output.mp4", "content_type": "video/mp4" },
  "seed": 123456
}
```

## Cennik (zaktualizowany maj 2026)

| Resolution | Mode | Cena / sek | 5s klip | 10s klip |
|---|---|---|---|---|
| 720p | fast | $0.2419 | $1.21 | $2.42 |
| 720p | std | $0.3024 | $1.51 | $3.02 |
| 1080p | fast | $0.40 | $2.00 | $4.00 |
| 1080p | std | $0.50 | $2.50 | $5.00 |

Default w workflow: większość shotów 720p fast, hero shoty (r1-04, r1-07, r1-09) 1080p std.
Rolka 5-klipowa = $1.21 × 3 + $2.50 × 2 = ~$8.6 (~35 zł).

## Skalowanie do full autopilot (jeśli kiedyś będziesz chciał)

Dodaj nody na końcu (przed Slack):
- **OpenAI / Claude** → generuje hook caption per klip
- **ElevenLabs** → voice-over
- **fal-ai/ffmpeg-api** → composing klipów + voice + sound w 1 mp4
- **Blotato** → publish na TT + IG + YT

Pełen reference: https://n8n.io/workflows/5338-generate-ai-viral-videos-with-seedance-and-upload-to-tiktok-youtube-and-instagram/

**Ostrzeżenie:** fully-auto = niskie retention. TT i IG umieją wykryć AI-generated bez human touch.
Półautomat (n8n surowiec → ty edytujesz hook/sound → publish) bije fully-auto 3-5×.
