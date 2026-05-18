# ZZP SHIELD

Universal website system for ZZP'ers in construction. One codebase, per-client `config.json` for branding, services, materials and translations.

First skin: **PP.PONIK** — Piotr Ponikowski, carpentry & maintenance, Oss, NL.

## Stack

- Pure HTML/CSS/JS — no frameworks, no build step
- Multilingual: NL / PL / EN (switchable, persisted in localStorage)
- Mobile-first, Lighthouse-friendly
- Storage: localStorage (v1, single device)
- Hosting: Netlify (forms + drag-and-drop deploy)

## Structure

```
zzp-shield/
├── index.html              Public site
├── panel.html              Owner dashboard (PIN-gated)
├── offerte-preview.html    Client-facing quote/invoice view
├── css/
│   ├── base.css            Layout, typography, CSS variables
│   └── components.css      Cards, forms, gallery, panel, doc preview
├── js/
│   ├── i18n.js             Translation system + formatters
│   ├── app.js              Public site renderer (config-driven)
│   ├── gallery.js          Lightbox
│   ├── contact.js          Contact form + drag-drop photo upload
│   ├── offerte.js          Quote/invoice engine + storage
│   └── panel.js            Panel UI (login, list, builder)
├── config/
│   └── config.json         All client data (company, branding, services, materials, translations)
└── assets/
    ├── logo.png            Client logo (transparent PNG or SVG)
    └── gallery/            Project photos
```

## Deploy

1. Drop the `zzp-shield/` folder onto Netlify (or `netlify deploy --dir=zzp-shield`).
2. Set custom domain if needed (e.g. `ppponik.netlify.app`).
3. That's it — config-driven, no build step.

## Panel access

- URL: `/panel.html`
- PIN: set in `config.json` → `panel.pin` (default `1234`)
- Sessie-based (logs out on tab close)

## Adding a new client

1. Copy `config/config.json` and customize: company info, branding colors, services, materials, translations.
2. Drop new logo into `assets/logo.png`.
3. Add gallery photos into `assets/gallery/` and register paths in `js/gallery.js` (`window.GALLERY_IMAGES`).
4. Deploy.

## Adding gallery photos

Edit `js/gallery.js` and set:

```js
window.GALLERY_IMAGES = [
  './assets/gallery/project-01.jpg',
  './assets/gallery/project-02.jpg',
  // ...
];
```

Photos lazy-load; lightbox opens on click.

## Roadmap

- **v1 (this release):** website + panel + offerte/factuur builder, localStorage
- **v2:** Supabase backend, email sending (Resend), PDF export (html2pdf.js), e-signature
- **v3:** project phases with photo evidence, oplevering checklist
