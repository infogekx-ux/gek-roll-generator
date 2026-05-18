// zzp-offerte.ts — ZZP Shield offerte email flow (Deno / Supabase Edge Function)
//
// Two operations multiplexed on one endpoint via { type } in the body:
//
//   POST /functions/v1/zzp-offerte
//   { "type": "send",
//     "offerte":  { ... full offerte JSON from the panel ... },
//     "config":   { company, branding, languages, legal, ... snapshot from config.json },
//     "viewBaseUrl": "https://ppponik.netlify.app",
//     "ownerEmail": "info.ppponik@gmail.com" }
//   → builds branded HTML with 3 CTAs (accept / change / reject),
//     sends via Resend, returns { success, message_id, urls }
//
//   POST /functions/v1/zzp-offerte
//   { "type": "respond",
//     "offerteId": "OFF-2026-001",
//     "action": "accept" | "change" | "reject",
//     "note":  "free-text from the client (optional, used for change/reject)",
//     "clientName": "...",
//     "clientEmail": "...",
//     "ownerEmail": "info.ppponik@gmail.com",
//     "ownerLang":  "pl",
//     "companyName": "PP.PONIK",
//     "accentColor": "#C8962E" }
//   → sends a notification email to the owner with the client's decision.
//
// CORS is open since the panel/offerte-view pages are static HTML served from Netlify.
// Resend API key is held server-side (not exposed to the browser).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_2CMUqJz9_5JqGuSoJyvSQEs78Y63ukHi3";
const RESEND_FROM = Deno.env.get("ZZP_RESEND_FROM") || "ZZP Shield <bestelling@gek-x.nl>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function esc(s: unknown): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function get(field: any, lang: string): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.nl || field.en || Object.values(field)[0] || "";
}

function fmtPrice(amount: number, lang: string): string {
  const locale = lang === "nl" ? "nl-NL" : lang === "pl" ? "pl-PL" : "en-GB";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(amount);
}

