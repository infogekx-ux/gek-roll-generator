# ZZP SHIELD

Universal config-driven website + offerte/factuur system for ZZP'ers in construction.
One codebase (`base/`), one config per client (`clients/<name>/`).

First skin: **PP.PONIK** — Piotr Ponikowski, carpentry & maintenance, Oss, NL.

## Layout

```
projekty/zzp-shield/
├── base/                        # universal code — never client-specific
│   ├── css/
│   │   ├── base.css             # variables, reset, layout, responsive
│   │   └── components.css       # cards, forms, gallery, panel, doc, dupochron
│   └── js/
│       ├── app.js               # site renderer (config-driven)
│       ├── i18n.js              # NL/PL/EN translations + formatters
│       ├── offerte.js           # engine + auto-split + meerwerk
│       ├── panel.js             # ZZP'er dashboard (login, list, builder, lifecycle, timeline)
│       ├── dupochron.js         # client acceptance — terms in all 3 languages
│       ├── oplevering.js        # completion report engine
│       ├── social-generator.js  # Canvas-based social media image generator
│       ├── gallery.js           # lightbox
│       └── contact.js           # form + drag-drop photo upload
├── clients/
│   └── ppponik/                 # PP.PONIK — first client
│       ├── config/config.json   # all client data
│       ├── index.html           # public site
│       ├── panel.html           # ZZP'er dashboard
│       ├── offerte-view.html    # client-facing quote view + dupochron
│       ├── oplevering-view.html # client-facing completion report
│       └── assets/
│           ├── logo.png         # (placeholder until Piotr supplies)
│           └── gallery/         # project photos
├── build.sh                     # assembles deploy/<client>/
├── deploy/                      # generated, gitignored
└── README.md
```

## Build & deploy

```bash
./build.sh ppponik
# → projekty/zzp-shield/deploy/ppponik/ is ready
# Drag that folder onto https://app.netlify.com/drop
```

The build copies `base/css/*` and `base/js/*` into the client deploy folder, so the
client HTML references `./css/`, `./js/`, `./config/` and `./assets/` as flat paths.

## Adding a new client

1. `cp -r clients/ppponik clients/<new-name>`
2. Edit `clients/<new-name>/config/config.json`: company, branding, services, materials.
3. Drop new `assets/logo.png` and project photos into `assets/gallery/`.
4. `./build.sh <new-name>`.

## Architecture rules

- `base/` contains ZERO client data — everything comes from `config.json` via `fetch`.
- Clients hold only: `config/config.json`, `assets/`, and three thin HTML shells.
- HTML files use relative paths (`./css/`, `./js/`, `./config/`) because they live next to those folders post-build.

## Features

### Public site (`index.html`)
- Multilingual NL/PL/EN with flag switcher (persisted in `localStorage`)
- Sections: hero, services, USP, gallery (lightbox), about, contact
- Contact form: drag-drop photo upload (Netlify Forms + mailto fallback)
- WhatsApp button, Google Maps embed
- Sticky header with scroll effects, mobile hamburger menu
- Footer credit linking to gek-x.nl

### Panel (`panel.html`)
- PIN-gated (`config.panel.pin`, default `1234`)
- ZZP'er always works in their own language (`config.languages.ownerLanguage`)
- Sidebar: Offertes | Facturen | Logout
- Builder: services + materials + custom rows, live totals, status select
- Split-preview box: shows voorschot/restant totals before splitting
- "Splits in 2 facturen" button → auto-generates voorschot + restant invoices
- Dupochron link box: copy-paste link for the client

### Offerte/factuur engine (`offerte.js`)
- ID format: `OFF-YYYY-NNN` / `FAC-YYYY-NNN` (auto-increment per year, stored in localStorage)
- Items tagged via `category` field on services/materials in config (`arbeid` / `materiaal`)
- Custom rows let the ZZP'er pick the category manually
- **Auto-split (`splitInvoice`)**: from one offerte produces two factures:
  - **Voorschot** (payment 0 days): 100% of `materiaal` items + 20% of `arbeid` items (configurable via `legal.voorschot_arbeid_percentage`)
  - **Restant** (payment 14 days): remaining 80% of `arbeid` items
- Both invoices retain `sourceOfferteId` linking back to the offerte
- The renderer (`renderPreview`) outputs the doc in the client's chosen language —
  service/material names translate via the catalogue lookups in `config.json`.

### Dupochron — client acceptance (`offerte-view.html` + `dupochron.js`)
- The client opens the URL → sees the full offerte rendered in their language.
- Below the offerte: a "Voorwaarden & acceptatie" card with:
  - The full Algemene Voorwaarden **in all 3 languages as tabs** (NL / PL / EN) — the client's language tab is selected by default but they can switch to any other language.
  - Required checkbox ("I have read and understood") with a hint that the terms are available in all three languages
  - Three buttons — all disabled until the checkbox is ticked:
    - **Akkoord** (green) → status `accepted`, auto-splits into 2 invoices
    - **Overleggen** (orange) → asks for a note → status `discuss`
    - **Niet akkoord** (red) → asks for a note → status `rejected`
- Timestamp chain captured into `doc.dupochron`:
  - `opened_at` — first page load
  - `checkbox_at` — when checkbox is checked
  - `decision_at` — when a decision button is clicked
  - `decision` — `accepted` / `discuss` / `rejected`
  - `decision_note` — free-text note for discuss/reject
  - `user_agent` — browser UA string
- **v1 limitation**: storage is `localStorage`, so the dupochron link works
  on the same device that created the offerte. Production deployment for
  cross-device acceptance requires the v2 Supabase backend.

### Lifecycle on accepted offertes (Phase 2)

