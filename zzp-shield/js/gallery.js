// gallery.js - Lightbox for project gallery

const Gallery = {
  images: [],
  currentIndex: 0,

  init(images) {
    this.images = images || [];
    this.bind();
  },

  bind() {
    document.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (item) {
        this.open(parseInt(item.dataset.index, 10) || 0);
        return;
      }
      if (e.target.closest('.lightbox-close') || e.target.classList.contains('lightbox')) {
        this.close();
        return;
      }
      if (e.target.closest('.lightbox-prev')) { this.prev(); return; }
      if (e.target.closest('.lightbox-next')) { this.next(); return; }
    });

    document.addEventListener('keydown', (e) => {
      if (!this.isOpen()) return;
      if (e.key === 'Escape') this.close();
      else if (e.key === 'ArrowLeft') this.prev();
      else if (e.key === 'ArrowRight') this.next();
    });
  },

  isOpen() {
    return document.getElementById('lightbox')?.classList.contains('open');
  },

  open(index) {
    this.currentIndex = index;
    let lb = document.getElementById('lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'lightbox';
      lb.className = 'lightbox';
      lb.innerHTML = `
        <button class="lightbox-close" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <button class="lightbox-prev" aria-label="Previous">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <img id="lightbox-img" src="" alt="">
        <button class="lightbox-next" aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      `;
      document.body.appendChild(lb);
    }
    document.getElementById('lightbox-img').src = this.images[this.currentIndex];
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    document.getElementById('lightbox')?.classList.remove('open');
    document.body.style.overflow = '';
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    document.getElementById('lightbox-img').src = this.images[this.currentIndex];
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    document.getElementById('lightbox-img').src = this.images[this.currentIndex];
  }
};

window.Gallery = Gallery;

// Default gallery list - empty until photos are added to /assets/gallery/
// To add photos: drop files into assets/gallery/ and add filenames here
window.GALLERY_IMAGES = window.GALLERY_IMAGES || [];
