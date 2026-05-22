// =============================================================
// dtflow-download — Supabase Edge Function (Deno)
//
// GET /functions/v1/dtflow-download?t=<download_token>
//   -> { ok: true, data: { url, filename, size, order_ref, expires } }
//
// Looks up the order by download_token, verifies it's < 7 days old,
// issues a 1-hour signed URL on the plugin ZIP, returns metadata.
// =============================================================

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? 'https://dkihhmphimfqhyuzajwc.supabase.co';
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const ZIP_BUCKET     = 'gek-x-hub';
const ZIP_PATH       = 'projekty/dtflow-site/dtflow-pro.zip';
const ZIP_FILENAME   = 'dtflow-pro.zip';
const ORDER_TTL_MS   = 1000 * 60 * 60 * 24 * 7;  // 7 days from order creation
const SIGN_URL_TTL   = 60 * 60;                  // 1 hour signed URL

const cors = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};
function json(b: unknown, s = 200) { return new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } }); }
const ok  = (d: unknown)         => json({ ok: true, data: d });
const err = (m: string, s = 400) => json({ ok: false, error: m }, s);

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'GET')     return err('GET only', 405);

  const url   = new URL(req.url);
  const token = url.searchParams.get('t') || url.searchParams.get('token');
  if (!token) return err('Missing token');

  const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  const { data: order, error: lookupErr } = await sb
    .from('dtflow_orders')
    .select('id, created_at, payment_status, download_count, email, first_name')
    .eq('download_token', token)
    .maybeSingle();

  if (lookupErr) return err('Lookup failed: ' + lookupErr.message, 500);
  if (!order)    return err('Token not recognised', 404);

  // 7-day expiry (counting from order creation, not from email send)
  const ageMs = Date.now() - new Date(order.created_at).getTime();
  if (ageMs > ORDER_TTL_MS) return err('Download link has expired (7 days)', 410);

  // Hard rate limit: 50 downloads max per token
  if ((order.download_count ?? 0) >= 50) return err('Download limit reached', 429);

  // Sign storage URL
  const { data: signed, error: signErr } = await sb.storage
    .from(ZIP_BUCKET)
    .createSignedUrl(ZIP_PATH, SIGN_URL_TTL, { download: ZIP_FILENAME });

  if (signErr || !signed?.signedUrl) {
    return err('Could not sign download URL: ' + (signErr?.message ?? 'unknown'), 500);
  }

  // Probe file size (HEAD)
  let size: number | null = null;
  try {
    const head = await fetch(signed.signedUrl, { method: 'HEAD' });
    const cl = head.headers.get('content-length');
    if (cl) size = parseInt(cl, 10);
  } catch (_e) { /* size is optional */ }

  // Bump counter (best-effort)
  sb.from('dtflow_orders')
    .update({ download_count: (order.download_count ?? 0) + 1 })
    .eq('id', order.id)
    .then(() => {})
    .catch(() => {});

  const expiresAt = new Date(new Date(order.created_at).getTime() + ORDER_TTL_MS);

  return ok({
    url:       signed.signedUrl,
    filename:  ZIP_FILENAME,
    size,
    order_ref: order.id.substring(0, 8).toUpperCase(),
    expires:   expiresAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  });
});