Once an offerte is accepted (via dupochron or manual status change), the builder shows three extra action buttons + a Timeline panel:

#### Beginsituatie — "Initial state" photo log
- Owner arrives on site, opens the offerte → clicks **Beginsituatie**
- Drag-drop or camera-capture photos of the existing situation (each photo can get a description)
- General notes textarea for site-wide remarks
- Photos are stored on the offerte under `beginsituatie.photos[]` with timestamps
- These photos appear later in the oplevering view as the "BEFORE" set so the client can compare

#### Meerwerk — additional-work invoice
- Click **Meerwerk** on an accepted offerte → instantly creates `FAC-YYYY-NNN` with `invoicePhase: "meerwerk"` and `sourceOfferteId` pointing back to the offerte
- Opens the same builder, owner fills in extra rows, saves — appears in the facturen list

#### Oplevering — completion report
- Click **Oplevering** → photo capture screen (camera + drag-drop) + general notes textarea
- **Open client link** previews what the client will see (`oplevering-view.html?id=…`)
- **Verstuur naar klant** marks the report `sent` (records `sent_at`) and opens the link to copy-share
- Client opens link → sees **BEFORE** photos (from beginsituatie) and **AFTER** photos side-by-side, plus owner notes
- Required checkbox, then three buttons (just like dupochron):
  - **Goedgekeurd** (green) → status `approved`, **auto-activates the restant invoice** (status `open`, date reset to today so the 14-day payment clock starts from completion)
  - **Opmerkingen** (orange) → captures a textarea note, status `remarks`
  - **Afgekeurd** (red) → captures a note, status `rejected`
- Full timestamp chain on `oplevering`: `sent_at` / `opened_at` / `checkbox_at` / `decision_at` / `decision` / `decision_note` / `user_agent`
- Photos are resized client-side to a max dimension (config `legal.photo_max_dimension_px`) before being stored as data URLs, to keep localStorage usable

#### Timeline panel
A condensed lifecycle view on top of the builder, combining: offerte creation → client opened → accepted → voorschot invoice (with status + amount) → beginsituatie → any meerwerk invoices → oplevering sent/decision → eindfactuur (with status + amount) → social content generated. Status colors reflect paid/open/overdue.

#### Auto social content (Phase 3)
- Available on any accepted offerte that has both `beginsituatie.photos[0]` and `oplevering.photos[0]`.
- Click **Genereer social content** → `SocialGenerator.generateAll(offerteId)` uses the Canvas API to produce three branded JPEGs from the first before/after photo pair:
  - **Reel** — 1080×1920 (9:16) — Instagram / TikTok story-format, before above / after below, branding strip at the bottom
  - **Post** — 1080×1080 (1:1) — side-by-side before/after, accent divider, brand strip
  - **Banner** — 1200×630 — landscape, suitable for Facebook / LinkedIn / OG image
- Each format uses the client's accent colour, logo, company name, phone, and tagline — all read from `config.json`, nothing hardcoded.
- Output is a JPEG data URL; download buttons use `<a download>` with filenames like `pp-ponik-reel-OFF-2026-001.jpg`.
- Generation is fully client-side (no backend). Fonts are awaited via the Font Loading API so canvas picks up Montserrat / Open Sans.
- Adds a Timeline entry `Social content beschikbaar` with the generation timestamp.

## All hardcoded values come from config

Every behavioural value comes from `config.json.legal`, never from JS:

```json
{
  "btw_percentage": 21,
  "payment_terms_days": 14,
  "offerte_valid_days": 30,
  "voorschot_arbeid_percentage": 20,
  "oplevering_response_days": 5,
  "warranty_months": 6,
  "incasso_minimum": 40,
  "incasso_percentage": 15,
  "photo_max_dimension_px": 1280
}
```

A next ZZP client can use 30% advance, 7-day payment, 12-month warranty, or skip BTW entirely — just edit their `config.json`.

## Storage shape (v1: localStorage)

Key: `zzp_shield_data`

```json
{
  "offertes": [
    {
      "id": "OFF-2026-001",
      "type": "offerte",
      "date": "2026-05-18",
      "validDays": 30,
      "paymentDays": 14,
      "btwPercentage": 21,
      "client": { "name": "...", "address": "...", "email": "...", "language": "nl" },
      "items": [
        { "refType": "service",  "refId": "timmerwerk",   "quantity": 8, "price": 45 },
        { "refType": "material", "refId": "binnendeur_std","quantity": 2, "price": 85 },
        { "refType": "custom",   "description": "...",    "category": "arbeid", "quantity": 1, "price": 100 }
      ],
      "notes": "",
      "status": "concept",
      "dupochron": {
        "opened_at": "...",
        "checkbox_at": "...",
        "decision_at": "...",
        "decision": "accepted",
        "decision_note": "",
        "user_agent": "..."
      },
      "generatedInvoices": ["FAC-2026-001", "FAC-2026-002"]
    }
  ],
  "facturen": [
    {
      "id": "FAC-2026-001",
      "type": "factuur",
      "invoicePhase": "voorschot",
      "sourceOfferteId": "OFF-2026-001",
      "paymentDays": 0,
      "status": "voorschot",
      "items": [ /* materiaal 100% + arbeid 20% */ ]
    }
  ],
  "counters": { "offerte": 1, "factuur": 2 }
}
```

## Roadmap

- **v1 (this release)** — website + panel + offerte/factuur builder + auto-split + dupochron (localStorage).
- **v2** — Supabase backend, email sending (Resend), real cross-device dupochron, PDF export (html2pdf.js), e-signature.
- **v3** — project phases with photo evidence, oplevering checklist.

## Footer credit

Every site built with this system shows in the footer:

```html
Website door <a href="https://gek-x.nl">GEK-X</a>
```
