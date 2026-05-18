// contact.js - Contact form with photo upload

const Contact = {
  config: null,
  photos: [],

  init(config) {
    this.config = config;
    this.photos = [];
    this.bind();
  },

  bind() {
    const dropzone = document.getElementById('dropzone');
    const input = document.getElementById('contact-photos');
    const form = document.getElementById('contact-form');

    if (!dropzone || !input || !form) return;

    input.addEventListener('change', (e) => this.handleFiles(e.target.files));

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      this.handleFiles(e.dataTransfer.files);
    });

    form.addEventListener('submit', (e) => this.handleSubmit(e));
  },

  handleFiles(fileList) {
    const max = this.config.contact?.maxPhotoUpload || 5;
    const maxSize = (this.config.contact?.maxPhotoSizeMB || 10) * 1024 * 1024;

    for (const file of fileList) {
      if (this.photos.length >= max) {
        alert(`Maximum ${max} photos.`);
        break;
      }
      if (!file.type.startsWith('image/')) continue;
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large (max ${this.config.contact?.maxPhotoSizeMB || 10}MB).`);
        continue;
      }
      this.photos.push(file);
    }
    this.renderPreviews();
    this.syncInput();
  },

  renderPreviews() {
    const container = document.getElementById('photo-previews');
    if (!container) return;
    container.innerHTML = this.photos.map((file, i) => {
      const url = URL.createObjectURL(file);
      return `
        <div class="photo-preview">
          <img src="${url}" alt="${file.name}">
          <button type="button" class="photo-remove" data-index="${i}" aria-label="Remove">×</button>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.photo-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = parseInt(e.target.dataset.index, 10);
        this.photos.splice(i, 1);
        this.renderPreviews();
        this.syncInput();
      });
    });
  },

  syncInput() {
    const input = document.getElementById('contact-photos');
    if (!input) return;
    const dt = new DataTransfer();
    this.photos.forEach(f => dt.items.add(f));
    input.files = dt.files;
  },

  async handleSubmit(e) {
    const form = e.target;
    const isNetlify = form.hasAttribute('data-netlify');

    if (!isNetlify || window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
      e.preventDefault();
      this.fallbackMailto(form);
      return;
    }
    // Otherwise let Netlify handle it; show success on next page or via AJAX
    e.preventDefault();
    try {
      const formData = new FormData(form);
      const res = await fetch('/', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        document.getElementById('form-success')?.classList.add('show');
        form.reset();
        this.photos = [];
        this.renderPreviews();
      } else {
        throw new Error('Submit failed');
      }
    } catch (err) {
      // Fallback: open mailto
      this.fallbackMailto(form);
    }
  },

  fallbackMailto(form) {
    const c = this.config.company;
    const data = new FormData(form);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const phone = data.get('phone') || '';
    const lang = data.get('language') || '';
    const message = data.get('message') || '';

    const subject = `Website contact — ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nLanguage: ${lang}\n\n${message}`;
    window.location.href = `mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
};

window.Contact = Contact;
