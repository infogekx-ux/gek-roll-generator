# DTFlow checkout, delivery & admin

Three HTML pages + three Supabase Edge Functions + one plugin ZIP that
together turn the existing **DTFlow** landing into a working order pipeline.
Stripe is **not** wired up yet — orders save in `pending` state and
the owner triggers delivery manually from the admin panel.

```
dtflow-checkout/
├── checkout.html        ← Buyer form (VAT-aware, B2B reverse charge, promo)
├── download.html        ← Token-gated download landing
├── admin.html           ← PIN 2407 · orders + promo CRUD
├── dtflow-pro.zip       ← Distribution build of com.gekx.dtfprep
├── edge-functions/
│   ├── dtflow-checkout.ts   POST /functions/v1/dtflow-checkout
│   ├── dtflow-deliver.ts    POST /functions/v1/dtflow-deliver
│   └── dtflow-download.ts   GET  /functions/v1/dtflow-download
└── README.md            ← This file
```

The landing pages reuse the **DTFlow** site styling (Montserrat, blue
`#0A84FF`, white background). All brand names are wrapped in
`<span translate="no" class="notranslate">` so Translate doesn't mangle
`DTFlow`, `GEK-X`, `G|SAAS`, or `G|PRINT`.

## Database (Supabase)

Schema is already applied via Supabase MCP migration
`dtflow_checkout_schema`. It creates:

* `public.dtflow_orders` — every order, full audit trail of pricing
  (`price_excl`, `vat_pct`, `vat_amount`, `discount_pct`,
  `discount_amount`, `total_incl`, `reverse_charge`, `promo_code`).
  Status enum: `pending` / `paid` / `failed` / `refunded`.
  RLS **enabled** with no public policies — only service-role reaches it.
* `public.dtflow_promos` — promo codes. RLS enabled, same pattern.

Seeded codes (active, all percentage-off):

| Code      | Discount | Max uses |
|-----------|----------|----------|
| `LAUNCH20` | 20 % | 100 |
| `DTFREE`   | 100 % | 10 |
| `FRIEND50` | 50 % | 25 |

