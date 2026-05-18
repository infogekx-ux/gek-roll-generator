// panel.js - ZZP'er dashboard
// Views: list | builder | beginsituatie | oplevering
// Owner works in own language. On accepted offerte: lifecycle actions (Beginsituatie / Meerwerk / Oplevering) + timeline.

const Panel = {
  config: null,
  view: 'list',           // 'list' | 'builder' | 'beginsituatie' | 'oplevering'
  listType: 'offerte',
  currentDoc: null,

  async init() {
    try {
      const res = await fetch('./config/config.json');
      this.config = await res.json();
      window.AppConfig = this.config;
    } catch (e) {
      document.body.innerHTML = '<p style="padding:48px;text-align:center;">Configuration error</p>';
      return;
    }

    I18n.init(this.config);
    Offerte.init(this.config);
    if (window.Oplevering) Oplevering.init(this.config);
    if (window.SocialGenerator) SocialGenerator.init(this.config);
    if (window.EmailSender) EmailSender.init(this.config);

    const ownerLang = this.config.languages.ownerLanguage || this.config.languages.default;
    I18n.setLang(ownerLang);

    this.applyBranding();
    this.checkLogin();
  },

  applyBranding() {
    const b = this.config.branding || {};
    const root = document.documentElement.style;
    if (b.accentColor) root.setProperty('--accent', b.accentColor);
    if (b.accentColorLight) root.setProperty('--accent-light', b.accentColorLight);
    if (b.fontHeading) root.setProperty('--font-heading', `'${b.fontHeading}', sans-serif`);
    if (b.fontBody) root.setProperty('--font-body', `'${b.fontBody}', sans-serif`);
    document.title = `${this.config.company.name} — Panel`;
  },

  logoMarkup() {
    const name = this.config.company.name;
    const parts = name.split('.');
    if (parts.length > 1) return `<span class="logo-accent">${parts[0]}</span>.${parts.slice(1).join('.')}`;
    return `<span class="logo-accent">${name}</span>`;
  },

  checkLogin() {
    const loggedIn = sessionStorage.getItem('zzp_panel_auth') === 'yes';
    if (loggedIn) this.renderPanel();
    else this.renderLogin();
  },

  renderLogin() {
    document.body.className = 'panel-body';
    document.body.innerHTML = `
      <div class="login-screen">
        <div class="login-card">
          <div class="logo">
            <img src="./assets/logo.png" alt="" onerror="this.style.display='none'">
            <span>${this.logoMarkup()}</span>
          </div>
          <h2 style="margin-bottom:1.5rem;">${I18n.t('panel_login_title')}</h2>
          <form id="login-form">
            <div class="form-group">
              <input type="password" id="login-pin" class="pin-input" maxlength="6" placeholder="••••" autofocus>
            </div>
            <div id="login-error" style="color:#C82333;margin-bottom:12px;display:none;font-size:0.9rem;">${I18n.t('panel_login_error')}</div>
            <button type="submit" class="btn btn-primary btn-block">${I18n.t('panel_login_btn')}</button>
          </form>
          <p style="margin-top:24px;"><a href="./index.html" style="font-size:0.85rem;color:#999;">← Website</a></p>
        </div>
      </div>
    `;
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const pin = document.getElementById('login-pin').value;
      const expected = this.config.panel?.pin || '1234';
      if (pin === expected) {
        sessionStorage.setItem('zzp_panel_auth', 'yes');
        this.renderPanel();
      } else {
        document.getElementById('login-error').style.display = 'block';
        document.getElementById('login-pin').value = '';
      }
    });
  },

  renderPanel() {
    document.body.className = 'panel-body';
    document.body.innerHTML = `
      <div class="panel-shell">
        <aside class="panel-sidebar">
          <div class="logo">
            <img src="./assets/logo.png" alt="" onerror="this.style.display='none'">
            <span>${this.logoMarkup()}</span>
          </div>
          <ul class="panel-nav">
            <li><button data-tab="offerte" class="active"><i data-lucide="file-text"></i> ${I18n.t('panel_offertes')}</button></li>
            <li><button data-tab="factuur"><i data-lucide="receipt"></i> ${I18n.t('panel_facturen')}</button></li>
            <li><button data-tab="logout"><i data-lucide="log-out"></i> ${I18n.t('panel_logout')}</button></li>
          </ul>
        </aside>
        <main class="panel-main" id="panel-main"></main>
      </div>
    `;

    document.querySelectorAll('.panel-nav button').forEach(btn => {
      btn.addEventListener('click', () => this.handleNav(btn));
    });

    this.renderList();
    this.refreshIcons();
  },

  handleNav(btn) {
    const tab = btn.dataset.tab;
    if (tab === 'logout') {
      sessionStorage.removeItem('zzp_panel_auth');
      this.renderLogin();
      return;
    }
    document.querySelectorAll('.panel-nav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.listType = tab;
    this.view = 'list';
    this.renderList();
  },

  renderList() {
    const data = Storage.load();
    const items = this.listType === 'factuur' ? data.facturen : data.offertes;
    const main = document.getElementById('panel-main');

    main.innerHTML = `
      <div id="promo-slot"></div>
      <div class="panel-header">
        <h1>${this.listType === 'factuur' ? I18n.t('panel_facturen') : I18n.t('panel_offertes')}</h1>
        <button class="btn btn-primary" id="btn-new">
          <i data-lucide="plus"></i>
          ${this.listType === 'factuur' ? I18n.t('panel_new_factuur') : I18n.t('panel_new_offerte')}
        </button>
      </div>
      ${items.length === 0
        ? `<div class="empty-state"><i data-lucide="inbox" style="width:48px;height:48px;opacity:0.3;margin-bottom:12px;"></i><p>${this.listType === 'factuur' ? I18n.t('panel_empty_facturen') : I18n.t('panel_empty_offertes')}</p></div>`
        : `<div class="panel-cards">${items.slice().reverse().map(doc => this.docCard(doc)).join('')}</div>`
      }
    `;

    document.getElementById('btn-new').addEventListener('click', () => this.openBuilder(null));
    main.querySelectorAll('[data-open-id]').forEach(el => {
      el.addEventListener('click', () => this.openBuilder(el.dataset.openId));
    });
    this.refreshIcons();

    // Promotions are best-effort; fail silently if hub is unreachable
    this.loadPromotions().catch(() => {});
  },

  // -- Promotions (broadcast to all panels via Supabase public storage)
  async loadPromotions() {
    const promoHub = this.config.promotions || {
      url: 'https://dkihhmphimfqhyuzajwc.supabase.co/storage/v1/object/public/gek-x-hub/promotions/active.json',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRraWhobXBoaW1mcWh5dXphandjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzI0NzQsImV4cCI6MjA4NzEwODQ3NH0.ky8a6mcPzlRKZyit6JbuyCJ2ZA7KnH6h2mmzpzNmjsw',
      leadsTable: 'zzp_promo_leads',
      restBase: 'https://dkihhmphimfqhyuzajwc.supabase.co/rest/v1'
    };
    this.promoHub = promoHub;

    const res = await fetch(promoHub.url, { headers: { apikey: promoHub.anonKey } });
    if (!res.ok) return;
    const data = await res.json();
    const promos = (data.promotions || []).filter(p => this.isPromoVisible(p));
    if (promos.length) this.renderPromos(promos);
  },

  isPromoVisible(promo) {
    if (!promo.active) return false;
    const now = Date.now();
    if (promo.start && now < new Date(promo.start).getTime()) return false;
    if (promo.end && now > new Date(promo.end).getTime() + 24 * 3600 * 1000) return false;
    if (localStorage.getItem(`promo_dismissed_${promo.id}`)) return false;
    return true;
  },

  renderPromos(promos) {
    const slot = document.getElementById('promo-slot');
    if (!slot) return;
    const lang = this.config.languages.ownerLanguage || I18n.currentLang;

    slot.innerHTML = promos.map(p => {
      if (localStorage.getItem(`promo_interested_${p.id}`)) {
        return `<div class="promo-banner"><div class="promo-confirmation">${I18n.t('promo_interested_sent')}</div></div>`;
      }
      const title = I18n.get(p.title, lang);
      const desc = I18n.get(p.description, lang);
      const ctaInterested = I18n.get(p.cta_interested, lang) || I18n.t('promo_interested') || 'Interested';
      const ctaDismiss = I18n.get(p.cta_dismiss, lang) || 'Dismiss';
      const priceBlock = (p.originalPrice && p.promoPrice) ? `
        <div class="promo-price">
          <span class="price-old">€${p.originalPrice}</span>
          <span class="price-new">€${p.promoPrice}</span>
          <span class="price-save">-€${Math.max(0, p.originalPrice - p.promoPrice)}</span>
        </div>
      ` : '';
      return `
        <div class="promo-banner" data-promo-id="${p.id}">
          <div class="promo-content">
            <h3>${Offerte.escapeHtml(title)}</h3>
            <p>${Offerte.escapeHtml(desc)}</p>
            ${priceBlock}
          </div>
          <div class="promo-actions">
            <button class="btn btn-primary" data-promo-action="interested" data-promo-id="${p.id}">${Offerte.escapeHtml(ctaInterested)}</button>
            <button class="btn btn-secondary btn-sm" data-promo-action="dismiss" data-promo-id="${p.id}">${Offerte.escapeHtml(ctaDismiss)}</button>
          </div>
        </div>
      `;
    }).join('');

    slot.querySelectorAll('[data-promo-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.promoId;
        const action = btn.dataset.promoAction;
        if (action === 'interested') this.handlePromoInterest(id);
        else this.handlePromoDismiss(id);
      });
    });
  },

  async handlePromoInterest(promoId) {
    localStorage.setItem(`promo_interested_${promoId}`, new Date().toISOString());
    try {
      const c = this.config.company;
      const payload = {
        promo_id: promoId,
        company_name: c.name,
        owner_name: c.owner,
        email: c.email,
        phone: c.phone,
        kvk: c.kvk,
        language: this.config.languages.ownerLanguage || 'nl',
        source_url: window.location.origin + window.location.pathname,
        status: 'new'
      };
      await fetch(`${this.promoHub.restBase}/${this.promoHub.leadsTable}`, {
        method: 'POST',
        headers: {
          apikey: this.promoHub.anonKey,
          Authorization: 'Bearer ' + this.promoHub.anonKey,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Promo lead post failed (lead saved locally):', e);
    }
    // Re-render to show confirmation
    const slot = document.getElementById('promo-slot');
    if (slot) slot.innerHTML = `<div class="promo-banner"><div class="promo-confirmation">${I18n.t('promo_interested_sent')}</div></div>`;
  },

  handlePromoDismiss(promoId) {
    localStorage.setItem(`promo_dismissed_${promoId}`, new Date().toISOString());
    const el = document.querySelector(`[data-promo-id="${promoId}"]`);
    if (el && el.classList.contains('promo-banner')) el.remove();
  },

  docCard(doc) {
    const totals = Offerte.totals(doc);
    const phaseBadge = doc.invoicePhase ? `<span class="phase-badge">${I18n.t('phase_' + doc.invoicePhase)}</span>` : '';
    const extras = [];
    if (doc.type === 'offerte') {
      if (doc.beginsituatie?.photos?.length) extras.push(`📷 ${doc.beginsituatie.photos.length}`);
      if (doc.oplevering) extras.push(`📋 ${doc.oplevering.status || 'concept'}`);
    }
    const extrasHtml = extras.length ? `<div style="margin-top:6px;font-size:0.8rem;color:var(--text-muted);">${extras.join(' · ')}</div>` : '';
    return `
      <div class="doc-card" data-open-id="${doc.id}">
        <div class="doc-card-header">
          <div>
            <div class="doc-card-id">${doc.id} ${phaseBadge}</div>
            <div class="doc-card-date">${I18n.formatDate(doc.date)}</div>
          </div>
          <span class="status-badge status-${doc.status}">${I18n.t('status_' + doc.status) || doc.status}</span>
        </div>
        <div>${Offerte.escapeHtml(doc.client?.name || '—')}</div>
        <div class="doc-card-total">${I18n.formatPrice(totals.total)}</div>
        ${extrasHtml}
      </div>
    `;
  },

  openBuilder(id) {
    this.view = 'builder';
    if (id) {
      // Could be either an offerte or a factuur — try the current listType first
      let found = Storage.getById(id, this.listType);
      if (!found) {
        const other = this.listType === 'offerte' ? 'factuur' : 'offerte';
        found = Storage.getById(id, other);
        if (found) this.listType = other;
      }
      this.currentDoc = JSON.parse(JSON.stringify(found));
    } else {
      this.currentDoc = Offerte.createEmpty(this.listType);
    }
    this.renderBuilder();
  },

  renderBuilder() {
    const doc = this.currentDoc;
    const main = document.getElementById('panel-main');
    const langs = this.config.languages.available;
    const isOfferte = doc.type === 'offerte';
    const phaseBadge = doc.invoicePhase ? `<span class="phase-badge" style="margin-left:8px;">${I18n.t('phase_' + doc.invoicePhase)}</span>` : '';
    const isAccepted = isOfferte && (doc.status === 'accepted' || doc.dupochron?.decision === 'accepted');

    main.innerHTML = `
      <div class="panel-header">
        <div>
          <button class="btn btn-secondary btn-sm" id="btn-back"><i data-lucide="arrow-left"></i> ${I18n.t('builder_back')}</button>
          <h1 style="margin-top:8px;">${doc.id} ${phaseBadge}</h1>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <select id="status-select" style="padding:8px 12px;border:1px solid var(--border);border-radius:6px;background:#FFF;">
            ${this.statusOptions(doc.type).map(s =>
              `<option value="${s}" ${doc.status === s ? 'selected' : ''}>${I18n.t('status_' + s)}</option>`
            ).join('')}
          </select>
          ${isOfferte && !isAccepted ? `<button class="btn btn-warning btn-sm" id="btn-split"><i data-lucide="split"></i> ${I18n.t('builder_split')}</button>` : ''}
          <button class="btn btn-secondary btn-sm" id="btn-delete" style="color:#C82333;border-color:#C82333;"><i data-lucide="trash-2"></i></button>
        </div>
      </div>

      ${isAccepted ? this.renderLifecycleCard(doc) : ''}
      ${isAccepted ? this.renderTimelineCard(doc) : ''}
      ${isAccepted && this.canGenerateSocial(doc) ? this.renderSocialCard(doc) : ''}

      <div class="builder-card">
        <h2>${I18n.t('builder_client')}</h2>
        <div class="form-row">
          <div class="form-group">
            <label>${I18n.t('builder_client_name')}</label>
            <input type="text" id="client-name" value="${Offerte.escapeHtml(doc.client?.name || '')}">
          </div>
          <div class="form-group">
            <label>${I18n.t('builder_client_email')}</label>
            <input type="email" id="client-email" value="${Offerte.escapeHtml(doc.client?.email || '')}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>${I18n.t('builder_client_address')}</label>
            <textarea id="client-address" rows="3">${Offerte.escapeHtml(doc.client?.address || '')}</textarea>
          </div>
          <div class="form-group">
            <label>${I18n.t('builder_client_lang')}</label>
            <select id="client-lang">
              ${langs.map(l => `<option value="${l}" ${(doc.client?.language || 'nl') === l ? 'selected' : ''}>${FLAGS[l]} ${l === 'nl' ? 'Nederlands' : l === 'pl' ? 'Polski' : 'English'}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="builder-card">
        <h2>${I18n.t('builder_items')}</h2>
        <table class="items-table" id="items-table">
          <thead>
            <tr>
              <th style="width:45%;">${I18n.t('offerte_description')}</th>
              <th style="width:90px;">${I18n.t('offerte_quantity')}</th>
              <th style="width:110px;">${I18n.t('offerte_unit')}</th>
              <th style="width:110px;">${I18n.t('offerte_price')} (€)</th>
              <th class="col-total">${I18n.t('offerte_total')}</th>
              <th class="col-action"></th>
            </tr>
          </thead>
          <tbody id="items-body"></tbody>
        </table>
        <div class="add-row-bar">
          <button class="btn btn-secondary btn-sm" id="add-service-btn"><i data-lucide="plus"></i> ${I18n.t('builder_add_service')}</button>
          <button class="btn btn-secondary btn-sm" id="add-material-btn"><i data-lucide="plus"></i> ${I18n.t('builder_add_material')}</button>
          <button class="btn btn-secondary btn-sm" id="add-custom-btn"><i data-lucide="plus"></i> ${I18n.t('builder_add_custom')}</button>
        </div>
        <div class="totals-box" id="totals-box"></div>
        ${isOfferte && !isAccepted ? `<div class="split-preview" id="split-preview"></div>` : ''}
      </div>

      <div class="builder-card">
        <h2>${I18n.t('builder_details')}</h2>
        <div class="form-row">
          <div class="form-group">
            <label>${I18n.t('builder_valid_days')}</label>
            <input type="number" id="valid-days" value="${doc.validDays}" min="1">
          </div>
          <div class="form-group">
            <label>${I18n.t('builder_payment_days')}</label>
            <input type="number" id="payment-days" value="${doc.paymentDays}" min="0">
          </div>
        </div>
        <div class="form-group">
          <label>${I18n.t('builder_notes')}</label>
          <textarea id="notes" rows="3">${Offerte.escapeHtml(doc.notes || '')}</textarea>
        </div>
      </div>

      ${isOfferte ? this.renderDupochronInfo(doc) : ''}

      <div class="builder-actions">
        <button class="btn btn-secondary" id="btn-preview"><i data-lucide="eye"></i> ${I18n.t('builder_preview')}</button>
        <button class="btn btn-secondary" id="btn-email"><i data-lucide="mail"></i> ${isOfferte ? I18n.t('email_send_offerte') : I18n.t('email_send_factuur')}</button>
        <button class="btn btn-primary" id="btn-save"><i data-lucide="save"></i> ${I18n.t('builder_save')}</button>
      </div>
    `;

    this.bindBuilder();
    this.renderItems();
    this.updateTotals();
    this.refreshIcons();
  },

  renderLifecycleCard(doc) {
    const hasBegin = doc.beginsituatie?.photos?.length > 0;
    const hasOplevering = !!doc.oplevering;
    const beginBadge = hasBegin
      ? `<span class="lifecycle-badge has-data"><i data-lucide="check"></i> ${doc.beginsituatie.photos.length} ${I18n.t('beginsituatie_photos')}</span>`
      : '';
    const opleveringBadge = hasOplevering
      ? `<span class="lifecycle-badge has-data"><i data-lucide="check"></i> ${doc.oplevering.status || 'concept'}</span>`
      : '';
    return `
      <div class="builder-card">
        <h2>${I18n.t('timeline_title')}: ${I18n.t('builder_items')}</h2>
        <div class="lifecycle-actions">
          <button class="btn btn-secondary" id="btn-beginsituatie">
            <i data-lucide="camera"></i> ${I18n.t('beginsituatie_btn')} ${beginBadge}
          </button>
          <button class="btn btn-secondary" id="btn-meerwerk">
            <i data-lucide="plus-circle"></i> ${I18n.t('meerwerk_btn')}
          </button>
          <button class="btn btn-primary" id="btn-oplevering">
            <i data-lucide="clipboard-check"></i> ${I18n.t('oplevering_btn')} ${opleveringBadge}
          </button>
        </div>
      </div>
    `;
  },

  canGenerateSocial(doc) {
    return !!window.SocialGenerator
      && (doc.beginsituatie?.photos?.length || 0) > 0
      && (doc.oplevering?.photos?.length || 0) > 0;
  },

  renderSocialCard(doc) {
    const cached = this.socialCache?.[doc.id];
    const generatedAt = doc.socialContent?.generated_at
      ? new Date(doc.socialContent.generated_at).toLocaleString()
      : null;

    if (!cached) {
      return `
        <div class="builder-card" id="social-card">
          <h2><i data-lucide="share-2" style="display:inline-block;vertical-align:middle;"></i> ${I18n.t('social_title')}</h2>
          <p style="color:var(--text-muted);margin-bottom:16px;">${I18n.t('social_subtitle')}</p>
          ${generatedAt ? `<div class="social-meta">${I18n.t('social_generated_at')}: ${generatedAt}</div>` : ''}
          <button class="btn btn-primary" id="btn-generate-social">
            <i data-lucide="image-plus"></i>
            ${generatedAt ? I18n.t('social_regenerate') : I18n.t('social_generate')}
          </button>
        </div>
      `;
    }

    const formats = [
      { key: 'reel', label: I18n.t('social_reel') },
      { key: 'post', label: I18n.t('social_post') },
      { key: 'banner', label: I18n.t('social_banner') }
    ];

    return `
      <div class="builder-card" id="social-card">
        <h2><i data-lucide="share-2" style="display:inline-block;vertical-align:middle;"></i> ${I18n.t('social_title')}</h2>
        ${generatedAt ? `<div class="social-meta">${I18n.t('social_generated_at')}: ${generatedAt}</div>` : ''}
        <div class="social-preview">
          <div class="social-grid">
            ${formats.map(f => `
              <div class="social-item">
                <div class="social-item-thumb"><img src="${cached[f.key]}" alt="${f.label}"></div>
                <span class="social-item-label">${f.label}</span>
                <a download="${SocialGenerator.filename(f.key, doc)}" href="${cached[f.key]}" class="btn btn-primary btn-sm">
                  <i data-lucide="download"></i>
                  ${I18n.t('social_download')}
                </a>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="margin-top:16px;">
          <button class="btn btn-secondary btn-sm" id="btn-generate-social"><i data-lucide="refresh-cw"></i> ${I18n.t('social_regenerate')}</button>
        </div>
      </div>
    `;
  },

  renderTimelineCard(doc) {
    const events = this.buildTimeline(doc);
    return `
      <div class="builder-card">
        <h2><i data-lucide="git-commit-horizontal" style="display:inline-block;vertical-align:middle;"></i> ${I18n.t('timeline_title')}</h2>
        <div class="timeline">
          ${events.map(ev => `
            <div class="timeline-item ${ev.cls || ''}">
              <div class="timeline-label">${ev.label} ${ev.amount ? `<span class="timeline-amount">${ev.amount}</span>` : ''}</div>
              ${ev.meta ? `<div class="timeline-meta">${ev.meta}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  buildTimeline(doc) {
    const events = [];
    const fmt = (iso) => iso ? new Date(iso).toLocaleString() : '';

    events.push({
      label: I18n.t('timeline_created'),
      meta: I18n.formatDate(doc.date),
      cls: 'done'
    });

    if (doc.dupochron?.opened_at) {
      events.push({ label: I18n.t('timeline_opened'), meta: fmt(doc.dupochron.opened_at), cls: 'done' });
    }
    if (doc.dupochron?.decision === 'accepted') {
      events.push({ label: I18n.t('timeline_accepted'), meta: fmt(doc.dupochron.decision_at), cls: 'done' });
    } else if (doc.dupochron?.decision === 'discuss') {
      events.push({ label: I18n.t('timeline_discuss'), meta: fmt(doc.dupochron.decision_at), cls: 'warning' });
    } else if (doc.dupochron?.decision === 'rejected') {
      events.push({ label: I18n.t('timeline_rejected'), meta: fmt(doc.dupochron.decision_at), cls: 'danger' });
    }

    const linked = Offerte.linkedInvoices(doc.id);
    const voorschot = linked.find(f => f.invoicePhase === 'voorschot');
    const restant = linked.find(f => f.invoicePhase === 'restant');
    const meerwerken = linked.filter(f => f.invoicePhase === 'meerwerk');

    if (voorschot) {
      const total = I18n.formatPrice(Offerte.totals(voorschot).total);
      const cls = voorschot.status === 'paid' ? 'done' : voorschot.status === 'overdue' ? 'danger' : 'pending';
      events.push({
        label: `${I18n.t('timeline_voorschot')} ${voorschot.id}`,
        meta: I18n.t('status_' + voorschot.status),
        amount: total,
        cls
      });
    }

    if (doc.beginsituatie?.recorded_at) {
      events.push({
        label: I18n.t('timeline_beginsituatie'),
        meta: `${fmt(doc.beginsituatie.recorded_at)} · ${doc.beginsituatie.photos.length} ${I18n.t('beginsituatie_photos')}`,
        cls: 'done'
      });
    }

    meerwerken.forEach(mw => {
      const cls = mw.status === 'paid' ? 'done' : mw.status === 'overdue' ? 'danger' : 'pending';
      events.push({
        label: `${I18n.t('timeline_meerwerk')} ${mw.id}`,
        meta: I18n.t('status_' + mw.status),
        amount: I18n.formatPrice(Offerte.totals(mw).total),
        cls
      });
    });

    if (doc.oplevering?.sent_at) {
      events.push({ label: I18n.t('timeline_oplevering_sent'), meta: fmt(doc.oplevering.sent_at), cls: 'done' });
    }
    if (doc.oplevering?.decision === 'approved') {
      events.push({ label: I18n.t('timeline_oplevering_approved'), meta: fmt(doc.oplevering.decision_at), cls: 'done' });
    } else if (doc.oplevering?.decision === 'remarks') {
      events.push({ label: I18n.t('timeline_oplevering_remarks'), meta: `${fmt(doc.oplevering.decision_at)}${doc.oplevering.decision_note ? ' · "' + Offerte.escapeHtml(doc.oplevering.decision_note) + '"' : ''}`, cls: 'warning' });
    } else if (doc.oplevering?.decision === 'rejected') {
      events.push({ label: I18n.t('timeline_oplevering_rejected'), meta: fmt(doc.oplevering.decision_at), cls: 'danger' });
    }

    if (restant) {
      const cls = restant.status === 'paid' ? 'done' : restant.status === 'overdue' ? 'danger' : restant.status === 'open' ? 'warning' : 'pending';
      events.push({
        label: `${I18n.t('timeline_eindfactuur')} ${restant.id}`,
        meta: I18n.t('status_' + restant.status),
        amount: I18n.formatPrice(Offerte.totals(restant).total),
        cls
      });
    }

    if (doc.socialContent?.generated_at) {
      events.push({
        label: I18n.t('timeline_social'),
        meta: fmt(doc.socialContent.generated_at),
        cls: 'done'
      });
    }

    return events;
  },

  renderDupochronInfo(doc) {
    const link = `${window.location.origin}${window.location.pathname.replace('panel.html', 'offerte-view.html')}?id=${encodeURIComponent(doc.id)}&type=offerte`;
    let dupochronDetails = '';
    if (doc.dupochron) {
      const d = doc.dupochron;
      dupochronDetails = `
        <div style="margin-top:16px;font-size:0.85rem;background:var(--card-bg);padding:12px;border-radius:6px;">
          ${d.opened_at ? `<div>📂 ${I18n.t('timeline_opened')}: ${new Date(d.opened_at).toLocaleString()}</div>` : ''}
          ${d.checkbox_at ? `<div>☑ ${I18n.t('dupochron_checkbox').slice(0, 30)}...: ${new Date(d.checkbox_at).toLocaleString()}</div>` : ''}
          ${d.decision_at ? `<div>✓ ${d.decision}: ${new Date(d.decision_at).toLocaleString()}</div>` : ''}
          ${d.decision_note ? `<div style="margin-top:8px;"><em>"${Offerte.escapeHtml(d.decision_note)}"</em></div>` : ''}
        </div>
      `;
    }
    return `
      <div class="builder-card">
        <h2><i data-lucide="link-2" style="display:inline-block;vertical-align:middle;"></i> ${I18n.t('builder_dupochron_link')}</h2>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <input type="text" id="dupochron-link" value="${link}" readonly style="flex:1;min-width:200px;padding:10px;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;">
          <button class="btn btn-secondary btn-sm" id="btn-copy-link"><i data-lucide="copy"></i> ${I18n.t('builder_copy_link')}</button>
        </div>
        ${dupochronDetails}
      </div>
    `;
  },

  statusOptions(type) {
    if (type === 'factuur') return ['concept', 'voorschot', 'sent', 'open', 'paid', 'overdue'];
    return ['concept', 'sent', 'accepted', 'discuss', 'rejected'];
  },

  bindBuilder() {
    document.getElementById('btn-back').addEventListener('click', () => {
      this.view = 'list';
      this.renderList();
    });

    document.getElementById('btn-delete').addEventListener('click', () => {
      if (!confirm(I18n.t('builder_confirm_delete'))) return;
      Storage.remove(this.currentDoc.id, this.currentDoc.type);
      this.view = 'list';
      this.renderList();
    });

    document.getElementById('btn-save').addEventListener('click', () => {
      this.syncFromForm();
      Storage.upsert(this.currentDoc, this.currentDoc.type);
      this.flashMessage('✓ ' + I18n.t('builder_save'));
    });

    document.getElementById('btn-preview').addEventListener('click', () => {
      this.syncFromForm();
      Storage.upsert(this.currentDoc, this.currentDoc.type);
      const url = `./offerte-view.html?id=${encodeURIComponent(this.currentDoc.id)}&type=${this.currentDoc.type}`;
      window.open(url, '_blank');
    });

    const splitBtn = document.getElementById('btn-split');
    if (splitBtn) {
      splitBtn.addEventListener('click', () => this.handleSplit());
    }

    document.getElementById('add-service-btn').addEventListener('click', () => this.addRow('service'));
    document.getElementById('add-material-btn').addEventListener('click', () => this.addRow('material'));
    document.getElementById('add-custom-btn').addEventListener('click', () => this.addRow('custom'));

    document.getElementById('status-select').addEventListener('change', (e) => {
      this.currentDoc.status = e.target.value;
    });

    const copyBtn = document.getElementById('btn-copy-link');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.handleCopyLink(copyBtn));
    }

    // Lifecycle actions (only on accepted offertes)
    const beginBtn = document.getElementById('btn-beginsituatie');
    if (beginBtn) beginBtn.addEventListener('click', () => this.openBeginsituatie(this.currentDoc.id));
    const meerwerkBtn = document.getElementById('btn-meerwerk');
    if (meerwerkBtn) meerwerkBtn.addEventListener('click', () => this.handleMeerwerk());
    const opleveringBtn = document.getElementById('btn-oplevering');
    if (opleveringBtn) opleveringBtn.addEventListener('click', () => this.openOplevering(this.currentDoc.id));

    const socialBtn = document.getElementById('btn-generate-social');
    if (socialBtn) socialBtn.addEventListener('click', () => this.handleGenerateSocial(socialBtn));

    const emailBtn = document.getElementById('btn-email');
    if (emailBtn) emailBtn.addEventListener('click', () => this.handleEmailSend());
  },

  async handleEmailSend() {
    this.syncFromForm();
    Storage.upsert(this.currentDoc, this.currentDoc.type);
    if (!this.currentDoc.client?.email) {
      alert(I18n.t('email_no_address'));
      return;
    }
    const fn = this.currentDoc.type === 'factuur' ? 'sendFactuur' : 'sendOfferte';
    const result = await EmailSender[fn](this.currentDoc.id);
    if (result.success) {
      this.flashMessage('✓ ' + I18n.t('email_opened'));
      // Refresh from storage (status may have changed)
      this.currentDoc = Storage.getById(this.currentDoc.id, this.currentDoc.type);
      this.renderBuilder();
    } else {
      alert(result.error || 'Failed');
    }
  },

  async handleGenerateSocial(btn) {
    btn.disabled = true;
    const originalHtml = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="loader-2"></i> ${I18n.t('social_generating')}`;
    this.refreshIcons();
    try {
      const result = await SocialGenerator.generateAll(this.currentDoc.id);
      if (!result) {
        alert('Voor/na foto\'s ontbreken.');
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        this.refreshIcons();
        return;
      }
      this.socialCache = this.socialCache || {};
      this.socialCache[this.currentDoc.id] = result;
      this.currentDoc.socialContent = { generated_at: new Date().toISOString() };
      Storage.upsert(this.currentDoc, 'offerte');
      this.renderBuilder();
    } catch (e) {
      console.error(e);
      alert('Kon social content niet genereren: ' + (e.message || e));
      btn.disabled = false;
      btn.innerHTML = originalHtml;
      this.refreshIcons();
    }
  },

  handleSplit() {
    this.syncFromForm();
    if ((this.currentDoc.items || []).length === 0) {
      alert('Voeg eerst regels toe.');
      return;
    }
    Storage.upsert(this.currentDoc, this.currentDoc.type);
    const { voorschot, restant } = Offerte.splitInvoice(this.currentDoc);
    Storage.upsert(voorschot, 'factuur');
    Storage.upsert(restant, 'factuur');
    this.currentDoc.generatedInvoices = [voorschot.id, restant.id];
    this.currentDoc.status = 'accepted';
    Storage.upsert(this.currentDoc, 'offerte');
    alert(`${I18n.t('builder_split_done')}\n\n${voorschot.id}: ${I18n.formatPrice(Offerte.totals(voorschot).total)}\n${restant.id}: ${I18n.formatPrice(Offerte.totals(restant).total)}`);
    this.renderBuilder();
  },

  handleMeerwerk() {
    this.syncFromForm();
    Storage.upsert(this.currentDoc, 'offerte');
    const mw = Offerte.createMeerwerk(this.currentDoc.id);
    Storage.upsert(mw, 'factuur');
    this.flashMessage('✓ ' + I18n.t('meerwerk_generated'));
    this.listType = 'factuur';
    this.currentDoc = mw;
    this.renderBuilder();
  },

  handleCopyLink(copyBtn) {
    const linkInput = document.getElementById('dupochron-link');
    linkInput.select();
    document.execCommand('copy');
    copyBtn.innerHTML = `✓ ${I18n.t('builder_link_copied')}`;
    setTimeout(() => {
      copyBtn.innerHTML = `<i data-lucide="copy"></i> ${I18n.t('builder_copy_link')}`;
      this.refreshIcons();
    }, 2000);
  },

  flashMessage(msg) {
    const f = document.createElement('div');
    f.textContent = msg;
    f.style.cssText = 'position:fixed;top:20px;right:20px;background:var(--success);color:#FFF;padding:12px 20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;font-weight:600;';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 2000);
  },

  syncFromForm() {
    const doc = this.currentDoc;
    doc.client = doc.client || {};
    doc.client.name = document.getElementById('client-name').value;
    doc.client.email = document.getElementById('client-email').value;
    doc.client.address = document.getElementById('client-address').value;
    doc.client.language = document.getElementById('client-lang').value;
    doc.validDays = parseInt(document.getElementById('valid-days').value, 10) || 30;
    doc.paymentDays = parseInt(document.getElementById('payment-days').value, 10) || 0;
    doc.notes = document.getElementById('notes').value;
    doc.status = document.getElementById('status-select').value;
  },

  addRow(refType) {
    const item = { refType, refId: '', quantity: 1, price: 0, description: '', unit: '' };
    if (refType === 'service') {
      const first = this.config.services[0];
      if (first) { item.refId = first.id; item.price = first.defaultRate; }
    } else if (refType === 'material') {
      const first = this.config.materials[0];
      if (first) { item.refId = first.id; item.price = first.defaultPrice; }
    } else {
      item.category = 'arbeid';
    }
    this.currentDoc.items.push(item);
    this.renderItems();
    this.updateTotals();
  },

  renderItems() {
    const body = document.getElementById('items-body');
    if (!body) return;
    const ownerLang = I18n.currentLang;
    const items = this.currentDoc.items || [];

    if (items.length === 0) {
      body.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#999;padding:24px;">—</td></tr>`;
      return;
    }

    body.innerHTML = items.map((item, idx) => {
      const cat = Offerte.getCategory(item);
      const catBadge = `<span class="cat-${cat}">${cat}</span>`;

      let descCell = '';
      if (item.refType === 'service') {
        descCell = `
          <select data-idx="${idx}" data-field="refId">
            ${this.config.services.map(s => `<option value="${s.id}" ${s.id === item.refId ? 'selected' : ''}>${I18n.get(s.name, ownerLang)}</option>`).join('')}
          </select>
          ${catBadge}
        `;
      } else if (item.refType === 'material') {
        descCell = `
          <select data-idx="${idx}" data-field="refId">
            ${this.config.materials.map(m => `<option value="${m.id}" ${m.id === item.refId ? 'selected' : ''}>${I18n.get(m.name, ownerLang)}</option>`).join('')}
          </select>
          ${catBadge}
        `;
      } else {
        descCell = `
          <input type="text" data-idx="${idx}" data-field="description" value="${Offerte.escapeHtml(item.description || '')}" placeholder="${I18n.t('offerte_description')}">
          <select data-idx="${idx}" data-field="category" style="margin-top:4px;font-size:0.8rem;width:auto;">
            <option value="arbeid" ${cat === 'arbeid' ? 'selected' : ''}>arbeid</option>
            <option value="materiaal" ${cat === 'materiaal' ? 'selected' : ''}>materiaal</option>
          </select>
        `;
      }

      const unitCell = (item.refType === 'custom' || !item.refType)
        ? `<input type="text" data-idx="${idx}" data-field="unit" value="${Offerte.escapeHtml(item.unit || '')}">`
        : `<span style="color:#666;font-size:0.85rem;">${Offerte.escapeHtml(Offerte.resolveUnit(item, ownerLang))}</span>`;

      const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);

      return `
        <tr>
          <td>${descCell}</td>
          <td><input type="number" step="0.01" data-idx="${idx}" data-field="quantity" value="${item.quantity}"></td>
          <td>${unitCell}</td>
          <td><input type="number" step="0.01" data-idx="${idx}" data-field="price" value="${item.price}"></td>
          <td class="col-total">${I18n.formatPrice(lineTotal)}</td>
          <td class="col-action">
            <button class="btn-icon" data-remove="${idx}" aria-label="Remove">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    body.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', (e) => this.handleItemChange(e));
      el.addEventListener('change', (e) => this.handleItemChange(e));
    });
    body.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.remove, 10);
        this.currentDoc.items.splice(idx, 1);
        this.renderItems();
        this.updateTotals();
      });
    });
  },

  handleItemChange(e) {
    const idx = parseInt(e.target.dataset.idx, 10);
    const field = e.target.dataset.field;
    const item = this.currentDoc.items[idx];
    if (!item) return;
    item[field] = e.target.value;

    if (field === 'refId') {
      if (item.refType === 'service') {
        const s = this.config.services.find(x => x.id === item.refId);
        if (s) item.price = s.defaultRate;
      } else if (item.refType === 'material') {
        const m = this.config.materials.find(x => x.id === item.refId);
        if (m) item.price = m.defaultPrice;
      }
      this.renderItems();
    } else if (field === 'category') {
      this.renderItems();
    } else {
      const row = e.target.closest('tr');
      if (row && (field === 'quantity' || field === 'price')) {
        const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
        row.querySelector('.col-total').textContent = I18n.formatPrice(lineTotal);
      }
    }
    this.updateTotals();
  },

  updateTotals() {
    const totals = Offerte.totals(this.currentDoc);
    const btw = this.currentDoc.btwPercentage || 21;
    const box = document.getElementById('totals-box');
    if (box) {
      box.innerHTML = `
        <div class="totals-row"><span>${I18n.t('offerte_subtotal')}</span><span>${I18n.formatPrice(totals.subtotal)}</span></div>
        <div class="totals-row"><span>${I18n.t('offerte_btw')} ${btw}%</span><span>${I18n.formatPrice(totals.btw)}</span></div>
        <div class="totals-row total"><span>${I18n.t('offerte_total')}</span><span>${I18n.formatPrice(totals.total)}</span></div>
      `;
    }

    const splitBox = document.getElementById('split-preview');
    if (splitBox && this.currentDoc.type === 'offerte') {
      const preview = Offerte.splitPreview(this.currentDoc);
      const arbeidPct = this.config.legal?.voorschot_arbeid_percentage || 20;
      splitBox.innerHTML = `
        <strong><i data-lucide="split" style="display:inline-block;vertical-align:middle;width:16px;height:16px;"></i> ${I18n.t('builder_split_preview')}</strong>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px;">
          <div><strong>${I18n.t('phase_voorschot')}:</strong> ${I18n.formatPrice(preview.voorschot.total)}<br><small>100% materiaal + ${arbeidPct}% arbeid</small></div>
          <div><strong>${I18n.t('phase_restant')}:</strong> ${I18n.formatPrice(preview.restant.total)}<br><small>${100 - arbeidPct}% arbeid</small></div>
        </div>
      `;
      this.refreshIcons();
    }
  },

  // =============================
  // BEGINSITUATIE — photo capture before work starts
  // =============================

  openBeginsituatie(offerteId) {
    const doc = Storage.getById(offerteId, 'offerte');
    if (!doc.beginsituatie) {
      doc.beginsituatie = {
        date: new Date().toISOString().slice(0, 10),
        photos: [],
        notes: '',
        recorded_at: null
      };
      Storage.upsert(doc, 'offerte');
    }
    this.currentDoc = doc;
    this.view = 'beginsituatie';
    this.renderBeginsituatie();
  },

  renderBeginsituatie() {
    const doc = this.currentDoc;
    const bs = doc.beginsituatie || { photos: [], notes: '' };
    const main = document.getElementById('panel-main');

    main.innerHTML = `
      <div class="panel-header">
        <div>
          <button class="btn btn-secondary btn-sm" id="btn-back-builder"><i data-lucide="arrow-left"></i> ${doc.id}</button>
          <h1 style="margin-top:8px;">${I18n.t('beginsituatie_title')}</h1>
          <p style="color:var(--text-muted);margin-top:4px;">${I18n.t('beginsituatie_subtitle')}</p>
        </div>
        <div>
          ${bs.recorded_at ? `<span class="status-badge status-paid">${I18n.t('beginsituatie_saved')}</span>` : ''}
        </div>
      </div>

      <div class="builder-card">
        <h2><i data-lucide="camera" style="display:inline-block;vertical-align:middle;"></i> ${I18n.t('beginsituatie_add')}</h2>
        <label class="dropzone dropzone-large" id="bs-dropzone">
          <i data-lucide="camera" style="width:40px;height:40px;"></i>
          <p>${I18n.t('beginsituatie_drop_hint')}</p>
          <input type="file" id="bs-input" accept="image/*" capture="environment" multiple>
        </label>
        <div class="photo-grid" id="bs-photos"></div>

        <div class="form-group" style="margin-top:24px;">
          <label>${I18n.t('beginsituatie_general_notes')}</label>
          <textarea id="bs-notes" rows="3">${Offerte.escapeHtml(bs.notes || '')}</textarea>
        </div>
      </div>

      <div class="builder-actions">
        <button class="btn btn-primary" id="bs-save"><i data-lucide="save"></i> ${I18n.t('builder_save')}</button>
      </div>
    `;

    this.bindBeginsituatie();
    this.renderBsPhotos();
    this.refreshIcons();
  },

  bindBeginsituatie() {
    document.getElementById('btn-back-builder').addEventListener('click', () => {
      this.view = 'builder';
      this.renderBuilder();
    });

    const input = document.getElementById('bs-input');
    const dz = document.getElementById('bs-dropzone');
    input.addEventListener('change', (e) => this.handleBsFiles(e.target.files));
    dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', (e) => {
      e.preventDefault();
      dz.classList.remove('dragover');
      this.handleBsFiles(e.dataTransfer.files);
    });

    document.getElementById('bs-save').addEventListener('click', () => {
      this.currentDoc.beginsituatie.notes = document.getElementById('bs-notes').value;
      this.currentDoc.beginsituatie.recorded_at = this.currentDoc.beginsituatie.recorded_at || new Date().toISOString();
      Storage.upsert(this.currentDoc, 'offerte');
      this.flashMessage('✓ ' + I18n.t('beginsituatie_saved'));
      this.renderBeginsituatie();
    });
  },

  async handleBsFiles(fileList) {
    for (const file of fileList) {
      if (!file.type.startsWith('image/')) continue;
      const dataUrl = await this.resizeImageToDataUrl(file);
      this.currentDoc.beginsituatie.photos.push({
        filename: file.name,
        dataUrl,
        description: '',
        added_at: new Date().toISOString()
      });
    }
    Storage.upsert(this.currentDoc, 'offerte');
    this.renderBsPhotos();
  },

  renderBsPhotos() {
    const container = document.getElementById('bs-photos');
    if (!container) return;
    const photos = this.currentDoc.beginsituatie?.photos || [];
    if (photos.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = photos.map((p, i) => `
      <div class="photo-card">
        <div class="photo-card-img">
          <img src="${p.dataUrl}" alt="">
          <button class="photo-remove" data-bs-remove="${i}" aria-label="Remove">×</button>
        </div>
        <div class="photo-card-body">
          <input type="text" data-bs-desc="${i}" value="${Offerte.escapeHtml(p.description || '')}" placeholder="${I18n.t('beginsituatie_photo_description')}">
          <div class="photo-card-time">${new Date(p.added_at).toLocaleString()}</div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-bs-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.bsRemove, 10);
        this.currentDoc.beginsituatie.photos.splice(i, 1);
        Storage.upsert(this.currentDoc, 'offerte');
        this.renderBsPhotos();
      });
    });
    container.querySelectorAll('[data-bs-desc]').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const i = parseInt(e.target.dataset.bsDesc, 10);
        this.currentDoc.beginsituatie.photos[i].description = e.target.value;
        Storage.upsert(this.currentDoc, 'offerte');
      });
    });
  },

  // =============================
  // OPLEVERING — photo upload + send to client
  // =============================

  openOplevering(offerteId) {
    Oplevering.ensure(offerteId);
    this.currentDoc = Storage.getById(offerteId, 'offerte');
    this.view = 'oplevering';
    this.renderOplevering();
  },

  renderOplevering() {
    const doc = this.currentDoc;
    const op = doc.oplevering;
    const main = document.getElementById('panel-main');

    const sentBadge = op.sent_at ? `<span class="status-badge status-sent">${I18n.t('timeline_oplevering_sent')}: ${new Date(op.sent_at).toLocaleDateString()}</span>` : '';
    const decisionBadge = op.decision ? `<span class="status-badge status-${op.decision}">${I18n.t('status_' + op.decision) || op.decision}</span>` : '';

    main.innerHTML = `
      <div class="panel-header">
        <div>
          <button class="btn btn-secondary btn-sm" id="btn-back-builder"><i data-lucide="arrow-left"></i> ${doc.id}</button>
          <h1 style="margin-top:8px;">${I18n.t('oplevering_title')} — ${op.id}</h1>
          <p style="color:var(--text-muted);margin-top:4px;">${I18n.t('oplevering_subtitle')}</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          ${sentBadge}
          ${decisionBadge}
        </div>
      </div>

      <div class="builder-card">
        <h2><i data-lucide="camera" style="display:inline-block;vertical-align:middle;"></i> ${I18n.t('oplevering_add_photo')}</h2>
        <label class="dropzone dropzone-large" id="op-dropzone">
          <i data-lucide="camera" style="width:40px;height:40px;"></i>
          <p>${I18n.t('beginsituatie_drop_hint')}</p>
          <input type="file" id="op-input" accept="image/*" capture="environment" multiple>
        </label>
        <div class="photo-grid" id="op-photos"></div>

        <div class="form-group" style="margin-top:24px;">
          <label>${I18n.t('oplevering_notes')}</label>
          <textarea id="op-notes" rows="3">${Offerte.escapeHtml(op.notes || '')}</textarea>
        </div>
      </div>

      ${op.decision_note ? `
        <div class="builder-card">
          <h2><i data-lucide="message-square" style="display:inline-block;vertical-align:middle;"></i> ${I18n.t('oplevering_notes')} (klant)</h2>
          <p style="white-space:pre-line;">${Offerte.escapeHtml(op.decision_note)}</p>
        </div>
      ` : ''}

      <div class="builder-actions">
        <button class="btn btn-secondary" id="op-save"><i data-lucide="save"></i> ${I18n.t('builder_save')}</button>
        <button class="btn btn-secondary" id="op-open-link"><i data-lucide="external-link"></i> ${I18n.t('oplevering_open_link')}</button>
        <button class="btn btn-primary" id="op-send"><i data-lucide="send"></i> ${I18n.t('oplevering_send')}</button>
      </div>
    `;

    this.bindOplevering();
    this.renderOpPhotos();
    this.refreshIcons();
  },

  bindOplevering() {
    document.getElementById('btn-back-builder').addEventListener('click', () => {
      this.view = 'builder';
      this.renderBuilder();
    });

    const input = document.getElementById('op-input');
    const dz = document.getElementById('op-dropzone');
    input.addEventListener('change', (e) => this.handleOpFiles(e.target.files));
    dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', (e) => {
      e.preventDefault();
      dz.classList.remove('dragover');
      this.handleOpFiles(e.dataTransfer.files);
    });

    document.getElementById('op-save').addEventListener('click', () => {
      Oplevering.updateNotes(this.currentDoc.id, document.getElementById('op-notes').value);
      this.flashMessage('✓ ' + I18n.t('builder_save'));
    });

    document.getElementById('op-open-link').addEventListener('click', () => {
      Oplevering.updateNotes(this.currentDoc.id, document.getElementById('op-notes').value);
      const url = `./oplevering-view.html?id=${encodeURIComponent(this.currentDoc.id)}`;
      window.open(url, '_blank');
    });

    document.getElementById('op-send').addEventListener('click', async () => {
      Oplevering.updateNotes(this.currentDoc.id, document.getElementById('op-notes').value);
      if (this.currentDoc.client?.email && window.EmailSender) {
        const result = await EmailSender.sendOplevering(this.currentDoc.id);
        if (!result.success) {
          alert(result.error || 'Failed');
          return;
        }
      } else {
        Oplevering.send(this.currentDoc.id);
        const url = `./oplevering-view.html?id=${encodeURIComponent(this.currentDoc.id)}`;
        window.open(url, '_blank');
      }
      this.currentDoc = Storage.getById(this.currentDoc.id, 'offerte');
      this.renderOplevering();
    });
  },

  async handleOpFiles(fileList) {
    for (const file of fileList) {
      if (!file.type.startsWith('image/')) continue;
      const dataUrl = await this.resizeImageToDataUrl(file);
      Oplevering.addPhoto(this.currentDoc.id, dataUrl, file.name, '');
    }
    this.currentDoc = Storage.getById(this.currentDoc.id, 'offerte');
    this.renderOpPhotos();
  },

  renderOpPhotos() {
    const container = document.getElementById('op-photos');
    if (!container) return;
    const photos = this.currentDoc.oplevering?.photos || [];
    if (photos.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = photos.map((p, i) => `
      <div class="photo-card">
        <div class="photo-card-img">
          <img src="${p.dataUrl}" alt="">
          <button class="photo-remove" data-op-remove="${i}" aria-label="Remove">×</button>
        </div>
        <div class="photo-card-body">
          <input type="text" data-op-desc="${i}" value="${Offerte.escapeHtml(p.description || '')}" placeholder="${I18n.t('beginsituatie_photo_description')}">
          <div class="photo-card-time">${new Date(p.added_at).toLocaleString()}</div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-op-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.opRemove, 10);
        Oplevering.removePhoto(this.currentDoc.id, i);
        this.currentDoc = Storage.getById(this.currentDoc.id, 'offerte');
        this.renderOpPhotos();
      });
    });
    container.querySelectorAll('[data-op-desc]').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const i = parseInt(e.target.dataset.opDesc, 10);
        Oplevering.updatePhotoDescription(this.currentDoc.id, i, e.target.value);
      });
    });
  },

  // Resize images client-side to keep localStorage usable (max dim from config)
  resizeImageToDataUrl(file) {
    return new Promise((resolve) => {
      const maxDim = this.config.legal?.photo_max_dimension_px || 1280;
      const img = new Image();
      const reader = new FileReader();
      reader.onload = () => {
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            const ratio = Math.min(maxDim / width, maxDim / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  },

  refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }
};

document.addEventListener('DOMContentLoaded', () => Panel.init());
window.Panel = Panel;