function fmtDate(iso: string, lang: string): string {
  const locale = lang === "nl" ? "nl-NL" : lang === "pl" ? "pl-PL" : "en-GB";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

// All UI strings localised; no hardcoded text on the client side
function getTexts(lang: string) {
  const t: Record<string, Record<string, string>> = {
    nl: {
      subject_send: "Offerte",
      greeting: "Beste",
      intro: "Hierbij ontvangt u onze offerte. U kunt deze online bekijken en direct reageren via de knoppen onderaan.",
      view_offerte: "Bekijk volledige offerte",
      project: "Offerte",
      investment: "Investering",
      excl_btw: "excl. BTW",
      incl_btw: "incl. BTW",
      btw: "BTW",
      payment: "Betalingsregeling",
      voorschot_label: "Voorschot (vooraf)",
      restant_label: "Restant (na oplevering)",
      dupochron_note: "Bij acceptatie worden automatisch twee facturen aangemaakt: voorschot (materiaal + 20% arbeid) vooraf, en de restantfactuur (80% arbeid) na oplevering.",
      contant_note: "Deze offerte is op contant-basis: één betaling, geen BTW.",
      valid_until: "Geldig tot",
      accept_btn: "✅ Ik ga akkoord",
      change_btn: "🔄 Ik wil iets aanpassen",
      reject_btn: "❌ Niet akkoord",
      footer: "Vragen? Neem gerust contact op.",
      regards: "Met vriendelijke groet",
      reply_subject_accept: "✅ Offerte geaccepteerd",
      reply_subject_change: "🔄 Klant wil wijzigingen",
      reply_subject_reject: "❌ Offerte afgewezen",
      reply_intro_accept: "heeft uw offerte geaccepteerd.",
      reply_intro_change: "wil wijzigingen bespreken voordat hij/zij de offerte accepteert.",
      reply_intro_reject: "heeft uw offerte afgewezen.",
      reply_note_label: "Bericht van de klant",
    },
    pl: {
      subject_send: "Oferta",
      greeting: "Szanowny/a",
      intro: "W załączeniu nasza oferta. Możesz ją przejrzeć online i odpowiedzieć bezpośrednio przyciskami na dole.",
      view_offerte: "Zobacz całą ofertę",
      project: "Oferta",
      investment: "Inwestycja",
      excl_btw: "netto",
      incl_btw: "brutto",
      btw: "VAT",
      payment: "Harmonogram płatności",
      voorschot_label: "Zaliczka (z góry)",
      restant_label: "Faktura końcowa (po odbiorze)",
      dupochron_note: "Po akceptacji automatycznie powstaną dwie faktury: zaliczka (materiał + 20% robocizny) z góry, oraz faktura końcowa (80% robocizny) po odbiorze.",
      contant_note: "Ta oferta jest na gotówkę: jedna płatność, bez VAT.",
      valid_until: "Ważna do",
      accept_btn: "✅ Akceptuję",
      change_btn: "🔄 Chcę zmianę",
      reject_btn: "❌ Odrzucam",
      footer: "Masz pytania? Skontaktuj się ze mną.",
      regards: "Z poważaniem",
      reply_subject_accept: "✅ Oferta zaakceptowana",
      reply_subject_change: "🔄 Klient chce zmian",
      reply_subject_reject: "❌ Oferta odrzucona",
      reply_intro_accept: "zaakceptował(a) Twoją ofertę.",
      reply_intro_change: "chce omówić zmiany przed akceptacją oferty.",
      reply_intro_reject: "odrzucił(a) Twoją ofertę.",
      reply_note_label: "Wiadomość od klienta",
    },
    en: {
      subject_send: "Quotation",
      greeting: "Dear",
      intro: "Please find our quotation below. You can review it online and respond directly with the buttons at the bottom.",
      view_offerte: "View full quotation",
      project: "Quotation",
      investment: "Investment",
      excl_btw: "excl. VAT",
      incl_btw: "incl. VAT",
      btw: "VAT",
      payment: "Payment schedule",
      voorschot_label: "Advance (upfront)",
      restant_label: "Remainder (after completion)",
      dupochron_note: "On acceptance two invoices are automatically created: advance (materials + 20% labor) upfront, and remainder (80% labor) after completion.",
      contant_note: "This quotation is cash-based: single payment, no VAT.",
      valid_until: "Valid until",
      accept_btn: "✅ I accept",
      change_btn: "🔄 I want changes",
      reject_btn: "❌ Reject",
      footer: "Questions? Don't hesitate to reach out.",
      regards: "Kind regards",
      reply_subject_accept: "✅ Quotation accepted",
      reply_subject_change: "🔄 Client wants changes",
      reply_subject_reject: "❌ Quotation rejected",
      reply_intro_accept: "accepted your quotation.",
      reply_intro_change: "wants to discuss changes before accepting the quotation.",
      reply_intro_reject: "rejected your quotation.",
      reply_note_label: "Message from the client",
    },
  };
  return t[lang] || t.nl;
}

function totals(offerte: any) {
  const items = offerte.items || [];
  const subtotal = items.reduce((s: number, it: any) =>
    s + (parseFloat(it.quantity) || 0) * (parseFloat(it.price) || 0), 0);
  const contant = offerte.contant === true;
  const btwPct = contant ? 0 : (offerte.btwPercentage || 21);
  const btw = subtotal * (btwPct / 100);
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    btw: Math.round(btw * 100) / 100,
    total: Math.round((subtotal + btw) * 100) / 100,
    btwPct,
  };
}

function splitTotals(offerte: any, config: any) {
  const items = offerte.items || [];
  const services = config.services || [];
  const materials = config.materials || [];
  const arbeidPct = (config.legal?.voorschot_arbeid_percentage || 20) / 100;

  const getCategory = (item: any): string => {
    if (item.category) return item.category;
    if (item.refType === "service") return services.find((x: any) => x.id === item.refId)?.category || "arbeid";
    if (item.refType === "material") return materials.find((x: any) => x.id === item.refId)?.category || "materiaal";
    return "arbeid";
  };

  let materiaal = 0, arbeid = 0;
  for (const it of items) {
    const v = (parseFloat(it.quantity) || 0) * (parseFloat(it.price) || 0);
    if (getCategory(it) === "materiaal") materiaal += v;
    else arbeid += v;
  }
  const voorschotSub = materiaal + arbeid * arbeidPct;
  const restantSub = arbeid * (1 - arbeidPct);
  const btwRate = (offerte.btwPercentage || 21) / 100;
  return {
    voorschot: {
      subtotal: Math.round(voorschotSub * 100) / 100,
      total: Math.round(voorschotSub * (1 + btwRate) * 100) / 100,
    },
    restant: {
      subtotal: Math.round(restantSub * 100) / 100,
      total: Math.round(restantSub * (1 + btwRate) * 100) / 100,
    },
  };
}

function resolveItemName(item: any, config: any, lang: string): string {
  if (item.refType === "service") {
    const s = (config.services || []).find((x: any) => x.id === item.refId);
    if (s) return get(s.name, lang);
  }
  if (item.refType === "material") {
    const m = (config.materials || []).find((x: any) => x.id === item.refId);
    if (m) return get(m.name, lang);
  }
  if (item.descriptions) return get(item.descriptions, lang);
  return item.description || "";
}

