// offerte.js - Offerte/factuur builder engine
// Storage: localStorage for v1 (single device)
// Engine: ZZP'er works in their own language; client receives doc in chosen language

const STORAGE_KEY = 'zzp_shield_data';

const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { offertes: [], facturen: [], counters: { offerte: 0, factuur: 0 } };
      const data = JSON.parse(raw);
      data.offertes = data.offertes || [];
      data.facturen = data.facturen || [];
      data.counters = data.counters || { offerte: 0, factuur: 0 };
      return data;
    } catch (e) {
      console.error('Storage parse error:', e);
      return { offertes: [], facturen: [], counters: { offerte: 0, factuur: 0 } };
    }
  },
  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  getById(id, type) {
    const data = this.load();
    return data[type === 'factuur' ? 'facturen' : 'offertes'].find(d => d.id === id);
  },
  upsert(doc, type) {
    const data = this.load();
    const collection = type === 'factuur' ? 'facturen' : 'offertes';
    const idx = data[collection].findIndex(d => d.id === doc.id);
    if (idx >= 0) data[collection][idx] = doc;
    else data[collection].push(doc);
    this.save(data);
  },
  remove(id, type) {
    const data = this.load();
    const collection = type === 'factuur' ? 'facturen' : 'offertes';
    data[collection] = data[collection].filter(d => d.id !== id);
    this.save(data);
  },
  nextNumber(type) {
    const data = this.load();
    const year = new Date().getFullYear();
    data.counters[type] = (data.counters[type] || 0) + 1;
    this.save(data);
    const num = String(data.counters[type]).padStart(3, '0');
    const prefix = type === 'factuur' ? 'FAC' : 'OFF';
    return `${prefix}-${year}-${num}`;
  }
};

