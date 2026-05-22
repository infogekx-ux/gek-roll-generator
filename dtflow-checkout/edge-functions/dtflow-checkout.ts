// =============================================================
// dtflow-checkout — Supabase Edge Function (Deno)
//
// POST /functions/v1/dtflow-checkout
//   body: { customer_type, first_name, last_name, email, phone,
//           country, street, zip, city,
//           company_name?, registration_number?, vat_id?,
//           promo_code?, calc: { rate, vat_amount, discount_pct,
//                                discount_amount, total, reverse_charge } }
//   -> { ok: true, data: { order_id, total, status: 'pending' } }
//
// POST /functions/v1/dtflow-checkout?op=promo
//   body: { code }
//   -> { ok: true, data: { discount_pct } } | { ok: false, error }
//
// Server re-validates everything sent from the client — never trust the
// client-side total. Recomputes VAT + discount, writes the canonical
// numbers to dtflow_orders.
// =============================================================

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? 'https://dkihhmphimfqhyuzajwc.supabase.co';
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const PRICE_EXCL = 19.99;

const VAT_RATES: Record<string, number> = {
  NL: 21, DE: 19, BE: 21, FR: 20, AT: 20, IT: 22, ES: 21, PT: 23,
  PL: 23, CZ: 21, SK: 20, HU: 27, RO: 19, BG: 20, HR: 25, SI: 22,
  LT: 21, LV: 21, EE: 22, FI: 25.5, SE: 25, DK: 25, IE: 23, LU: 17,
  MT: 18, CY: 19, GR: 24,
  UK: 20,
  US: 0, CA: 0, AU: 0, OTHER: 0,
};
const EU = new Set([
  'NL','DE','BE','FR','AT','IT','ES','PT','PL','CZ','SK','HU','RO','BG',
  'HR','SI','LT','LV','EE','FI','SE','DK','IE','LU','MT','CY','GR',
]);

const VAT_REGEX: Record<string, RegExp> = {
  NL: /^NL[0-9]{9}B[0-9]{2}$/,
  DE: /^DE[0-9]{9}$/,
  BE: /^BE[0-9]{10}$/,
  FR: /^FR[A-Z0-9]{2}[0-9]{9}$/,
  AT: /^ATU[0-9]{8}$/,
  IT: /^IT[0-9]{11}$/,
  ES: /^ES[A-Z0-9][0-9]{7}[A-Z0-9]$/,
  PT: /^PT[0-9]{9}$/,
  PL: /^PL[0-9]{10}$/,
  CZ: /^CZ[0-9]{8,10}$/,
  SK: /^SK[0-9]{10}$/,
  HU: /^HU[0-9]{8}$/,
  RO: /^RO[0-9]{2,10}$/,
  BG: /^BG[0-9]{9,10}$/,
  HR: /^HR[0-9]{11}$/,
  SI: /^SI[0-9]{8}$/,
  LT: /^LT([0-9]{9}|[0-9]{12})$/,
  LV: /^LV[0-9]{11}$/,
  EE: /^EE[0-9]{9}$/,
  FI: /^FI[0-9]{8}$/,
  SE: /^SE[0-9]{12}$/,
  DK: /^DK[0-9]{8}$/,
  IE: /^IE[0-9A-Z+*]{7,9}$/,
  LU: /^LU[0-9]{8}$/,
  MT: /^MT[0-9]{8}$/,
  CY: /^CY[0-9]{8}[A-Z]$/,
  GR: /^(EL|GR)[0-9]{9}$/,
  UK: /^GB([0-9]{9}|[0-9]{12}|GD[0-9]{3}|HA[0-9]{3})$/,
};

const cors = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
const ok  = (data: unknown) => json({ ok: true,  data });
const err = (msg: string, status = 400) => json({ ok: false, error: msg }, status);

