// Mini Web Audio synth — geen externe assets nodig.
// Lazy AudioContext (browsers blokkeren tot gebruikersinteractie).

let _ctx = null;
let _muted = false;

function ctx() {
  if (_ctx) return _ctx;
  try {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    _ctx = null;
  }
  return _ctx;
}

export function setMuted(m) { _muted = !!m; }
export function isMuted() { return _muted; }

function tone(freq, duration = 0.15, type = 'sine', gainValue = 0.18) {
  if (_muted) return;
  const c = ctx();
  if (!c) return;
  if (c.state === 'suspended') c.resume();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(gainValue, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + duration);
}

export const sfx = {
  correct() {
    tone(523.25, 0.10, 'triangle'); // C5
    setTimeout(() => tone(659.25, 0.12, 'triangle'), 90);   // E5
    setTimeout(() => tone(783.99, 0.20, 'triangle'), 200);  // G5
  },
  wrong() {
    tone(220, 0.18, 'sawtooth', 0.22);
    setTimeout(() => tone(130, 0.30, 'sawtooth', 0.22), 160);
  },
  illegal() {
    tone(110, 0.30, 'square', 0.25);
    setTimeout(() => tone(70, 0.50, 'square', 0.25), 250);
  },
  click() {
    tone(880, 0.05, 'square', 0.10);
  },
  levelUp() {
    [523, 659, 784, 1046].forEach((f, i) =>
      setTimeout(() => tone(f, 0.18, 'triangle', 0.2), i * 110)
    );
  },
  rage() {
    tone(160, 0.08, 'sawtooth', 0.15);
    setTimeout(() => tone(140, 0.10, 'sawtooth', 0.15), 80);
  },
};
