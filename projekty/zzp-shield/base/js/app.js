// app.js - Main application, config loader, page renderer

const App = {
  config: null,

  async init() {
    try {
      const res = await fetch('./config/config.json');
      if (!res.ok) throw new Error('Config not found');
      this.config = await res.json();
      window.AppConfig = this.config;
    } catch (e) {
      console.error('Failed to load config:', e);
      document.body.innerHTML = '<p style="padding:48px;text-align:center;">Configuration error. Please check config.json</p>';
      return;
    }

    I18n.init(this.config);
    this.applyBranding();
    this.render();
    this.bindEvents();
    document.addEventListener('langchange', () => this.render());
  },

  applyBranding() {
    const b = this.config.branding || {};
    const root = document.documentElement.style;
    if (b.accentColor) root.setProperty('--accent', b.accentColor);
    if (b.accentColorLight) root.setProperty('--accent-light', b.accentColorLight);
    if (b.textColor) root.setProperty('--text', b.textColor);
    if (b.backgroundColor) root.setProperty('--bg', b.backgroundColor);
    if (b.cardBackground) root.setProperty('--card-bg', b.cardBackground);
    if (b.fontHeading) root.setProperty('--font-heading', `'${b.fontHeading}', sans-serif`);
    if (b.fontBody) root.setProperty('--font-body', `'${b.fontBody}', sans-serif`);

    document.title = `${this.config.company.name} — ${I18n.get(this.config.company.tagline)}`;
  },

  logoMarkup() {
    const name = this.config.company.name;
    const parts = name.split('.');
    if (parts.length > 1) {
      return `<span class="logo-accent">${parts[0]}</span>.${parts.slice(1).join('.')}`;
    }
    return `<span class="logo-accent">${name}</span>`;
  },

  render() {
    this.renderHeader();
    this.renderHero();
    this.renderServices();
    this.renderUSP();
    this.renderGallery();
    this.renderAbout();
    this.renderContact();
    this.renderFooter();
    document.documentElement.lang = I18n.currentLang;
    if (window.lucide) window.lucide.createIcons();
  },

  renderHeader() {
    const c = this.config.company;
    const header = document.getElementById('site-header');
    if (!header) return;

    const langs = this.config.languages.available;
    const langButtons = langs.map(l =>
      `<button class="lang-btn ${l === I18n.currentLang ? 'active' : ''}" data-lang="${l}" title="${l.toUpperCase()}">${FLAGS[l]}</button>`
    ).join('');

    header.innerHTML = `
      <div class="container header-inner">
        <a href="#" class="logo">
          <img src="./assets/logo.png" alt="${c.name}" onerror="this.style.display='none'">
          <span>${this.logoMarkup()}</span>
        </a>
        <nav class="nav">
          <a href="#services">${I18n.t('nav_services')}</a>
          <a href="#gallery">${I18n.t('nav_gallery')}</a>
          <a href="#about">${I18n.t('nav_about')}</a>
          <a href="#contact">${I18n.t('nav_contact')}</a>
        </nav>
        <div class="lang-switcher">${langButtons}</div>
        <button class="hamburger" id="hamburger" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    `;

    let mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) {
      mobileMenu = document.createElement('div');
      mobileMenu.id = 'mobile-menu';
      mobileMenu.className = 'mobile-menu';
      document.body.appendChild(mobileMenu);
      const overlay = document.createElement('div');
      overlay.id = 'mobile-menu-overlay';
      overlay.className = 'mobile-menu-overlay';
      document.body.appendChild(overlay);
    }
    mobileMenu.innerHTML = `
      <button class="mobile-menu-close" id="mobile-menu-close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <a href="#services">${I18n.t('nav_services')}</a>
      <a href="#gallery">${I18n.t('nav_gallery')}</a>
      <a href="#about">${I18n.t('nav_about')}</a>
      <a href="#contact">${I18n.t('nav_contact')}</a>
    `;
  },

  renderHero() {
    const c = this.config.company;
    const hero = document.getElementById('hero');
    if (!hero) return;

    const bio = I18n.get(this.config.about?.bio || '');
    const firstSentence = bio.split('.')[0] + '.';
    const years = this.config.about?.experience_years || 10;

    hero.innerHTML = `
      <div class="container hero-inner">
        <img src="./assets/logo.png" alt="${c.name}" style="max-height:120px;margin:0 auto 2rem;">
        <div class="about-badge" style="margin:0 auto 1.5rem;"><i data-lucide="award" style="width:18px;height:18px;"></i> ${years}+ ${I18n.t('about_experience')}</div>
        <h1>${c.name}</h1>
        <p class="hero-tagline">${I18n.get(c.tagline)}</p>
        <p class="hero-subtitle">${firstSentence}</p>
        <div class="hero-ctas">
          <a href="#contact" class="btn btn-primary">
            <i data-lucide="file-text"></i>
            ${I18n.t('hero_cta_quote')}
          </a>
          <a href="tel:${c.phone}" class="btn btn-secondary">
            <i data-lucide="phone"></i>
            ${I18n.t('hero_cta_call')}
          </a>
        </div>
      </div>
    `;
  },

  renderServices() {
    const section = document.getElementById('services');
    if (!section) return;
    const services = this.config.services || [];

    const priceUnit = (s) => {
      const rate = s.defaultRate ? `€${s.defaultRate.toFixed(0)}` : '';
      const units = { hourly: '/uur', m2: '/m²', per_unit: '/stuk' };
      return rate ? `<span class="service-price">${rate}${units[s.priceType] || ''}</span>` : '';
    };

    section.innerHTML = `
      <div class="container">
        <div class="section-heading">
          <h2>${I18n.t('services_heading')}</h2>
          <p>${I18n.t('services_subheading')}</p>
        </div>
        <div class="services-grid">
          ${services.map(s => `
            <div class="service-card">
              <div class="service-icon">
                <i data-lucide="${s.icon || 'wrench'}"></i>
              </div>
              <h3>${I18n.get(s.name)}</h3>
              <p>${I18n.get(s.description)}</p>
              ${priceUnit(s)}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderUSP() {
    const section = document.getElementById('usp');
    if (!section) return;
    const usps = this.config.usp || [];
    section.innerHTML = `
      <div class="container">
        <div class="section-heading">
          <h2>${I18n.t('usp_heading')}</h2>
        </div>
        <div class="usp-grid">
          ${usps.map(u => `
            <div class="usp-card">
              <div class="usp-icon"><i data-lucide="${u.icon || 'check'}"></i></div>
              <h3>${I18n.get(u.title)}</h3>
              <p>${I18n.get(u.text)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderGallery() {
    const section = document.getElementById('gallery');
    if (!section) return;
    const images = window.GALLERY_IMAGES || [];

    if (images.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = '';
    section.innerHTML = `
      <div class="container">
        <div class="section-heading">
          <h2>${I18n.t('gallery_heading')}</h2>
          <p>${I18n.t('gallery_subheading')}</p>
        </div>
        <div class="gallery-grid" id="gallery-grid">
          ${images.map((src, i) => `
            <div class="gallery-item" data-index="${i}">
              <img src="${src}" alt="Project ${i + 1}" loading="lazy">
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.Gallery) window.Gallery.init(images);
  },

  renderAbout() {
    const section = document.getElementById('about');
    if (!section) return;
    const a = this.config.about || {};
    const c = this.config.company;

    section.innerHTML = `
      <div class="container" style="max-width:800px;">
        <div class="section-heading">
          <h2>${I18n.t('about_heading')}</h2>
        </div>
        ${a.experience_years ? `
          <div class="about-badge" style="margin:0 auto 1.5rem;">
            <i data-lucide="award"></i>
            ${a.experience_years}+ ${I18n.t('about_experience')}
          </div>
        ` : ''}
        <div class="about-text" style="text-align:center;">
          <p>${I18n.get(a.bio)}</p>
          <p style="margin-top:1.5rem;"><strong>${c.owner}</strong><br>
          <span style="color:var(--text-muted);font-size:0.9rem;">${c.address.city} ${I18n.t('about_region')}</span></p>
        </div>
      </div>
    `;
  },

  renderContact() {
    const section = document.getElementById('contact');
    if (!section) return;
    const c = this.config.company;
    const addr = c.address;
    const whatsappLink = `https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`;

    section.innerHTML = `
      <div class="container">
        <div class="section-heading">
          <h2>${I18n.t('contact_heading')}</h2>
          <p>${I18n.t('contact_subheading')}</p>
        </div>
        <div class="contact-grid">
          <form class="contact-form" id="contact-form" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" enctype="multipart/form-data">
            <input type="hidden" name="form-name" value="contact">
            <p style="display:none;"><label>Don't fill this out: <input name="bot-field"></label></p>
            <div class="form-success" id="form-success">${I18n.t('form_success')}</div>
            <div class="form-row">
              <div class="form-group">
                <label for="contact-name">${I18n.t('contact_name')} *</label>
                <input type="text" id="contact-name" name="name" required>
              </div>
              <div class="form-group">
                <label for="contact-email">${I18n.t('contact_email')} *</label>
                <input type="email" id="contact-email" name="email" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="contact-phone">${I18n.t('contact_phone')}</label>
                <input type="tel" id="contact-phone" name="phone">
              </div>
              <div class="form-group">
                <label for="contact-lang">${I18n.t('contact_language')}</label>
                <select id="contact-lang" name="language">
                  ${this.config.languages.available.map(l =>
                    `<option value="${l}" ${l === I18n.currentLang ? 'selected' : ''}>${FLAGS[l]} ${l === 'nl' ? 'Nederlands' : l === 'pl' ? 'Polski' : 'English'}</option>`
                  ).join('')}
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="contact-message">${I18n.t('contact_message')} *</label>
              <textarea id="contact-message" name="message" required></textarea>
            </div>
            <div class="form-group">
              <label>${I18n.t('contact_photos')}</label>
              <label class="dropzone" id="dropzone" for="contact-photos">
                <i data-lucide="upload" style="width:32px;height:32px;"></i>
                <p>${I18n.t('contact_photos_hint')}</p>
                <input type="file" id="contact-photos" name="photos" accept="image/*" multiple>
              </label>
              <div class="photo-previews" id="photo-previews"></div>
            </div>
            <button type="submit" class="btn btn-primary btn-block">
              <i data-lucide="send"></i>
              ${I18n.t('contact_submit')}
            </button>
          </form>

          <div class="contact-info">
            <a href="${whatsappLink}" target="_blank" class="btn btn-whatsapp btn-block">
              <i data-lucide="message-circle"></i>
              ${I18n.t('contact_whatsapp')}
            </a>
            <a href="tel:${c.phone}" class="contact-info-item">
              <div class="contact-info-icon"><i data-lucide="phone"></i></div>
              <div class="contact-info-text">
                <strong>${I18n.t('contact_phone_label')}</strong>
                <span>${c.phone}</span>
              </div>
            </a>
            <a href="mailto:${c.email}" class="contact-info-item">
              <div class="contact-info-icon"><i data-lucide="mail"></i></div>
              <div class="contact-info-text">
                <strong>${I18n.t('contact_email_label')}</strong>
                <span>${c.email}</span>
              </div>
            </a>
            <div class="contact-info-item" style="cursor:default;">
              <div class="contact-info-icon"><i data-lucide="map-pin"></i></div>
              <div class="contact-info-text">
                <strong>${I18n.t('contact_address_label')}</strong>
                <span>${addr.street}, ${addr.postcode} ${addr.city}</span>
              </div>
            </div>
            ${this.config.contact?.mapEmbed ? `
              <div class="map-embed">
                <iframe src="https://www.google.com/maps?q=${encodeURIComponent(addr.street + ', ' + addr.postcode + ' ' + addr.city)}&output=embed" loading="lazy"></iframe>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    if (window.Contact) window.Contact.init(this.config);
  },

  renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const c = this.config.company;
    const year = new Date().getFullYear();

    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="#" class="logo">
              <span>${this.logoMarkup()}</span>
            </a>
            <p>${I18n.get(c.tagline)}</p>
          </div>
          <div>
            <h4>${I18n.t('footer_contact')}</h4>
            <p><a href="tel:${c.phone}">${c.phone}</a></p>
            <p><a href="mailto:${c.email}">${c.email}</a></p>
            <p>${c.address.street}<br>${c.address.postcode} ${c.address.city}</p>
          </div>
          <div>
            <h4>${I18n.t('footer_legal')}</h4>
            <p>KvK: ${c.kvk}</p>
            <p>BTW: ${c.btw}</p>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${year} ${c.name} — ${I18n.t('footer_rights')}</span>
          <span class="footer-credit">${I18n.t('footer_by')} <a href="https://gek-x.nl" target="_blank">GEK-X</a></span>
          <a href="./panel.html" title="Beheer" style="opacity:0.25;transition:opacity 0.3s;display:inline-flex;margin-left:8px;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='0.25'"><i data-lucide="lock" style="width:14px;height:14px;color:var(--footer-text);"></i></a>
        </div>
      </div>
    `;
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      const langBtn = e.target.closest('.lang-btn');
      if (langBtn) {
        const lang = langBtn.dataset.lang;
        I18n.setLang(lang);
        return;
      }

      if (e.target.closest('#hamburger')) {
        document.getElementById('mobile-menu')?.classList.add('open');
        document.getElementById('mobile-menu-overlay')?.classList.add('open');
        return;
      }

      if (e.target.closest('#mobile-menu-close') || e.target.id === 'mobile-menu-overlay' || e.target.closest('.mobile-menu a')) {
        document.getElementById('mobile-menu')?.classList.remove('open');
        document.getElementById('mobile-menu-overlay')?.classList.remove('open');
      }
    });

    window.addEventListener('scroll', () => {
      const header = document.getElementById('site-header');
      if (header) {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }
    }, { passive: true });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