const Offerte = {
  config: null,
  currentDoc: null,
  currentType: 'offerte',

  init(config) {
    this.config = config;
  },

  // Build a new empty offerte/factuur with defaults
  createEmpty(type = 'offerte') {
    const id = Storage.nextNumber(type);
    const now = new Date();
    const validDays = this.config.legal?.offerte_valid_days || 30;
    const paymentDays = this.config.legal?.payment_terms_days || 14;
    return {
      id,
      type,
      date: now.toISOString().slice(0, 10),
      validDays,
      paymentDays,
      client: { name: '', address: '', email: '', language: this.config.languages.default || 'nl' },
      items: [],
      notes: '',
      status: 'concept',
      btwPercentage: this.config.legal?.btw_percentage || 21,
      createdAt: now.toISOString()
    };
  },

  // Calculate totals
  totals(doc) {
    const subtotal = (doc.items || []).reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
    }, 0);
    const btw = subtotal * ((doc.btwPercentage || 21) / 100);
    const total = subtotal + btw;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      btw: Math.round(btw * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  },

  // Resolve item name in target language
  resolveItemName(item, lang) {
    if (item.refType === 'service') {
      const service = this.config.services.find(s => s.id === item.refId);
      if (service) return I18n.get(service.name, lang);
    }
    if (item.refType === 'material') {
      const mat = this.config.materials.find(m => m.id === item.refId);
      if (mat) return I18n.get(mat.name, lang);
    }
    // Custom row: use multilingual description if provided, else name field
    if (item.descriptions && typeof item.descriptions === 'object') {
      return I18n.get(item.descriptions, lang);
    }
    return item.description || item.name || '';
  },

  resolveUnit(item, lang) {
    if (item.refType === 'material') {
      const mat = this.config.materials.find(m => m.id === item.refId);
      if (mat) return I18n.get(mat.unit, lang);
    }
    if (item.refType === 'service') {
      const service = this.config.services.find(s => s.id === item.refId);
      if (service) {
        const map = { hourly: 'unit_hour', m2: 'unit_m2', per_unit: 'unit_per_unit' };
        return I18n.tFor(lang, map[service.priceType] || 'unit_piece');
      }
    }
    return item.unit || '';
  },

  // Generate full HTML preview of the document in the target language
  renderPreview(doc) {
    const lang = doc.client?.language || 'nl';
    const c = this.config.company;
    const t = (key) => I18n.tFor(lang, key);
    const totals = this.totals(doc);

    const docDate = new Date(doc.date);
    const validUntil = new Date(docDate);
    validUntil.setDate(validUntil.getDate() + (doc.validDays || 30));
    const dueDate = new Date(docDate);
    dueDate.setDate(dueDate.getDate() + (doc.paymentDays || 14));

    const fmtDate = (d) => I18n.formatDate(d, lang);
    const fmtPrice = (n) => I18n.formatPrice(n, lang);

    const isInvoice = doc.type === 'factuur';
    const docTitle = isInvoice ? t('factuur_title') : t('offerte_title');

    const itemRows = (doc.items || []).map(item => {
      const name = this.resolveItemName(item, lang);
      const unit = this.resolveUnit(item, lang);
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      const lineTotal = qty * price;
      return `
        <tr>
          <td>${this.escapeHtml(name)}</td>
          <td class="num">${qty}</td>
          <td>${this.escapeHtml(unit)}</td>
          <td class="num">${fmtPrice(price)}</td>
          <td class="num">${fmtPrice(lineTotal)}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="doc-preview" id="doc-preview">
        <div class="doc-header">
          <div class="company-info">
            <div class="company-name">${c.name}</div>
            <div class="company-tagline">${I18n.get(c.tagline, lang)}</div>
            <div>${c.address.street}</div>
            <div>${c.address.postcode} ${c.address.city}</div>
            <div>KvK: ${c.kvk} | BTW: ${c.btw}</div>
            <div>${c.phone} | ${c.email}</div>
          </div>
          <div class="doc-meta">
            <div class="doc-title">${docTitle}</div>
            <div class="doc-number">${doc.id}</div>
            <div class="doc-dates">
              <div>${t('offerte_date')}: ${fmtDate(docDate)}</div>
              ${isInvoice
                ? `<div>${t('factuur_due')}: ${fmtDate(dueDate)}</div>`
                : `<div>${t('offerte_valid')}: ${fmtDate(validUntil)}</div>`
              }
            </div>
          </div>
        </div>

        <div class="doc-parties">
          <div>
            <div class="doc-party-label">${t('offerte_to')}</div>
            <div>${this.escapeHtml(doc.client?.name || '')}</div>
            <div style="white-space:pre-line;">${this.escapeHtml(doc.client?.address || '')}</div>
            ${doc.client?.email ? `<div>${this.escapeHtml(doc.client.email)}</div>` : ''}
          </div>
          <div>
            <div class="doc-party-label">${t('offerte_from')}</div>
            <div>${c.owner}</div>
            <div>${c.name}</div>
          </div>
        </div>

        <table class="doc-table">
          <thead>
            <tr>
              <th>${t('offerte_description')}</th>
              <th class="num">${t('offerte_quantity')}</th>
              <th>${t('offerte_unit')}</th>
              <th class="num">${t('offerte_price')}</th>
              <th class="num">${t('offerte_total')}</th>
            </tr>
          </thead>
          <tbody>${itemRows || '<tr><td colspan="5" style="text-align:center;color:#999;padding:24px;">—</td></tr>'}</tbody>
        </table>

        <div class="doc-totals">
          <div class="doc-totals-row">
            <span>${t('offerte_subtotal')}</span>
            <span>${fmtPrice(totals.subtotal)}</span>
          </div>
          <div class="doc-totals-row">
            <span>${t('offerte_btw')} ${doc.btwPercentage || 21}%</span>
            <span>${fmtPrice(totals.btw)}</span>
          </div>
          <div class="doc-totals-row grand">
            <span>${t('offerte_total').toUpperCase()}</span>
            <span>${fmtPrice(totals.total)}</span>
          </div>
        </div>

        <div class="doc-footer">
          <p><strong>${t('offerte_payment')}:</strong> ${doc.paymentDays || 14} ${t('offerte_days')}</p>
          <p><strong>${t('factuur_iban')}:</strong> ${c.iban} (${c.bank}) — ${c.owner}</p>
          ${doc.notes ? `<p style="margin-top:12px;">${this.escapeHtml(doc.notes)}</p>` : ''}
          <p style="margin-top:12px;font-size:0.8rem;">${I18n.get(this.config.legal?.terms, lang)}</p>
        </div>
      </div>
    `;
  },

  escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Convert an offerte to a factuur
  toInvoice(offerteDoc) {
    const invoice = this.createEmpty('factuur');
    invoice.client = { ...offerteDoc.client };
    invoice.items = JSON.parse(JSON.stringify(offerteDoc.items || []));
    invoice.notes = offerteDoc.notes;
    invoice.btwPercentage = offerteDoc.btwPercentage;
    invoice.sourceOfferteId = offerteDoc.id;
    return invoice;
  }
};

window.Storage = Storage;
window.Offerte = Offerte;
