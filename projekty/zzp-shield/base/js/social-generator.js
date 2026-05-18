// social-generator.js - Auto social-media content from before/after photos
// Uses Canvas API in the browser; outputs JPEG data URLs ready to download.
// Three formats: 1080x1920 reel (9:16), 1080x1080 post (1:1), 1200x630 banner.

const SocialGenerator = {
  config: null,

  init(config) { this.config = config; },

  // Returns { reel, post, banner } as JPEG data URLs, or null if photos are missing.
  async generateAll(offerteId) {
    const doc = Storage.getById(offerteId, 'offerte');
    if (!doc?.beginsituatie?.photos?.length || !doc?.oplevering?.photos?.length) return null;

    const beforeImg = await this.loadImage(doc.beginsituatie.photos[0].dataUrl);
    const afterImg = await this.loadImage(doc.oplevering.photos[0].dataUrl);
    const logoImg = await this.loadImage('./assets/logo.png').catch(() => null);

    // Ensure web fonts are loaded so canvas uses them
    if (document.fonts?.ready) {
      try { await document.fonts.ready; } catch (e) { /* ignore */ }
      try {
        await Promise.all([
          document.fonts.load('800 40px Montserrat'),
          document.fonts.load('700 28px Montserrat'),
          document.fonts.load('400 28px "Open Sans"')
        ]);
      } catch (e) { /* ignore */ }
    }

    return {
      reel:   this.generateReel(beforeImg, afterImg, logoImg),
      post:   this.generatePost(beforeImg, afterImg, logoImg),
      banner: this.generateBanner(beforeImg, afterImg, logoImg)
    };
  },

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  // 1080x1920 — Instagram / TikTok reel cover
  generateReel(before, after, logo) {
    const W = 1080, H = 1920;
    const ctx = this.canvas(W, H);
    const accent = this.config.branding?.accentColor || '#C8962E';
    const company = this.config.company;
    const lang = I18n.currentLang;
    const beforeLabel = I18n.t('social_before');
    const afterLabel = I18n.t('social_after');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    // Top label
    ctx.fillStyle = '#999999';
    ctx.font = '700 44px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(beforeLabel, W / 2, 90);

    // Before photo
    this.drawCover(ctx, before, 40, 120, W - 80, 720);

    // Divider with star
    ctx.fillStyle = accent;
    ctx.fillRect(W / 2 - 80, 880, 160, 5);
    ctx.font = '700 28px "Montserrat", sans-serif';
    ctx.fillText('✦', W / 2, 925);

    // After label
    ctx.fillStyle = accent;
    ctx.font = '800 56px "Montserrat", sans-serif';
    ctx.fillText(afterLabel, W / 2, 990);

    // After photo
    this.drawCover(ctx, after, 40, 1020, W - 80, 680);

    // Bottom branding bar
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, H - 220, W, 220);

    let textX = W / 2;
    if (logo) {
      const logoH = 80;
      const logoW = logo.width * (logoH / logo.height);
      ctx.drawImage(logo, 60, H - 180, logoW, logoH);
      textX = (60 + logoW + W) / 2;
    }

    ctx.fillStyle = accent;
    ctx.font = '800 48px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(company.name, textX, H - 110);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 30px "Open Sans", sans-serif';
    ctx.fillText(company.phone, textX, H - 65);

    return ctx.canvas.toDataURL('image/jpeg', 0.92);
  },

  // 1080x1080 — Instagram / Facebook feed post
  generatePost(before, after, logo) {
    const W = 1080, H = 1080;
    const ctx = this.canvas(W, H);
    const accent = this.config.branding?.accentColor || '#C8962E';
    const company = this.config.company;
    const beforeLabel = I18n.t('social_before');
    const afterLabel = I18n.t('social_after');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    // Labels
    ctx.fillStyle = '#999999';
    ctx.font = '700 32px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(beforeLabel, W / 4, 55);

    ctx.fillStyle = accent;
    ctx.font = '800 38px "Montserrat", sans-serif';
    ctx.fillText(afterLabel, W * 3 / 4, 55);

    // Before / After photos
    this.drawCover(ctx, before, 30, 80, W / 2 - 45, H - 220);
    this.drawCover(ctx, after, W / 2 + 15, 80, W / 2 - 45, H - 220);

    // Vertical divider
    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(W / 2, 40);
    ctx.lineTo(W / 2, H - 140);
    ctx.stroke();

    // Bottom bar
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, H - 120, W, 120);

    let textStart = 40;
    if (logo) {
      const logoH = 60;
      const logoW = logo.width * (logoH / logo.height);
      ctx.drawImage(logo, 40, H - 90, logoW, logoH);
      textStart = 40 + logoW + 24;
    }

    ctx.fillStyle = accent;
    ctx.font = '800 36px "Montserrat", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(company.name, textStart, H - 60);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 26px "Open Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(company.phone, W - 40, H - 50);

    return ctx.canvas.toDataURL('image/jpeg', 0.92);
  },

  // 1200x630 — Facebook / LinkedIn banner / OG image
  generateBanner(before, after, logo) {
    const W = 1200, H = 630;
    const ctx = this.canvas(W, H);
    const accent = this.config.branding?.accentColor || '#C8962E';
    const company = this.config.company;
    const beforeLabel = I18n.t('social_before');
    const afterLabel = I18n.t('social_after');
    const tagline = I18n.get(company.tagline) || '';

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#999999';
    ctx.font = '700 26px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(beforeLabel, W / 4, 40);

    ctx.fillStyle = accent;
    ctx.font = '800 30px "Montserrat", sans-serif';
    ctx.fillText(afterLabel, W * 3 / 4, 40);

    this.drawCover(ctx, before, 24, 56, W / 2 - 36, H - 156);
    this.drawCover(ctx, after, W / 2 + 12, 56, W / 2 - 36, H - 156);

    // Bottom bar
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, H - 90, W, 90);

    let textStart = 30;
    if (logo) {
      const logoH = 50;
      const logoW = logo.width * (logoH / logo.height);
      ctx.drawImage(logo, 30, H - 70, logoW, logoH);
      textStart = 30 + logoW + 24;
    }

    ctx.fillStyle = accent;
    ctx.font = '800 30px "Montserrat", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(company.name, textStart, H - 45);

    ctx.fillStyle = '#CCCCCC';
    ctx.font = '500 20px "Open Sans", sans-serif';
    ctx.fillText(tagline, textStart, H - 18);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 22px "Open Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(company.phone, W - 30, H - 35);

    return ctx.canvas.toDataURL('image/jpeg', 0.92);
  },

  // Helpers
  canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c.getContext('2d');
  },

  // object-fit: cover with rounded corners
  drawCover(ctx, img, x, y, w, h) {
    const imgRatio = img.width / img.height;
    const boxRatio = w / h;
    let sx, sy, sw, sh;
    if (imgRatio > boxRatio) {
      sh = img.height;
      sw = sh * boxRatio;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / boxRatio;
      sx = 0;
      sy = (img.height - sh) / 2;
    }
    const r = 16;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    ctx.restore();
  },

  filename(format, doc) {
    const slug = (this.config.company.name || 'company')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${slug}-${format}-${doc.id}.jpg`;
  }
};

window.SocialGenerator = SocialGenerator;
