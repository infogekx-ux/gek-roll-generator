// dupochron.js - Client acceptance page
// Renders terms in ALL 3 languages (tabs) + checkbox + 3 decision buttons
// Captures timestamp chain into offerte.dupochron
// On accept: auto-splits into 2 invoices via Offerte.markDecision()

const Dupochron = {
  config: null,
  doc: null,
  lang: 'nl',
  state: 'pending',

  init(doc, config) {
    this.doc = doc;
    this.config = config;
    this.lang = doc.client?.language || config.languages.default || 'nl';
    Offerte.markOpened(doc.id);
    if (doc.dupochron?.decision) this.state = doc.dupochron.decision;
  },

  render(rootEl) {
    if (this.state !== 'pending') {
      rootEl.innerHTML = this.renderResult(this.state);
      this.refreshIcons();
      return;
    }

    const t = (k) => I18n.tFor(this.lang, k);
    const terms = this.config.legal?.terms || {};
    const langs = this.config.languages.available || ['nl', 'pl', 'en'];

    const tabButtons = langs.map((l, i) => {
      const isDefault = (l === this.lang) || (i === 0 && !langs.includes(this.lang));
      const label = l === 'nl' ? 'Nederlands' : l === 'pl' ? 'Polski' : 'English';
      return `<button class="terms-tab ${isDefault ? 'active' : ''}" data-lang="${l}">${FLAGS[l]} ${label}</button>`;
    }).join('');

    const tabContents = langs.map((l, i) => {
      const isDefault = (l === this.lang) || (i === 0 && !langs.includes(this.lang));
      return `<div class="terms-content ${isDefault ? 'active' : ''}" data-terms-lang="${l}">${Offerte.escapeHtml(terms[l] || '')}</div>`;
    }).join('');

    rootEl.innerHTML = `
      <div class="dupochron">
        <div class="dupochron-card">
          <h2>${t('dupochron_heading')}</h2>
          <p class="subtitle">${t('dupochron_subtitle')}</p>

          <div class="terms-tabs">
            <div class="terms-tab-buttons">${tabButtons}</div>
            ${tabContents}
          </div>

          <label class="terms-checkbox">
            <input type="checkbox" id="dupochron-checkbox">
            <span>
              <label for="dupochron-checkbox" style="cursor:pointer;">${t('dupochron_checkbox')}</label>
              <div class="terms-hint">${t('dupochron_terms_hint')}</div>
            </span>
          </label>

          <div class="dupochron-actions">
            <button class="btn btn-success" id="dupochron-accept" disabled>
              <i data-lucide="check"></i>
              ${t('dupochron_accept')}
            </button>
            <button class="btn btn-warning" id="dupochron-discuss" disabled>
              <i data-lucide="message-circle"></i>
              ${t('dupochron_discuss')}
            </button>
            <button class="btn btn-danger" id="dupochron-reject" disabled>
              <i data-lucide="x"></i>
              ${t('dupochron_reject')}
            </button>
          </div>
        </div>
      </div>
    `;

    this.bind(rootEl);
    this.refreshIcons();
  },

  bind(rootEl) {
    // Terms tabs
    rootEl.querySelectorAll('.terms-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        rootEl.querySelectorAll('.terms-tab').forEach(b => b.classList.toggle('active', b === btn));
        rootEl.querySelectorAll('.terms-content').forEach(c => c.classList.toggle('active', c.dataset.termsLang === lang));
      });
    });

    const checkbox = rootEl.querySelector('#dupochron-checkbox');
    const acceptBtn = rootEl.querySelector('#dupochron-accept');
    const discussBtn = rootEl.querySelector('#dupochron-discuss');
    const rejectBtn = rootEl.querySelector('#dupochron-reject');
    if (!checkbox) return;

    checkbox.addEventListener('change', () => {
      const enabled = checkbox.checked;
      [acceptBtn, discussBtn, rejectBtn].forEach(b => { b.disabled = !enabled; });
      if (enabled) Offerte.markCheckbox(this.doc.id);
    });

    acceptBtn.addEventListener('click', () => this.handleDecision('accepted'));
    discussBtn.addEventListener('click', () => this.askNote('discuss'));
    rejectBtn.addEventListener('click', () => this.askNote('rejected'));
  },

  askNote(decision) {
    const t = (k) => I18n.tFor(this.lang, k);
    const rootEl = document.getElementById('dupochron-root');
    const promptKey = decision === 'discuss' ? 'dupochron_discuss_prompt' : 'dupochron_reject_prompt';

    rootEl.innerHTML = `
      <div class="dupochron">
        <div class="dupochron-card">
          <h2>${t('dupochron_heading')}</h2>
          <p class="subtitle">${t(promptKey)}</p>
          <div class="dupochron-note">
            <textarea id="dupochron-note-text" placeholder="${t(promptKey)}"></textarea>
          </div>
          <div class="dupochron-actions" style="grid-template-columns: 1fr 1fr; margin-top: 16px;">
            <button class="btn btn-secondary" id="dupochron-cancel">${t('builder_back')}</button>
            <button class="btn ${decision === 'discuss' ? 'btn-warning' : 'btn-danger'}" id="dupochron-confirm">
              ${t('dupochron_send_note')}
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('dupochron-cancel').addEventListener('click', () => this.render(rootEl));
    document.getElementById('dupochron-confirm').addEventListener('click', () => {
      const note = document.getElementById('dupochron-note-text').value.trim();
      this.handleDecision(decision, note);
    });
  },

  handleDecision(decision, note) {
    Offerte.markDecision(this.doc.id, decision, note);
    this.state = decision;
    const rootEl = document.getElementById('dupochron-root');
    rootEl.innerHTML = this.renderResult(decision);
    this.refreshIcons();
  },

  renderResult(decision) {
    const t = (k) => I18n.tFor(this.lang, k);
    let icon, iconClass, title, msg;

    if (decision === 'accepted') {
      icon = 'check'; iconClass = 'success';
      title = t('dupochron_accept_title'); msg = t('dupochron_accept_msg');
    } else if (decision === 'discuss') {
      icon = 'message-circle'; iconClass = 'warning';
      title = t('dupochron_discuss_title'); msg = t('dupochron_discuss_msg');
    } else {
      icon = 'x'; iconClass = 'danger';
      title = t('dupochron_reject_title'); msg = t('dupochron_reject_msg');
    }

    return `
      <div class="dupochron">
        <div class="dupochron-card">
          <div class="dupochron-result">
            <div class="dupochron-result-icon ${iconClass}">
              <i data-lucide="${icon}"></i>
            </div>
            <h2>${title}</h2>
            <p>${msg}</p>
          </div>
        </div>
      </div>
    `;
  },

  refreshIcons() { if (window.lucide) window.lucide.createIcons(); }
};

window.Dupochron = Dupochron;
