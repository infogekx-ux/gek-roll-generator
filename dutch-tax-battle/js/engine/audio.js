let ctx = null;
let muted = false;

function ensure() {
  if (ctx) return ctx;
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (C) ctx = new C();
  } catch {}
  return ctx;
}

export function unlockAudio() {
  const c = ensure();
  if (!c) return;
  if (c.state === 'suspended') c.resume().catch(() => {});
}

export function setMuted(v) { muted = !!v; }
export function isMuted() { return muted; }

function tone({ freq = 440, dur = 0.1, type = 'square', vol = 0.15, slide = 0, attack = 0.005, release = 0.05 }) {
  if (muted) return;
  const c = ensure();
  if (!c) return;
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + release);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + release + 0.02);
}

export const sfx = {
  shoot() { tone({ freq: 880, dur: 0.06, type: 'square', vol: 0.08, slide: 220 }); },
  hit() { tone({ freq: 220, dur: 0.08, type: 'sawtooth', vol: 0.12, slide: -120 }); },
  ouch() { tone({ freq: 180, dur: 0.18, type: 'square', vol: 0.18, slide: -100 }); },
  coin() { tone({ freq: 980, dur: 0.06, type: 'triangle', vol: 0.1 }); setTimeout(() => tone({ freq: 1320, dur: 0.08, type: 'triangle', vol: 0.1 }), 60); },
  powerup() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone({ freq: f, dur: 0.08, type: 'triangle', vol: 0.12 }), i * 55));
  },
  wave() {
    [392, 523, 659].forEach((f, i) => setTimeout(() => tone({ freq: f, dur: 0.12, type: 'square', vol: 0.14 }), i * 90));
  },
  correct() {
    [523, 659, 784].forEach((f, i) => setTimeout(() => tone({ freq: f, dur: 0.1, type: 'triangle', vol: 0.14 }), i * 80));
  },
  wrong() { tone({ freq: 200, dur: 0.25, type: 'sawtooth', vol: 0.18, slide: -100 }); },
  gameover() {
    [392, 330, 277, 220].forEach((f, i) => setTimeout(() => tone({ freq: f, dur: 0.22, type: 'square', vol: 0.16 }), i * 180));
  },
  click() { tone({ freq: 600, dur: 0.03, type: 'square', vol: 0.08 }); }
};