The schema is idempotent (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`),
safe to re-run.

## VAT handling

VAT is calculated **server-side** in `dtflow-checkout.ts`. The client UI
shows a running total but the canonical numbers come from the edge
function. Rules:

1. EU rate table is hardcoded for all 27 member states + UK 20 %.
2. Non-EU (`US`, `CA`, `AU`, `OTHER`) defaults to 0 %.
3. **EU B2B reverse charge**: if `customer_type === 'business'` and
   `country !== 'NL'` and country is in the EU set and the VAT ID
   matches the country's regex, VAT is set to 0 % and `reverse_charge`
   is flagged on the order.
4. NL businesses pay full 21 % (intra-NL B2B is not reverse-charged).
5. Discount is applied to the **net** before VAT (standard EU practice).

## Buyer flow

1. Visitor clicks any **Start Free Trial** link on
   `https://dtflow-app.netlify.app/`.
2. `checkout.html` collects customer + address + (if business) VAT ID
   + optional promo code. Live VAT recalculation client-side.
3. Submit posts to `dtflow-checkout` edge function. It re-validates,
   re-computes VAT and discount, inserts into `dtflow_orders` with
   `payment_status = 'pending'`, increments promo `used_count`.
4. Success panel shows order ID. Buyer is told *"payment coming soon —
   we'll email you the moment checkout opens"*.
5. Owner reviews in `admin.html`, clicks **Mark as paid** when payment
   lands (manual until Stripe), then **Deliver**.
6. **Deliver** calls `dtflow-deliver` → looks up the order →
   builds a download URL (`{SITE}/download.html?t={download_token}`) →
   sends a styled Resend email → flips `delivered = true`.
7. Buyer clicks the email link. `download.html` calls `dtflow-download`,
   which validates the token (rejects > 7 days old, > 50 downloads),
   asks Supabase Storage for a 1-hour signed URL on
   `gek-x-hub/projekty/dtflow-site/dtflow-pro.zip`, and the page kicks
   off the download.

## Admin panel

* `admin.html` is PIN-gated (`2407`). PIN check is **client-side only**
  — the security boundary is Supabase RLS + service-role key in the
  HTML, not the PIN. Treat the URL as semi-secret.
* Dashboard: total orders, paid count + revenue, pending count, total
  revenue (€).
* Orders table: search (name / email / company), filter (All / Paid /
  Pending / Undelivered), per-row "Mark paid" and "Deliver" buttons,
  click-to-detail modal.
* Promo tab: add new code (code, %, max uses, valid-until date),
  activate / deactivate. Code uniqueness enforced by the DB unique
  constraint.
* Auto-refresh every 60 s.

## Edge function deployment

The functions are intentionally **not** auto-deployed from this folder —
the brief reserves Netlify and Supabase deploys for review. To deploy
them manually:

### Option A — Supabase CLI

```bash
cd dtflow-checkout/edge-functions

# Resend API key — required for dtflow-deliver
supabase secrets set RESEND_API_KEY=re_xxx \
                     FROM_EMAIL=noreply@gek-x.nl \
                     DTFLOW_SITE_URL=https://dtflow-app.netlify.app \
                     --project-ref dkihhmphimfqhyuzajwc

supabase functions deploy dtflow-checkout --project-ref dkihhmphimfqhyuzajwc
supabase functions deploy dtflow-deliver  --project-ref dkihhmphimfqhyuzajwc
supabase functions deploy dtflow-download --project-ref dkihhmphimfqhyuzajwc
```

### Option B — Supabase dashboard

1. Open <https://supabase.com/dashboard/project/dkihhmphimfqhyuzajwc/functions>
2. **Create function** → name `dtflow-checkout` → paste
   `edge-functions/dtflow-checkout.ts`
3. Repeat for `dtflow-deliver` and `dtflow-download`
4. **Settings → Secrets** → add `RESEND_API_KEY`, `FROM_EMAIL`,
   `DTFLOW_SITE_URL`

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by the
Supabase runtime — do not set them yourself.

## Plugin ZIP

`dtflow-pro.zip` (~33 KB) contains the latest **com.gekx.dtfprep**
build:

```
com.gekx.dtfprep/
├── CSXS/manifest.xml
├── client/  (index.html, main.js, style.css)
├── host/index.jsx
├── lib/CSInterface.js
├── icons/   (icon-dark.png, icon-light.png)
├── test/    (install-windows.ps1, test-dtf-prep.jsx)
├── .debug
├── INSTALL.md
└── README.md
```

Upload it to Supabase Storage:

```
bucket: gek-x-hub
path:   projekty/dtflow-site/dtflow-pro.zip
```

Already mirrored from the hub during this build, so `dtflow-download`
just signs a URL against that path.

To rebuild after updating any plugin source:

```bash
cd /path/to/dtf-prep/..
rm -rf /tmp/zip && mkdir -p /tmp/zip/com.gekx.dtfprep
cp -r dtf-prep/. /tmp/zip/com.gekx.dtfprep/
cd /tmp/zip && zip -r dtflow-pro.zip com.gekx.dtfprep
# re-upload to hub
```

## Netlify deployment

`checkout.html`, `download.html`, and `admin.html` slot into the
existing `dtflow-site/` Netlify deploy. Drop them next to the existing
`index.html` and redeploy the site folder (not touched by this task).

The brief explicitly leaves Netlify deploy for review — these pages are
in the hub at `projekty/dtflow-site/` ready to pull down.

## Hub locations

```
gek-x-hub/projekty/dtflow-site/checkout.html
gek-x-hub/projekty/dtflow-site/download.html
gek-x-hub/projekty/dtflow-site/admin.html
gek-x-hub/projekty/dtflow-site/dtflow-pro.zip
gek-x-hub/projekty/dtflow-site/edge-functions/dtflow-checkout.ts
gek-x-hub/projekty/dtflow-site/edge-functions/dtflow-deliver.ts
gek-x-hub/projekty/dtflow-site/edge-functions/dtflow-download.ts
gek-x-hub/projekty/dtflow-site/README-CHECKOUT.md
```

## What is not implemented

* **Stripe**. Hooks left at `payment_provider` / `payment_id` columns.
  Wiring it up means: add a `/dtflow-stripe-webhook` function that
  flips `payment_status` to `paid` and calls `dtflow-deliver` on
  `checkout.session.completed`, and have `dtflow-checkout` create a
  Stripe Checkout Session and return its URL instead of the success
  panel.
* **Invoice PDF**. Email is HTML-only for now. A PDF attachment hook
  would slot in inside `dtflow-deliver.ts` right before the Resend
  call.
* **VIES VAT validation**. The VAT-ID regex catches format errors,
  but real validity (live VIES check) is not done. Add a call to
  `https://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl`
  if you want belt-and-braces.