function resolveItemUnit(item: any, config: any, lang: string): string {
  const unitMap: Record<string, string> = {
    nl: { hourly: "uur", m2: "m²", per_unit: "stuk" } as any,
    pl: { hourly: "godz.", m2: "m²", per_unit: "szt." } as any,
    en: { hourly: "hr", m2: "m²", per_unit: "pc" } as any,
  } as any;
  if (item.refType === "material") {
    const m = (config.materials || []).find((x: any) => x.id === item.refId);
    if (m) return get(m.unit, lang);
  }
  if (item.refType === "service") {
    const s = (config.services || []).find((x: any) => x.id === item.refId);
    if (s) return (unitMap as any)[lang]?.[s.priceType] || (unitMap as any).nl[s.priceType] || "";
  }
  return item.unit || "";
}

function buildOfferEmail(offerte: any, config: any, viewBaseUrl: string, payloadEncoded: string): { html: string; subject: string; lang: string } {
  const c = config.company || {};
  const lang = offerte.client?.language || config.languages?.default || "nl";
  const T = getTexts(lang);
  const accent = config.branding?.accentColor || "#C8962E";
  const tot = totals(offerte);
  const contant = offerte.contant === true;
  const dupochronOn = offerte.dupochron !== false && !contant;
  const split = dupochronOn ? splitTotals(offerte, config) : null;

  // CTA URLs — payload encoded in hash so client device doesn't need localStorage
  const baseUrl = `${viewBaseUrl.replace(/\/$/, "")}/offerte-view.html?id=${encodeURIComponent(offerte.id)}`;
  const hash = `#data=${payloadEncoded}`;
  const acceptUrl = `${baseUrl}&action=accept${hash}`;
  const changeUrl = `${baseUrl}&action=change${hash}`;
  const rejectUrl = `${baseUrl}&action=reject${hash}`;
  const viewUrl   = `${baseUrl}${hash}`;

  const validUntil = new Date(offerte.date);
  validUntil.setDate(validUntil.getDate() + (offerte.validDays || 30));

  const itemRows = (offerte.items || []).map((it: any) => {
    const name = resolveItemName(it, config, lang);
    const unit = resolveItemUnit(it, config, lang);
    const qty = parseFloat(it.quantity) || 0;
    const price = parseFloat(it.price) || 0;
    const line = qty * price;
    return `
      <tr>
        <td style="padding:8px 4px;font-size:13px;color:#1d1d1f;">${esc(name)}</td>
        <td style="padding:8px 4px;font-size:13px;color:#86868b;text-align:right;">${qty} ${esc(unit)}</td>
        <td style="padding:8px 4px;font-size:13px;color:#1d1d1f;text-align:right;white-space:nowrap;">${fmtPrice(line, lang)}</td>
      </tr>
    `;
  }).join("");

  const splitHtml = split ? `
    <tr><td style="padding:8px 32px 16px;">
      <div style="background:${accent}10;border-left:3px solid ${accent};padding:12px 16px;border-radius:0 8px 8px 0;">
        <div style="font-size:11px;color:${accent};font-weight:700;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:6px;">${T.payment}</div>
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#1d1d1f;padding:2px 0;">
          <span>${T.voorschot_label}</span><strong>${fmtPrice(split.voorschot.total, lang)}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#1d1d1f;padding:2px 0;">
          <span>${T.restant_label}</span><strong>${fmtPrice(split.restant.total, lang)}</strong>
        </div>
        <div style="font-size:11px;color:#86868b;margin-top:8px;line-height:1.5;">${T.dupochron_note}</div>
      </div>
    </td></tr>
  ` : (contant ? `
    <tr><td style="padding:8px 32px 16px;">
      <div style="background:#f5f5f7;border-radius:8px;padding:10px 14px;font-size:12px;color:#86868b;">💵 ${T.contant_note}</div>
    </td></tr>
  ` : "");

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);max-width:600px;">

  <tr><td style="background:#1A1A1A;padding:24px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><span style="color:#fff;font-size:18px;font-weight:900;letter-spacing:0.03em;">${esc(c.name)}</span></td>
      <td align="right"><span style="color:${accent};font-size:11px;font-weight:700;letter-spacing:0.1em;padding:4px 12px;border:1px solid ${accent};border-radius:100px;">${esc(get(c.tagline, lang))}</span></td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:24px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><span style="font-size:11px;color:#86868b;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">${T.project} ${esc(offerte.id)}</span></td>
      <td align="right"><span style="font-size:11px;color:#86868b;">${fmtDate(offerte.date, lang)}</span></td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:16px 32px 8px;">
    <div style="font-size:15px;color:#1d1d1f;">${T.greeting} ${esc(offerte.client?.name || "")},</div>
    <div style="font-size:13px;color:#86868b;margin-top:8px;line-height:1.6;">${T.intro}</div>
  </td></tr>

  <tr><td style="padding:16px 32px 8px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <thead><tr style="border-bottom:1px solid #e5e5e5;">
        <th style="text-align:left;padding:8px 4px;font-size:11px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">${esc(T.project)}</th>
        <th style="text-align:right;padding:8px 4px;font-size:11px;color:#86868b;font-weight:600;"></th>
        <th style="text-align:right;padding:8px 4px;font-size:11px;color:#86868b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">${esc(T.investment)}</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
  </td></tr>

  <tr><td style="padding:8px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${tot.btwPct > 0 ? `
        <tr>
          <td style="font-size:13px;color:#86868b;padding:4px 0;">${esc(T.excl_btw)}</td>
          <td align="right" style="font-size:13px;color:#1d1d1f;font-weight:600;">${fmtPrice(tot.subtotal, lang)}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#86868b;padding:4px 0;">${T.btw} ${tot.btwPct}%</td>
          <td align="right" style="font-size:13px;color:#1d1d1f;">${fmtPrice(tot.btw, lang)}</td>
        </tr>
        <tr><td colspan="2" style="padding:4px 0;"><div style="height:1px;background:#e5e5e5;"></div></td></tr>
      ` : ""}
      <tr>
        <td style="font-size:15px;font-weight:700;color:#1d1d1f;padding:8px 0;">${tot.btwPct > 0 ? T.incl_btw : T.investment}</td>
        <td align="right" style="font-size:20px;font-weight:900;color:${accent};padding:8px 0;">${fmtPrice(tot.total, lang)}</td>
      </tr>
    </table>
  </td></tr>

  ${splitHtml}

  <tr><td style="padding:24px 32px 8px;">
    <a href="${viewUrl}" style="display:block;text-align:center;font-size:13px;color:${accent};text-decoration:underline;padding:8px;">${T.view_offerte} →</a>
  </td></tr>

  <tr><td style="padding:8px 32px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td align="center" style="padding-bottom:8px;">
        <a href="${acceptUrl}" style="display:block;background:#30D158;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 24px;border-radius:12px;text-align:center;">${T.accept_btn}</a>
      </td>
    </tr><tr>
      <td align="center" style="padding-bottom:8px;">
        <a href="${changeUrl}" style="display:block;background:#FF9500;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 24px;border-radius:12px;text-align:center;">${T.change_btn}</a>
      </td>
    </tr><tr>
      <td align="center">
        <a href="${rejectUrl}" style="display:block;background:#FF453A;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 24px;border-radius:12px;text-align:center;">${T.reject_btn}</a>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 32px 24px;">
    <div style="font-size:12px;color:#86868b;line-height:1.5;">${T.footer}</div>
    <div style="font-size:13px;color:#1d1d1f;margin-top:16px;">${T.regards},</div>
    <div style="font-size:13px;font-weight:700;color:#1d1d1f;">${esc(c.owner)}</div>
    <div style="font-size:12px;color:${accent};font-weight:600;">${esc(c.name)}</div>
  </td></tr>

  <tr><td style="background:#fafafa;padding:16px 32px;border-top:1px solid #e5e5e5;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:10px;color:#86868b;line-height:1.6;">
        ${esc(c.name)} · ${esc(c.address?.street)}, ${esc(c.address?.postcode)} ${esc(c.address?.city)}<br>
        KVK: ${esc(c.kvk)} · BTW: ${esc(c.btw)}<br>
        ${esc(c.phone)} · ${esc(c.email)}
      </td>
      <td align="right" style="font-size:10px;color:#86868b;vertical-align:bottom;">
        ${esc(c.website || "")}
      </td>
    </tr></table>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;

  const subject = `${T.subject_send} ${offerte.id} — ${c.name}`;
  return { html, subject, lang };
}

function buildOwnerNotification(args: {
  action: string;
  note?: string;
  offerteId: string;
  clientName: string;
  clientEmail: string;
  ownerLang: string;
  companyName: string;
  accentColor: string;
}): { html: string; subject: string } {
  const T = getTexts(args.ownerLang);
  const accent = args.accentColor || "#C8962E";
  let intro = T.reply_intro_accept, subject = T.reply_subject_accept, color = "#30D158";
  if (args.action === "change") { intro = T.reply_intro_change; subject = T.reply_subject_change; color = "#FF9500"; }
  if (args.action === "reject") { intro = T.reply_intro_reject; subject = T.reply_subject_reject; color = "#FF453A"; }

  const noteBlock = args.note ? `
    <div style="margin-top:16px;background:#f5f5f7;border-left:3px solid ${color};padding:12px 16px;border-radius:0 8px 8px 0;">
      <div style="font-size:11px;color:#86868b;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;margin-bottom:6px;">${T.reply_note_label}</div>
      <div style="font-size:13px;color:#1d1d1f;line-height:1.6;white-space:pre-line;">${esc(args.note)}</div>
    </div>` : "";

  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td align="center">
<table width="540" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
  <tr><td style="background:#1A1A1A;padding:18px 28px;">
    <span style="color:#fff;font-size:16px;font-weight:900;">${esc(args.companyName)}</span>
    <span style="color:${accent};font-size:11px;font-weight:700;float:right;padding:4px 12px;border:1px solid ${accent};border-radius:100px;letter-spacing:0.1em;">ZZP SHIELD</span>
  </td></tr>
  <tr><td style="padding:28px;">
    <div style="font-size:20px;font-weight:800;color:${color};margin-bottom:12px;">${subject}</div>
    <div style="font-size:14px;color:#1d1d1f;line-height:1.6;">
      <strong>${esc(args.clientName)}</strong> ${intro}
    </div>
    <div style="font-size:12px;color:#86868b;margin-top:8px;">${esc(args.offerteId)} · ${esc(args.clientEmail)}</div>
    ${noteBlock}
  </td></tr>
  <tr><td style="background:#fafafa;padding:14px 28px;border-top:1px solid #e5e5e5;font-size:11px;color:#86868b;text-align:center;">
    ZZP Shield — automated notification
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  return { html, subject: `${subject} — ${args.offerteId}` };
}

async function sendViaResend(to: string, subject: string, html: string, replyTo?: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [to],
      subject,
      html,
      reply_to: replyTo,
    }),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    // ===== SEND =====
    if (body.type === "send") {
      const { offerte, config, viewBaseUrl, ownerEmail } = body;
      if (!offerte?.client?.email) {
        return new Response(JSON.stringify({ error: "Missing client.email on offerte" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Encode payload for URL hash so the offerte-view page can render even though
      // the client opens the link on a fresh device with no localStorage.
      const slim = { offerte, config: {
        company: config.company,
        branding: config.branding,
        languages: config.languages,
        legal: { ...(config.legal || {}), terms: config.legal?.terms },
        services: config.services,
        materials: config.materials,
        email: config.email,
      }};
      const payloadEncoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(slim)))));

      const { html, subject, lang } = buildOfferEmail(offerte, config, viewBaseUrl, payloadEncoded);
      const result = await sendViaResend(offerte.client.email, subject, html, ownerEmail || config.company?.email);

      if (!result.ok) {
        return new Response(JSON.stringify({ error: "Resend failed", details: result.data }), {
          status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const baseUrl = `${(viewBaseUrl || "").replace(/\/$/, "")}/offerte-view.html?id=${encodeURIComponent(offerte.id)}`;
      return new Response(JSON.stringify({
        success: true,
        message_id: result.data?.id,
        sent_to: offerte.client.email,
        language: lang,
        urls: {
          view:   `${baseUrl}#data=${payloadEncoded}`,
          accept: `${baseUrl}&action=accept#data=${payloadEncoded}`,
          change: `${baseUrl}&action=change#data=${payloadEncoded}`,
          reject: `${baseUrl}&action=reject#data=${payloadEncoded}`,
        },
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ===== RESPOND =====
    if (body.type === "respond") {
      const { offerteId, action, note, clientName, clientEmail, ownerEmail, ownerLang, companyName, accentColor } = body;
      if (!ownerEmail || !offerteId || !action) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { html, subject } = buildOwnerNotification({
        action,
        note,
        offerteId,
        clientName: clientName || "—",
        clientEmail: clientEmail || "—",
        ownerLang: ownerLang || "nl",
        companyName: companyName || "ZZP Shield",
        accentColor: accentColor || "#C8962E",
      });

      const result = await sendViaResend(ownerEmail, subject, html, clientEmail || undefined);
      if (!result.ok) {
        return new Response(JSON.stringify({ error: "Resend failed", details: result.data }), {
          status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, message_id: result.data?.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown type", expected: ["send", "respond"] }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
