// email-sender.js — Email delivery wrapper
//
// Offerte → Resend via Supabase Edge Function (branded HTML with 3 CTAs).
//          The CTA URLs embed the full offerte+config in the URL hash so the
//          client can open the link on any device without needing localStorage.
// Factuur / Oplevering → mailto: fallback (opens the user's email client).
//
// Edge function URL + anon key come from config.email; defaults fall back to the
// known GEK-X Supabase project.

const EmailSender = {
  config: null,

  init(config) { this.config = config; },

  endpoints() {
    const cfg = this.config?.email || {};
    return {
      sendUrl: cfg.sendUrl || 'https://dkihhmphimfqhyuzajwc.supabase.co/functions/v1/zzp-offerte',
      anonKey: cfg.anonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRraWhobXBoaW1mcWh5dXphandjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzI0NzQsImV4cCI6MjA4NzEwODQ3NH0.ky8a6mcPzlRKZyit6JbuyCJ2ZA7KnH6h2mmzpzNmjsw',
      viewBaseUrl: cfg.viewBaseUrl || (window.location.origin + window.location.pathname.replace(/[^/]+$/, '')).replace(/\/$/, '')
    };
  },

  viewUrl(type, doc) {
    const base = window.location.origin + window.location.pathname.replace(/[^/]+$/, '');
    if (type === 'oplevering') return `${base}oplevering-view.html?id=${encodeURIComponent(doc.id)}`;
    return `${base}offerte-view.html?id=${encodeURIComponent(doc.id)}&type=${type}`;
  },

  openMailto(toEmail, subject, body) {
    const url = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  },

  // ====== OFFERTE — via Resend Edge Function with 3 CTA branded email ======
  async sendOfferte(offerteId) {
    const doc = Storage.getById(offerteId, 'offerte');
    if (!doc?.client?.email) return { success: false, error: 'No client email' };

    const ep = this.endpoints();
    const payload = {
      type: 'send',
      offerte: doc,
      config: this.config,
      viewBaseUrl: ep.viewBaseUrl,
      ownerEmail: this.config?.company?.email
    };

    try {
      const res = await fetch(ep.sendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: ep.anonKey,
          Authorization: 'Bearer ' + ep.anonKey
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Surface server error; fall back to mailto so the owner can still send manually
        console.error('Edge function send failed:', data);
        const lang = doc.client.language || 'nl';
        const subject = this.subject('offerte', doc, lang);
        const body = this.body('offerte', doc, lang, this.viewUrl('offerte', doc));
        this.openMailto(doc.client.email, subject, body);
        return { success: false, error: data.error || 'Resend failed', fallback: 'mailto' };
      }

      // Record send + audit data on the offerte
      if (doc.status === 'concept') doc.status = 'sent';
      doc.dupochron = doc.dupochron || {};
      doc.dupochron.sent_at = new Date().toISOString();
      doc.email_message_id = data.message_id;
      doc.email_urls = data.urls;
      Storage.upsert(doc, 'offerte');

      return { success: true, message_id: data.message_id, sent_to: data.sent_to, urls: data.urls };
    } catch (e) {
      console.error('Network error calling edge function:', e);
      // Fall back to mailto
      const lang = doc.client.language || 'nl';
      const subject = this.subject('offerte', doc, lang);
      const body = this.body('offerte', doc, lang, this.viewUrl('offerte', doc));
      this.openMailto(doc.client.email, subject, body);
      return { success: false, error: String(e), fallback: 'mailto' };
    }
  },

  // ====== Response from offerte-view (client clicked CTA) → notify owner ======
  async sendResponse(offerteId, action, note, ownerEmail, ownerLang, companyName, accentColor, clientName, clientEmail) {
    const ep = this.endpoints();
    try {
      const res = await fetch(ep.sendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: ep.anonKey,
          Authorization: 'Bearer ' + ep.anonKey
        },
        body: JSON.stringify({
          type: 'respond',
          offerteId, action, note,
          ownerEmail, ownerLang, companyName, accentColor,
          clientName, clientEmail
        })
      });
      const data = await res.json().catch(() => ({}));
      return { success: res.ok, error: data.error, message_id: data.message_id };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  },

  // ====== FACTUUR & OPLEVERING — mailto fallback (unchanged) ======
  async sendFactuur(factuurId) {
    const doc = Storage.getById(factuurId, 'factuur');
    if (!doc?.client?.email) return { success: false, error: 'No client email' };

    const lang = doc.client.language || 'nl';
    const subject = this.subject('factuur', doc, lang);
    const body = this.body('factuur', doc, lang, this.viewUrl('factuur', doc));
    this.openMailto(doc.client.email, subject, body);

    if (doc.status === 'concept' || doc.status === 'voorschot') {
      doc.status = doc.invoicePhase === 'voorschot' ? 'voorschot' : 'open';
    }
    doc.sent_at = doc.sent_at || new Date().toISOString();
    Storage.upsert(doc, 'factuur');
    return { success: true };
  },

  async sendOplevering(offerteId) {
    const doc = Storage.getById(offerteId, 'offerte');
    if (!doc?.client?.email || !doc?.oplevering) return { success: false, error: 'No data' };

    const lang = doc.client.language || 'nl';
    const subject = this.subject('oplevering', doc, lang);
    const body = this.body('oplevering', doc, lang, this.viewUrl('oplevering', doc));
    this.openMailto(doc.client.email, subject, body);
    if (window.Oplevering) Oplevering.send(offerteId);
    return { success: true };
  },

  subject(type, doc, lang) {
    const c = this.config.company;
    const m = {
      offerte: { nl: `Offerte ${doc.id} — ${c.name}`, pl: `Oferta ${doc.id} — ${c.name}`, en: `Quote ${doc.id} — ${c.name}` },
      factuur: { nl: `Factuur ${doc.id} — ${c.name}`, pl: `Faktura ${doc.id} — ${c.name}`, en: `Invoice ${doc.id} — ${c.name}` },
      oplevering: { nl: `Oplevering ${doc.id} — ${c.name}`, pl: `Odbiór ${doc.id} — ${c.name}`, en: `Completion ${doc.id} — ${c.name}` }
    };
    return m[type]?.[lang] || m[type]?.nl || '';
  },

  body(type, doc, lang, viewUrl) {
    const c = this.config.company;
    const clientName = doc.client?.name || (lang === 'nl' ? 'heer/mevrouw' : lang === 'pl' ? 'Panie/Pani' : 'Sir/Madam');
    const payDays = doc.paymentDays ?? this.config.legal?.payment_terms_days ?? 14;

    const m = {
      offerte: {
        nl: `Geachte ${clientName},\n\nBijgaand vindt u onze offerte ${doc.id}.\n\nBekijk en accepteer uw offerte via onderstaande link:\n${viewUrl}\n\nDe offerte is geldig tot ${doc.validDays || 30} dagen na verzending.\n\nMet vriendelijke groet,\n${c.owner}\n${c.name}\n${c.phone}`,
        pl: `Szanowny/a ${clientName},\n\nW załączeniu nasza oferta ${doc.id}.\n\nZapoznaj się i zaakceptuj ofertę klikając w poniższy link:\n${viewUrl}\n\nOferta jest ważna przez ${doc.validDays || 30} dni od daty wysłania.\n\nZ poważaniem,\n${c.owner}\n${c.name}\n${c.phone}`,
        en: `Dear ${clientName},\n\nPlease find our quote ${doc.id} attached.\n\nReview and accept your quote via the link below:\n${viewUrl}\n\nThis quote is valid for ${doc.validDays || 30} days from sending.\n\nKind regards,\n${c.owner}\n${c.name}\n${c.phone}`
      },
      factuur: {
        nl: `Geachte ${clientName},\n\nBijgaand vindt u factuur ${doc.id}.\n\nBekijk uw factuur:\n${viewUrl}\n\nBetaling graag binnen ${payDays} dagen op IBAN ${c.iban} (${c.bank}) t.n.v. ${c.owner}.\nGelieve het factuurnummer ${doc.id} te vermelden.\n\nMet vriendelijke groet,\n${c.owner}\n${c.name}`,
        pl: `Szanowny/a ${clientName},\n\nW załączeniu faktura ${doc.id}.\n\nZobacz fakturę:\n${viewUrl}\n\nProsimy o płatność w ciągu ${payDays} dni na konto IBAN ${c.iban} (${c.bank}), odbiorca: ${c.owner}.\nProsimy podać numer faktury ${doc.id}.\n\nZ poważaniem,\n${c.owner}\n${c.name}`,
        en: `Dear ${clientName},\n\nPlease find invoice ${doc.id} attached.\n\nView your invoice:\n${viewUrl}\n\nPayment within ${payDays} days to IBAN ${c.iban} (${c.bank}) — ${c.owner}.\nPlease reference invoice number ${doc.id}.\n\nKind regards,\n${c.owner}\n${c.name}`
      },
      oplevering: {
        nl: `Geachte ${clientName},\n\nDe werkzaamheden voor offerte ${doc.id} zijn afgerond. Bekijk het opleveringsrapport en geef uw goedkeuring via onderstaande link:\n${viewUrl}\n\nNa uw goedkeuring ontvangt u de eindfactuur.\n\nMet vriendelijke groet,\n${c.owner}\n${c.name}\n${c.phone}`,
        pl: `Szanowny/a ${clientName},\n\nPrace zgodnie z ofertą ${doc.id} zostały zakończone. Zapoznaj się z protokołem odbioru i zatwierdź prace przez poniższy link:\n${viewUrl}\n\nPo Twoim zatwierdzeniu otrzymasz fakturę końcową.\n\nZ poważaniem,\n${c.owner}\n${c.name}\n${c.phone}`,
        en: `Dear ${clientName},\n\nThe work for quote ${doc.id} has been completed. Review the completion report and provide your approval via the link below:\n${viewUrl}\n\nOnce approved, you'll receive the final invoice.\n\nKind regards,\n${c.owner}\n${c.name}\n${c.phone}`
      }
    };
    return m[type]?.[lang] || m[type]?.nl || '';
  }
};

window.EmailSender = EmailSender;
