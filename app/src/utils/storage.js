// Simpele localStorage wrapper. Geen backend in MVP.

const KEY = 'lulbal.state.v1';

const DEFAULT_STATE = {
  player: null,           // { email, nickname, company, nationality, createdAt }
  scoreTotal: 0,
  euroSaved: 0,
  starsTotal: 0,
  streakDays: 0,
  lastPlayedDate: null,   // ISO date string
  levels: {},             // { [levelId]: { stars, bestScore, attempts } }
  leaderboard: [],        // [{ nickname, company, score, stars, when }]
};

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed, levels: { ...parsed.levels } };
  } catch (e) {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('LULBAL: kon state niet opslaan', e);
  }
}

export function clearState() {
  localStorage.removeItem(KEY);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
