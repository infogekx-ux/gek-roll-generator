// =============================================================
// dtflow-deliver — Supabase Edge Function (Deno)
//
// POST /functions/v1/dtflow-deliver
//   body: { order_id }
//   -> { ok: true, data: { delivered_at, download_url } }
//
// Looks up the order, generates a signed 7-day Supabase Storage URL
// for the plugin ZIP (gek-x-hub/projekty/dtflow-site/dtflow-pro.zip),
// sends the welcome email via Resend, then flips dtflow_orders.delivered.
//
// Required Supabase secrets:
//   RESEND_API_KEY        re_…   (Resend API key)
//   SUPABASE_SERVICE_ROLE_KEY    (auto-injected by Supabase runtime)
//   SUPABASE_URL                 (auto-injected by Supabase runtime)
//
// Optional:
//   DTFLOW_SITE_URL       defaults to https://dtflow-app.netlify.app
//   FROM_EMAIL            defaults to noreply@gek-x.nl
// =============================================================

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL  = Deno.env.get('SUPABASE_URL') ?? 'https://dkihhmphimfqhyuzajwc.supabase.co';
const SERVICE_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_KEY    = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL    = Deno.env.get('FROM_EMAIL')      ?? 'noreply@gek-x.nl';
const SITE_URL      = Deno.env.get('DTFLOW_SITE_URL') ?? 'https://dtflow-app.netlify.app';

const ZIP_BUCKET    = 'gek-x-hub';
const ZIP_PATH      = 'projekty/dtflow-site/dtflow-pro.zip';
const SIGN_TTL      = 60 * 60 * 24 * 7; // 7 days

const cors = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function json(b: unknown, s = 200) { return new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } }); }
const ok  = (d: unknown)        => json({ ok: true, data: d });
const err = (m: string, s = 400) => json({ ok: false, error: m }, s);