const round2 = (n: number) => Math.round(n * 100) / 100;
const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST')    return err('POST only', 405);

  const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const url = new URL(req.url);
  const op  = url.searchParams.get('op');

  let body: any;
  try { body = await req.json(); }
  catch { return err('Invalid JSON'); }

  // ---------- Promo lookup ----------
  if (op === 'promo') {
    const code = String(body.code ?? '').trim().toUpperCase();
    if (!code) return err('Empty code');
    const { data, error } = await sb
      .from('dtflow_promos')
      .select('discount_pct, max_uses, used_count, active, valid_until')
      .eq('code', code)
      .maybeSingle();
    if (error)  return err('Lookup failed: ' + error.message, 500);
    if (!data)  return err('Code not found');
    if (!data.active) return err('Code is inactive');
    if (data.valid_until && new Date(data.valid_until) < new Date()) return err('Code expired');
    if (data.max_uses != null && data.used_count >= data.max_uses)   return err('Code fully used');
    return ok({ discount_pct: parseFloat(String(data.discount_pct)) });
  }

  // ---------- Order create ----------
  const required = ['customer_type', 'first_name', 'last_name', 'email', 'country'];
  for (const k of required) {
    if (!body[k] || typeof body[k] !== 'string') return err(`Missing ${k}`);
  }
  if (body.customer_type !== 'private' && body.customer_type !== 'business') {
    return err('Invalid customer_type');
  }
  if (!emailOk(body.email)) return err('Invalid email');
  if (body.customer_type === 'business' && !body.company_name) {
    return err('Company name required for business orders');
  }

  const country = String(body.country).toUpperCase();

  // Validate VAT ID if provided
  let vatIdClean = '';
  let vatIdValid = false;
  if (body.vat_id) {
    vatIdClean = String(body.vat_id).toUpperCase().replace(/\s+/g, '');
    const rx = VAT_REGEX[country];
    vatIdValid = rx ? rx.test(vatIdClean) : vatIdClean.length >= 5;
  }

  // Server-side recompute (do not trust client)
  let vatPct = VAT_RATES[country] ?? 0;
  let reverseCharge = false;
  if (body.customer_type === 'business' && country !== 'NL' && EU.has(country) && vatIdValid) {
    vatPct = 0;
    reverseCharge = true;
  }

  // Promo
  let discountPct = 0;
  let promoCode: string | null = null;
  if (body.promo_code) {
    const code = String(body.promo_code).trim().toUpperCase();
    const { data: p } = await sb
      .from('dtflow_promos')
      .select('discount_pct, max_uses, used_count, active, valid_until')
      .eq('code', code)
      .maybeSingle();
    if (p && p.active
        && (!p.valid_until || new Date(p.valid_until) >= new Date())
        && (p.max_uses == null || p.used_count < p.max_uses)) {
      discountPct = parseFloat(String(p.discount_pct));
      promoCode = code;
    }
  }

  const net           = PRICE_EXCL;
  const discountAmt   = round2(net * (discountPct / 100));
  const netAfter      = round2(net - discountAmt);
  const vatAmount     = round2(netAfter * (vatPct / 100));
  const total         = round2(netAfter + vatAmount);

  const orderRow = {
    customer_type:        body.customer_type,
    first_name:           String(body.first_name).trim(),
    last_name:            String(body.last_name).trim(),
    email:                String(body.email).trim().toLowerCase(),
    phone:                body.phone   ? String(body.phone).trim()   : null,
    country,
    street:               body.street  ? String(body.street).trim()  : null,
    zip:                  body.zip     ? String(body.zip).trim()     : null,
    city:                 body.city    ? String(body.city).trim()    : null,
    company_name:         body.company_name        ? String(body.company_name).trim()        : null,
    registration_number:  body.registration_number ? String(body.registration_number).trim() : null,
    vat_id:               vatIdClean || null,
    plan:                 'pro',
    price_excl:           net,
    vat_pct:              vatPct,
    vat_amount:           vatAmount,
    discount_pct:         discountPct,
    discount_amount:      discountAmt,
    total_incl:           total,
    promo_code:           promoCode,
    reverse_charge:       reverseCharge,
    payment_status:       'pending',
  };

  const { data: order, error: insertErr } = await sb
    .from('dtflow_orders')
    .insert(orderRow)
    .select('id, total_incl, payment_status, download_token')
    .single();

  if (insertErr) return err('Insert failed: ' + insertErr.message, 500);

  // Bump promo usage (best-effort, non-blocking on failure)
  if (promoCode) {
    try {
      const { data: pRow } = await sb
        .from('dtflow_promos')
        .select('used_count')
        .eq('code', promoCode)
        .single();
      if (pRow) {
        await sb.from('dtflow_promos')
          .update({ used_count: (pRow.used_count ?? 0) + 1 })
          .eq('code', promoCode);
      }
    } catch (_e) { /* swallow — order is already persisted */ }
  }

  return ok({
    order_id:       order.id,
    total:          order.total_incl,
    status:         order.payment_status,
    download_token: order.download_token, // not exposed to UI yet, but available for Stripe webhook
  });
});
