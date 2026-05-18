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
│       ├── offerte.js           # engine + auto-split + dupochron storage
│       ├── panel.js             # ZZP'er dashboard (login, list, builder)
│       ├── dupochron.js         # client acceptance page logic
│       ├── gallery.js           # lightbox
│       └── contact.js           # form + drag-drop photo upload
├── clients/
│   └── ppponik/                 # PP.PONIK — first client
│       ├── config/config.json   # all client data
│       ├── index.html           # public site
│       ├── panel.html           # ZZP'er dashboard
│       ├── offerte-view.html    # client-facing quote view + dupochron
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
  - The full Algemene Voorwaarden (scrollable, from `config.legal.terms`)
  - Required checkbox ("I have read and understood")
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
