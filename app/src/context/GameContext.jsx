import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loadState, saveState, todayISO } from '../utils/storage.js';
import { t as tRaw, uiLangFromNationality } from '../data/i18n.js';
import {
  supabase, ONLINE,
  fetchMyProfile, ensureProfile,
  insertScore, upsertProgress, fetchMyProgress,
  unlockAchievementOnline, fetchMyAchievements,
  savePendingSignup, loadPendingSignup, clearPendingSignup,
} from '../lib/supabase.js';

const GameContext = createContext(null);

function titleForScore(s) {
  if (s >= 40000) return 'Belasting Boss';
  if (s >= 25000) return 'LULBAL Legende';
  if (s >= 17000) return 'De Fiscale Feniks';
  if (s >= 12000) return 'Ontwijkings Olympiër';
  if (s >= 8000)  return 'Tax Terrorist';
  if (s >= 5000)  return 'Belasting Bandiet';
  if (s >= 3000)  return 'Fiscaal Freak';
  if (s >= 1500)  return 'Aftrekpost Amateur';
  if (s >= 500)   return 'BTW Bromsnor';
  return 'Belasting Beginneling';
}

export function GameProvider({ children }) {
  const [state, setState] = useState(() => loadState());
  const [screen, setScreen] = useState('boot');
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [lang, setLang] = useState('NL');

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [awaitingMagicLink, setAwaitingMagicLink] = useState(false);

  // Path-based routing for the magic-link callback
  const isAuthCallback = typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/callback');

  useEffect(() => {
    let mounted = true;

    async function boot() {
      if (!ONLINE) {
        if (state.player) {
          setLang(state.player.uiLang || uiLangFromNationality(state.player.nationality || 'NL'));
          setScreen('dashboard');
        } else setScreen('onboarding');
        return;
      }

      const { data: { session: s } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(s);
      await hydrateForSession(s);
    }
    boot();

    if (!ONLINE) return;
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, s) => {
      if (!mounted) return;
      setSession(s);
      await hydrateForSession(s);
    });
    return () => { mounted = false; sub?.subscription?.unsubscribe?.(); };
  }, []); // eslint-disable-line

  async function hydrateForSession(s) {
    if (!s) {
      if (state.player) {
        setLang(state.player.uiLang || uiLangFromNationality(state.player.nationality || 'NL'));
        setScreen('dashboard');
      } else setScreen('onboarding');
      return;
    }

    const pending = loadPendingSignup();
    let prof = await fetchMyProfile();
    if (!prof) {
      prof = await ensureProfile({
        email: s.user.email,
        nickname: pending?.nickname,
        company_name: pending?.company,
        nationality: pending?.nationality,
        ui_lang: pending?.uiLang,
      });
    }
    clearPendingSignup();
    setProfile(prof);

    if (prof) {
      setLang(prof.ui_lang || 'NL');
      setState(s2 => ({
        ...s2,
        player: {
          email: prof.email,
          nickname: prof.nickname,
          company: prof.company_name || '',
          nationality: prof.nationality,
          uiLang: prof.ui_lang,
          createdAt: prof.created_at,
        },
      }));
      const [progress, achievements] = await Promise.all([fetchMyProgress(), fetchMyAchievements()]);
      const levels = {};
      for (const p of progress) levels[p.level] = { stars: p.best_stars, bestScore: p.best_score, attempts: 0 };
      const achMap = {};
      for (const a of achievements) achMap[a.achievement_key] = { unlockedAt: a.unlocked_at };
      setState(s2 => ({
        ...s2,
        levels,
        scoreTotal: prof.total_score,
        streakDays: prof.streak_days,
        starsTotal: Object.values(levels).reduce((a, l) => a + (l.stars || 0), 0),
        achievements: achMap,
      }));

      // After successful auth, navigate from /auth/callback → /
      if (isAuthCallback && typeof window !== 'undefined') {
        try { window.history.replaceState({}, '', '/'); } catch {}
      }
      setScreen('dashboard');
    } else {
      setScreen('onboarding');
    }
  }

  useEffect(() => { saveState(state); }, [state]);

  async function startMagicLink({ email, nickname, company, nationality, uiLang }) {
    const language = uiLang || uiLangFromNationality(nationality || 'NL');
    setLang(language);

    if (!ONLINE) {
      setState(s => ({
        ...s,
        player: {
          email: email.trim().toLowerCase(),
          nickname: nickname.trim(),
          company: (company || '').trim(),
          nationality: nationality || 'NL',
          uiLang: language,
          createdAt: new Date().toISOString(),
        },
        lastPlayedDate: todayISO(),
        streakDays: 1,
      }));
      setCurrentLevelId(1);
      setScreen('level');
      return { ok: true, offline: true };
    }

    savePendingSignup({
      email: email.trim().toLowerCase(),
      nickname: nickname.trim(),
      company: (company || '').trim(),
      nationality: nationality || 'NL',
      uiLang: language,
    });

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: 'https://lulbal.netlify.app/auth/callback',
        shouldCreateUser: true,
      },
    });
    if (error) return { ok: false, error };
    setAwaitingMagicLink(true);
    return { ok: true };
  }

  function changeLanguage(newLang) {
    setLang(newLang);
    setState(s => s.player ? { ...s, player: { ...s.player, uiLang: newLang } } : s);
  }

  function startLevel(levelId) { setCurrentLevelId(levelId); setScreen('level'); }
  function backToDashboard() { setScreen('dashboard'); }

  async function completeLevel({ levelId, score, stars, euroGained, timeSec }) {
    setState(s => {
      const prev = s.levels[levelId] || { stars: 0, bestScore: 0, attempts: 0 };
      const newStars = Math.max(prev.stars, stars);
      const newBest = Math.max(prev.bestScore, score);
      const starsDelta = newStars - prev.stars;
      const today = todayISO();
      let streak = s.streakDays;
      if (s.lastPlayedDate !== today) {
        const yest = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);
        streak = (s.lastPlayedDate === yest) ? (streak || 0) + 1 : 1;
      }
      return {
        ...s,
        levels: { ...s.levels, [levelId]: { stars: newStars, bestScore: newBest, attempts: prev.attempts + 1 } },
        starsTotal: (s.starsTotal || 0) + starsDelta,
        scoreTotal: (s.scoreTotal || 0) + score,
        euroSaved: (s.euroSaved || 0) + euroGained,
        streakDays: streak,
        lastPlayedDate: today,
      };
    });

    if (ONLINE && session) {
      try {
        await insertScore({ level: levelId, score, stars, time_seconds: timeSec || 0 });
        await upsertProgress({ level: levelId, score, stars });
        const fresh = await fetchMyProfile();
        if (fresh) setProfile(fresh);
      } catch (e) { console.warn('[LULBAL] score sync failed', e); }
    }
  }

  async function unlockAchievement(achId) {
    setState(s => {
      const have = s.achievements || {};
      if (have[achId]) return s;
      return { ...s, achievements: { ...have, [achId]: { unlockedAt: new Date().toISOString() } } };
    });
    if (ONLINE && session) unlockAchievementOnline(achId).catch(() => {});
  }

  function hasAchievement(achId) {
    return !!(state.achievements && state.achievements[achId]);
  }

  async function signOut() {
    if (ONLINE) { try { await supabase.auth.signOut(); } catch {} }
    localStorage.removeItem('lulbal.state.v1');
    setProfile(null);
    setSession(null);
    setState({
      player: null, scoreTotal: 0, euroSaved: 0, starsTotal: 0,
      streakDays: 0, lastPlayedDate: null, levels: {}, leaderboard: [],
      achievements: {},
    });
    setScreen('onboarding');
  }

  function resetAll() {
    if (confirm('Echt alles wissen? Inspecteur danst van vreugde.')) signOut();
  }

  const t = useCallback(key => tRaw(key, lang), [lang]);
  const totalScore = profile?.total_score ?? (state.scoreTotal || 0);
  const titleStr   = profile?.current_title || titleForScore(totalScore);

  const value = {
    online: ONLINE,
    session,
    profile,
    isAuthCallback,
    awaitingMagicLink, setAwaitingMagicLink,
    state, screen, setScreen,
    currentLevelId, startLevel, backToDashboard,
    startMagicLink,
    completeLevel,
    resetAll, signOut,
    title: { label: titleStr }, totalScore,
    lang, changeLanguage, t,
    unlockAchievement, hasAchievement,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame buiten provider');
  return ctx;
}

export function useT() {
  const { t, lang } = useGame();
  return { t, lang };
}
