# GEK Roll Generator

Server-side DTF/UV DTF roll image generator for GEK-X print services.

## What it does
- Receives roll layout data (placed items with x/y positions) 
- Downloads source images from Supabase Storage
- Generates high-resolution roll PNG (300 DPI) using sharp
- Uploads result back to Supabase Storage
- Returns download URL

## Why
Browser canvas crashes on large orders (200+ items, 30m+ rolls = 1.3 billion pixels).
Sharp + Node.js handles this in 1-2 minutes with 2GB RAM.

## Deploy
Deployed on Railway. Auto-deploys on push to main.

## Environment Variables (set in Railway)
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_KEY` — Supabase service role key
- `PORT` — Set automatically by Railway

## API
```
POST /generate-roll
Content-Type: application/json

{
  config: { rollWidth, printableWidth, cutMargin, printerName, printerLogo, supabaseBucket },
  placed: [{ id, fileNum, x, y, w, h, rotated }],
  totalLength: 2940,
  files: [{ name, fileNum, storagePath, displayName, quantity }],
  customer: { name, company, email },
  orderFolder: "orders/01-03-2026_GS-DRS_Company_Name",
  orderId: "PF-ABC123"
}
```

## Part of GEK-X ecosystem
- GEK | SAAS — DTF Roll Studio, UV DTF Roll Studio
- Supabase — Database + Storage + Edge Functions
- Resend — Email delivery
