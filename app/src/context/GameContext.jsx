import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loadState, saveState, todayISO } from '../utils/storage.js';
import { titleForStars } from '../data/titles.js';
import { t as tRaw, uiLangFromNationality } from '../data/i18n.js';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, setState] = useState(() => loadState());
  const [screen, setScreen] = useState('boot');
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [lang, setLang] = useState('NL');

  // Boot routing + initial language
  useEffect(() => {
    if (state.player) {
      setScreen('dashboard');
      const stored = state.player.uiLang || uiLangFromNationality(state.player.nationality || 'NL');
      setLang(stored);
    } else {
      setScreen('onboarding');
    }
  }, []); // eslint-disable-line

  // Persist
  useEffect(() => { saveState(state); }, [state]);

  function registerPlayer({ email, nickname, company, nationality, uiLang }) {
    const language = uiLang || uiLangFromNationality(nationality || 'NL');
    setLang(language);
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
  }

  function changeLanguage(newLang) {
    setLang(newLang);
    setState(s => s.player ? { ...s, player: { ...s.player, uiLang: newLang } } : s);
  }

  function startLevel(levelId) {
    setCurrentLevelId(levelId);
    setScreen('level');
  }

  function backToDashboard() {
    setScreen('dashboard');
  }

  function completeLevel({ levelId, score, stars, euroGained }) {
    setState(s => {
      const prev = s.levels[levelId] || { stars: 0, bestScore: 0, attempts: 0 };
      const newStars = Math.max(prev.stars, stars);
      const newBest = Math.max(prev.bestScore, score);
      const starsDelta = newStars - prev.stars;

      const today = todayISO();
      let streak = s.streakDays;
      if (s.lastPlayedDate !== today) {
        const yest = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);
        if (s.lastPlayedDate === yest) streak = (streak || 0) + 1;
        else streak = 1;
      }

      const lb = [...(s.leaderboard || [])];
      lb.push({
        nickname: s.player?.nickname || 'anon',
        company: s.player?.company || '',
        score,
        stars,
        levelId,
        when: new Date().toISOString(),
      });
      lb.sort((a, b) => b.score - a.score);
      const trimmed = lb.slice(0, 50);

      return {
        ...s,
        levels: {
          ...s.levels,
          [levelId]: {
            stars: newStars,
            bestScore: newBest,
            attempts: prev.attempts + 1,
          },
        },
        starsTotal: (s.starsTotal || 0) + starsDelta,
        scoreTotal: (s.scoreTotal || 0) + score,
        euroSaved: (s.euroSaved || 0) + euroGained,
        streakDays: streak,
        lastPlayedDate: today,
        leaderboard: trimmed,
      };
    });
  }

  function resetAll() {
    if (confirm('Echt alles wissen? Inspecteur danst van vreugde.')) {
      localStorage.removeItem('lulbal.state.v1');
      window.location.reload();
    }
  }

  function unlockAchievement(achId) {
    setState(s => {
      const have = s.achievements || {};
      if (have[achId]) return s;  // already unlocked, no-op
      return {
        ...s,
        achievements: {
          ...have,
          [achId]: { unlockedAt: new Date().toISOString() },
        },
      };
    });
  }

  function hasAchievement(achId) {
    return !!(state.achievements && state.achievements[achId]);
  }

  // Memoized translator
  const t = useCallback(key => tRaw(key, lang), [lang]);

  const value = {
    state,
    screen,
    setScreen,
    currentLevelId,
    startLevel,
    backToDashboard,
    registerPlayer,
    completeLevel,
    resetAll,
    title: titleForStars(state.starsTotal || 0),
    lang,
    changeLanguage,
    t,
    unlockAchievement,
    hasAchievement,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame buiten provider');
  return ctx;
}

// Convenience hook
export function useT() {
  const { t, lang } = useGame();
  return { t, lang };
}