function emailHtml(args: {
  firstName: string;
  downloadUrl: string;
  orderRef: string;
  total: string;
  vat: string;
  reverseCharge: boolean;
}) {
  // Inline-styled, table-based for max compatibility
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,'Helvetica Neue','Segoe UI',Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(17,24,39,.06);">

        <tr><td style="padding:32px 40px 8px;">
          <div style="font-weight:900;font-size:24px;letter-spacing:-.02em;color:#111827;">DT<span style="color:#0A84FF">Flow</span></div>
        </td></tr>

        <tr><td style="padding:8px 40px 0;">
          <h1 style="font-weight:800;font-size:24px;letter-spacing:-.02em;color:#111827;margin:18px 0 8px;">Welcome to DTFlow Pro, ${escapeHtml(args.firstName)}!</h1>
          <p style="color:#6B7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Your order is in. Hit the download button below to grab the plugin and install it in Adobe Illustrator. The link is valid for 7 days.
          </p>
        </td></tr>

        <tr><td align="center" style="padding:0 40px 8px;">
          <a href="${args.downloadUrl}"
             style="display:inline-block;background:#0A84FF;color:#FFFFFF;text-decoration:none;
                    padding:16px 36px;border-radius:999px;font-weight:700;font-size:15px;letter-spacing:-.005em;">
            Download DTFlow Pro
          </a>
          <div style="font-size:12px;color:#6B7280;margin-top:10px;">Link expires in 7 days</div>
        </td></tr>

        <tr><td style="padding:24px 40px 8px;">
          <h2 style="font-size:12px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:1.4px;margin:0 0 12px;">Quick install</h2>
          <ol style="color:#374151;font-size:14px;line-height:1.7;padding-left:20px;margin:0;">
            <li>Unzip <code style="background:#F3F4F6;padding:1px 6px;border-radius:4px;font-size:12px;">dtflow-pro.zip</code></li>
            <li>Windows: run <code style="background:#F3F4F6;padding:1px 6px;border-radius:4px;font-size:12px;">install-windows.ps1</code>. macOS: follow <code style="background:#F3F4F6;padding:1px 6px;border-radius:4px;font-size:12px;">INSTALL.md</code></li>
            <li>Restart Illustrator</li>
            <li>Open <strong>Window → Extensions → G|PRINT DTF Prep</strong></li>
          </ol>
        </td></tr>

        <tr><td style="padding:20px 40px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;">
            <tr><td style="padding:16px 18px;">
              <div style="font-size:11px;color:#6B7280;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;">Order summary</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;font-size:13px;color:#374151;">
                <tr><td style="padding:3px 0;">DTFlow Pro</td><td align="right" style="padding:3px 0;font-weight:600;">€19.99</td></tr>
                <tr><td style="padding:3px 0;">VAT</td><td align="right" style="padding:3px 0;font-weight:600;">€${escapeHtml(args.vat)}${args.reverseCharge ? ' (reverse charge)' : ''}</td></tr>
                <tr><td style="padding:8px 0 3px;border-top:1px solid #E5E7EB;font-weight:700;">Total</td><td align="right" style="padding:8px 0 3px;border-top:1px solid #E5E7EB;font-weight:800;">€${escapeHtml(args.total)}</td></tr>
              </table>
              <div style="font-size:11px;color:#9CA3AF;margin-top:10px;font-family:'SF Mono',Menlo,Consolas,monospace;">
                Order ${escapeHtml(args.orderRef)}
              </div>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:8px 40px 32px;">
          <p style="color:#6B7280;font-size:13px;line-height:1.6;margin:0;">
            Questions? Just reply to this email or write to <a href="mailto:info@gek-x.nl" style="color:#0A84FF;text-decoration:none;">info@gek-x.nl</a>. We read everything.
          </p>
        </td></tr>

        <tr><td style="padding:20px 40px;background:#0F172A;color:#94A3B8;font-size:11px;line-height:1.6;">
          <div style="color:#fff;font-weight:700;">GEK-X</div>
          <div>Snuitlibel 42, 5692 WS Son en Breugel, NL · KvK 82700354 · BTW NL003718640B29</div>
          <div style="margin-top:6px;">© 2026 GEK-X. All rights reserved.</div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

function emailText(args: {
  firstName: string;
  downloadUrl: string;
  orderRef: string;
  total: string;
}) {
  return `Welcome to DTFlow Pro, ${args.firstName}!

Your DTFlow Pro download is ready. The link is valid for 7 days.

Download:
${args.downloadUrl}

Quick install:
  1. Unzip dtflow-pro.zip
  2. Windows: run install-windows.ps1
     macOS:   follow INSTALL.md
  3. Restart Illustrator
  4. Open Window > Extensions > G|PRINT DTF Prep

Order reference: ${args.orderRef}
Total paid: EUR ${args.total}

Questions? Reply to this email or write to info@gek-x.nl.

— GEK-X
   Snuitlibel 42, 5692 WS Son en Breugel, NL
   KvK 82700354 · BTW NL003718640B29
`;
}

function escapeHtml(s: string) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST')    return err('POST only', 405);

  let body: any;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }
  if (!body.order_id) return err('Missing order_id');

  const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  const { data: order, error: fetchErr } = await sb
    .from('dtflow_orders')
    .select('*')
    .eq('id', body.order_id)
    .single();
  if (fetchErr || !order) return err('Order not found');

  // Signed Storage URL — uses download.html with the order's download_token,
  // not the raw bucket URL, so token-based revocation/expiry still applies.
  const downloadUrl = `${SITE_URL}/download.html?t=${order.download_token}`;

  // Send email via Resend
  const subject = 'Your DTFlow Pro download';
  const html = emailHtml({
    firstName: order.first_name,
    downloadUrl,
    orderRef: order.id.substring(0, 8).toUpperCase(),
    total: parseFloat(order.total_incl ?? 0).toFixed(2),
    vat: parseFloat(order.vat_amount ?? 0).toFixed(2),
    reverseCharge: !!order.reverse_charge,
  });
  const text = emailText({
    firstName: order.first_name,
    downloadUrl,
    orderRef: order.id.substring(0, 8).toUpperCase(),
    total: parseFloat(order.total_incl ?? 0).toFixed(2),
  });

  if (!RESEND_KEY) {
    return err('RESEND_API_KEY not configured in Supabase secrets', 500);
  }

  const resendResp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:    `DTFlow <${FROM_EMAIL}>`,
      to:      [order.email],
      reply_to: 'info@gek-x.nl',
      subject,
      html,
      text,
    }),
  });

  if (!resendResp.ok) {
    const txt = await resendResp.text();
    return err(`Resend send failed (${resendResp.status}): ${txt}`, 502);
  }

  const deliveredAt = new Date().toISOString();
  await sb.from('dtflow_orders')
    .update({ delivered: true, delivered_at: deliveredAt })
    .eq('id', body.order_id);

  return ok({ delivered_at: deliveredAt, download_url: downloadUrl });
});
