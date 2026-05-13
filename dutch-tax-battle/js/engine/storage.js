const KEY_LB = 'zzp-wraak.leaderboard';
const KEY_NAME = 'zzp-wraak.name';
const KEY_PROGRESS = 'zzp-wraak.progress';

export function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(KEY_LB);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

export function saveScore(entry) {
  const lb = loadLeaderboard();
  lb.push(entry);
  lb.sort((a, b) => b.score - a.score);
  const trimmed = lb.slice(0, 50);
  try { localStorage.setItem(KEY_LB, JSON.stringify(trimmed)); } catch {}
  return trimmed.findIndex((e) => e === entry);
}

export function clearLeaderboard() {
  try { localStorage.removeItem(KEY_LB); } catch {}
}

export function getName() {
  try { return localStorage.getItem(KEY_NAME) || ''; } catch { return ''; }
}

export function setName(n) {
  try { localStorage.setItem(KEY_NAME, (n || '').slice(0, 18)); } catch {}
}

export function getProgress() {
  try {
    const raw = localStorage.getItem(KEY_PROGRESS);
    return raw ? JSON.parse(raw) : { highScore: 0, quizCorrect: 0, factsSeen: [], wavesCleared: 0 };
  } catch { return { highScore: 0, quizCorrect: 0, factsSeen: [], wavesCleared: 0 }; }
}

export function saveProgress(p) {
  try { localStorage.setItem(KEY_PROGRESS, JSON.stringify(p)); } catch {}
}
