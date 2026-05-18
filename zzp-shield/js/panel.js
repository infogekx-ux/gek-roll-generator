// panel.js - Panel UI for ZZP'er (login, list, builder)

const Panel = {
  config: null,
  view: 'list',          // 'list' or 'builder'
  listType: 'offerte',   // 'offerte' or 'factuur'
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

    // ZZP'er always works in their own language (config.languages.ownerLanguage)
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
            <span><span class="logo-accent">${this.config.company.name.split('.')[0]}</span>${this.config.company.name.includes('.') ? '.' + this.config.company.name.split('.').slice(1).join('.') : ''}</span>
          </div>
          <h2 style="margin-bottom:1.5rem;">${I18n.t('panel_login_title')}</h2>
          <form id="login-form">
            <div class="form-group">
              <input type="password" id="login-pin" class="pin-input" maxlength="6" placeholder="••••" autofocus>
            </div>
            <div id="login-error" style="color:#C82333;margin-bottom:12px;display:none;font-size:0.9rem;">${I18n.t('panel_login_error')}</div>
            <button type="submit" class="btn btn-primary btn-block">${I18n.t('panel_login_btn')}</button>
          </form>
          <p style="margin-top:24px;"><a href="./index.html" style="font-size:0.85rem;color:#999;">← Terug naar website</a></p>
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
            <span><span class="logo-accent">${this.config.company.name.split('.')[0]}</span>${this.config.company.name.includes('.') ? '.' + this.config.company.name.split('.').slice(1).join('.') : ''}</span>
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
    if (window.lucide) window.lucide.createIcons();
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
    if (window.lucide) window.lucide.createIcons();
  },

  docCard(doc) {
    const totals = Offerte.totals(doc);
    return `
      <div class="doc-card" data-open-id="${doc.id}">
        <div class="doc-card-header">
          <div>
            <div class="doc-card-id">${doc.id}</div>
            <div class="doc-card-date">${I18n.formatDate(doc.date)}</div>
          </div>
          <span class="status-badge status-${doc.status}">${I18n.t('status_' + doc.status) || doc.status}</span>
        </div>
        <div>${Offerte.escapeHtml(doc.client?.name || '—')}</div>
        <div class="doc-card-total">${I18n.formatPrice(totals.total)}</div>
      </div>
    `;
  },

  openBuilder(id) {
    this.view = 'builder';
    if (id) {
      this.currentDoc = JSON.parse(JSON.stringify(Storage.getById(id, this.listType)));
    } else {
      this.currentDoc = Offerte.createEmpty(this.listType);
    }
    this.renderBuilder();
  },

  renderBuilder() {
    const doc = this.currentDoc;
    const main = document.getElementById('panel-main');
    const langs = this.config.languages.available;

    main.innerHTML = `
      <div class="panel-header">
        <div>
          <button class="btn btn-secondary btn-sm" id="btn-back"><i data-lucide="arrow-left"></i> ${I18n.t('builder_back')}</button>
          <h1 style="margin-top:8px;">${doc.id}</h1>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <select id="status-select" class="form-group" style="padding:8px 12px;border:1px solid var(--border);border-radius:6px;">
            ${this.statusOptions(doc.type).map(s =>
              `<option value="${s}" ${doc.status === s ? 'selected' : ''}>${I18n.t('status_' + s)}</option>`
            ).join('')}
          </select>
          ${doc.type === 'offerte' ? `<button class="btn btn-secondary btn-sm" id="btn-to-invoice"><i data-lucide="receipt"></i> ${I18n.t('builder_to_invoice')}</button>` : ''}
          <button class="btn btn-secondary btn-sm" id="btn-delete" style="color:#C82333;border-color:#C82333;"><i data-lucide="trash-2"></i></button>
        </div>
      </div>

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
            <input type="number" id="payment-days" value="${doc.paymentDays}" min="1">
          </div>
        </div>
        <div class="form-group">
          <label>${I18n.t('builder_notes')}</label>
          <textarea id="notes" rows="3">${Offerte.escapeHtml(doc.notes || '')}</textarea>
        </div>
      </div>

      <div class="builder-actions">
        <button class="btn btn-secondary" id="btn-preview"><i data-lucide="eye"></i> ${I18n.t('builder_preview')}</button>
        <button class="btn btn-primary" id="btn-save"><i data-lucide="save"></i> ${I18n.t('builder_save')}</button>
      </div>
    `;

    this.bindBuilder();
    this.renderItems();
    this.updateTotals();
    if (window.lucide) window.lucide.createIcons();
  },

  statusOptions(type) {
    if (type === 'factuur') return ['concept', 'sent', 'paid', 'overdue'];
    return ['concept', 'sent', 'accepted', 'rejected'];
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
      alert('Opgeslagen / Zapisane / Saved');
    });

    document.getElementById('btn-preview').addEventListener('click', () => {
      this.syncFromForm();
      Storage.upsert(this.currentDoc, this.currentDoc.type);
      const url = `./offerte-preview.html?id=${encodeURIComponent(this.currentDoc.id)}&type=${this.currentDoc.type}`;
      window.open(url, '_blank');
    });

    const toInvoice = document.getElementById('btn-to-invoice');
    if (toInvoice) {
      toInvoice.addEventListener('click', () => {
        this.syncFromForm();
        Storage.upsert(this.currentDoc, this.currentDoc.type);
        const invoice = Offerte.toInvoice(this.currentDoc);
        Storage.upsert(invoice, 'factuur');
        this.listType = 'factuur';
        this.currentDoc = invoice;
        document.querySelectorAll('.panel-nav button').forEach(b => {
          b.classList.toggle('active', b.dataset.tab === 'factuur');
        });
        this.renderBuilder();
      });
    }

    document.getElementById('add-service-btn').addEventListener('click', () => this.addRow('service'));
    document.getElementById('add-material-btn').addEventListener('click', () => this.addRow('material'));
    document.getElementById('add-custom-btn').addEventListener('click', () => this.addRow('custom'));

    document.getElementById('status-select').addEventListener('change', (e) => {
      this.currentDoc.status = e.target.value;
    });
  },

  syncFromForm() {
    const doc = this.currentDoc;
    doc.client = doc.client || {};
    doc.client.name = document.getElementById('client-name').value;
    doc.client.email = document.getElementById('client-email').value;
    doc.client.address = document.getElementById('client-address').value;
    doc.client.language = document.getElementById('client-lang').value;
    doc.validDays = parseInt(document.getElementById('valid-days').value, 10) || 30;
    doc.paymentDays = parseInt(document.getElementById('payment-days').value, 10) || 14;
    doc.notes = document.getElementById('notes').value;
    doc.status = document.getElementById('status-select').value;
    // Items are already kept in sync via inline editing
  },

  addRow(refType) {
    const item = { refType, refId: '', quantity: 1, price: 0, description: '', unit: '' };
    if (refType === 'service') {
      const first = this.config.services[0];
      if (first) {
        item.refId = first.id;
        item.price = first.defaultRate;
      }
    } else if (refType === 'material') {
      const first = this.config.materials[0];
      if (first) {
        item.refId = first.id;
        item.price = first.defaultPrice;
      }
    }
    this.currentDoc.items.push(item);
    this.renderItems();
    this.updateTotals();
  },

  renderItems() {
    const body = document.getElementById('items-body');
    const ownerLang = I18n.currentLang;
    const items = this.currentDoc.items || [];

    if (items.length === 0) {
      body.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#999;padding:24px;">—</td></tr>`;
      return;
    }

    body.innerHTML = items.map((item, idx) => {
      let descCell = '';
      if (item.refType === 'service') {
        descCell = `
          <select data-idx="${idx}" data-field="refId">
            ${this.config.services.map(s =>
              `<option value="${s.id}" ${s.id === item.refId ? 'selected' : ''}>${I18n.get(s.name, ownerLang)}</option>`
            ).join('')}
          </select>
        `;
      } else if (item.refType === 'material') {
        descCell = `
          <select data-idx="${idx}" data-field="refId">
            ${this.config.materials.map(m =>
              `<option value="${m.id}" ${m.id === item.refId ? 'selected' : ''}>${I18n.get(m.name, ownerLang)}</option>`
            ).join('')}
          </select>
        `;
      } else {
        descCell = `<input type="text" data-idx="${idx}" data-field="description" value="${Offerte.escapeHtml(item.description || '')}" placeholder="${I18n.t('offerte_description')}">`;
      }

      const unitCell = (item.refType === 'custom')
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

    // When switching refId for a service/material, auto-update price
    if (field === 'refId') {
      if (item.refType === 'service') {
        const s = this.config.services.find(x => x.id === item.refId);
        if (s) item.price = s.defaultRate;
      } else if (item.refType === 'material') {
        const m = this.config.materials.find(x => x.id === item.refId);
        if (m) item.price = m.defaultPrice;
      }
      this.renderItems();
    } else {
      // Update just the totals on quantity/price change for performance
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
    if (!box) return;
    box.innerHTML = `
      <div class="totals-row"><span>${I18n.t('offerte_subtotal')}</span><span>${I18n.formatPrice(totals.subtotal)}</span></div>
      <div class="totals-row"><span>${I18n.t('offerte_btw')} ${btw}%</span><span>${I18n.formatPrice(totals.btw)}</span></div>
      <div class="totals-row total"><span>${I18n.t('offerte_total')}</span><span>${I18n.formatPrice(totals.total)}</span></div>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => Panel.init());
window.Panel = Panel;
