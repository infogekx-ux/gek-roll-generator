import { clamp } from './util.js';

export class Input {
  constructor() {
    this.keys = new Set();
    this.axis = { x: 0, y: 0 };
    this.fire = false;
    this._stickActive = false;
    this._stickId = null;
    this._stickEl = null;
    this._knobEl = null;
    this._fireEl = null;
    this._stickCenter = { x: 0, y: 0 };
    this._stickRadius = 50;

    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key);
      this._fromKeys();
      if (e.key === ' ' || e.key === 'Enter') this.fire = true;
    }, { passive: true });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key);
      this._fromKeys();
      if (e.key === ' ' || e.key === 'Enter') this.fire = false;
    }, { passive: true });
  }

  attachTouch(stickEl, knobEl, fireEl) {
    this._stickEl = stickEl;
    this._knobEl = knobEl;
    this._fireEl = fireEl;
    if (!stickEl) return;
    const onStart = (e) => {
      const t = e.changedTouches ? e.changedTouches[0] : e;
      const r = stickEl.getBoundingClientRect();
      this._stickCenter = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      this._stickRadius = r.width / 2 - 10;
      this._stickActive = true;
      this._stickId = e.changedTouches ? t.identifier : 'mouse';
      this._move(t.clientX, t.clientY);
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!this._stickActive) return;
      if (e.changedTouches) {
        for (const t of e.changedTouches) {
          if (t.identifier === this._stickId) {
            this._move(t.clientX, t.clientY);
            break;
          }
        }
      } else {
        this._move(e.clientX, e.clientY);
      }
      e.preventDefault();
    };
    const onEnd = (e) => {
      if (e.changedTouches) {
        for (const t of e.changedTouches) {
          if (t.identifier === this._stickId) {
            this._reset();
            break;
          }
        }
      } else {
        this._reset();
      }
    };
    stickEl.addEventListener('touchstart', onStart, { passive: false });
    stickEl.addEventListener('touchmove', onMove, { passive: false });
    stickEl.addEventListener('touchend', onEnd, { passive: false });
    stickEl.addEventListener('touchcancel', onEnd, { passive: false });
    stickEl.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    if (fireEl) {
      const press = (e) => { this.fire = true; e.preventDefault(); };
      const release = (e) => { this.fire = false; };
      fireEl.addEventListener('touchstart', press, { passive: false });
      fireEl.addEventListener('touchend', release, { passive: false });
      fireEl.addEventListener('touchcancel', release, { passive: false });
      fireEl.addEventListener('mousedown', press);
      fireEl.addEventListener('mouseup', release);
      fireEl.addEventListener('mouseleave', release);
    }
  }

  _move(cx, cy) {
    const dx = cx - this._stickCenter.x;
    const dy = cy - this._stickCenter.y;
    const r = this._stickRadius;
    const m = Math.hypot(dx, dy);
    const k = m > r ? r / m : 1;
    const kx = dx * k, ky = dy * k;
    this.axis = { x: clamp(kx / r, -1, 1), y: clamp(ky / r, -1, 1) };
    if (this._knobEl) {
      this._knobEl.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
    }
  }

  _reset() {
    this._stickActive = false;
    this._stickId = null;
    this.axis = { x: 0, y: 0 };
    if (this._knobEl) this._knobEl.style.transform = 'translate(-50%, -50%)';
  }

  _fromKeys() {
    let x = 0, y = 0;
    if (this.keys.has('ArrowLeft') || this.keys.has('a') || this.keys.has('A')) x -= 1;
    if (this.keys.has('ArrowRight') || this.keys.has('d') || this.keys.has('D')) x += 1;
    if (this.keys.has('ArrowUp') || this.keys.has('w') || this.keys.has('W')) y -= 1;
    if (this.keys.has('ArrowDown') || this.keys.has('s') || this.keys.has('S')) y += 1;
    if (x || y) this.axis = { x, y };
    else if (!this._stickActive) this.axis = { x: 0, y: 0 };
  }
}
