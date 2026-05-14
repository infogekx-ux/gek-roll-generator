import React from 'react';
import { useGame } from '../context/GameContext.jsx';
import { todayISO } from '../utils/storage.js';

// Duolingo-style streak banner met loss-aversion taal.
// Drie staten:
//   - 'safe'   — vandaag al gespeeld → groen "🔥 N dagen behouden"
//   - 'risk'   — vandaag nog niet → oranje "⚠️ Streak in gevaar!"
//   - 'lost'   — gisteren overgeslagen → rood "💀 Streak gebroken"
//   - 'none'   — nog geen streak → grijs "Begin een streak"
export default function StreakBanner() {
  const { state, profile, lang } = useGame();

  const days = profile?.streak_days ?? state.streakDays ?? 0;
  const lastDate = profile?.streak_last_date || state.lastPlayedDate;
  const today = todayISO();

  let status;
  if (!lastDate || days === 0) status = 'none';
  else if (lastDate === today) status = 'safe';
  else {
    const yest = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);
    status = (lastDate === yest) ? 'risk' : 'lost';
  }

  const texts = {
    safe: {
      NL: `🔥 ${days} dagen streak — vandaag binnen!`,
      EN: `🔥 ${days}-day streak — locked in today!`,
      PL: `🔥 Seria ${days} dni — dziś zaliczone!`,
    },
    risk: {
      NL: `⚠️ ${days} dagen streak! Speel vandaag, anders broken.`,
      EN: `⚠️ ${days}-day streak! Play today or lose it.`,
      PL: `⚠️ Seria ${days} dni! Zagraj dziś albo przepadnie.`,
    },
    lost: {
      NL: `💀 Streak verloren. Begin opnieuw.`,
      EN: `💀 Streak broken. Start over.`,
      PL: `💀 Seria złamana. Zacznij od nowa.`,
    },
    none: {
      NL: `🎯 Speel 1 level/dag voor je eerste streak.`,
      EN: `🎯 Play 1 level/day to start a streak.`,
      PL: `🎯 Graj 1 poziom dziennie, by zacząć serię.`,
    },
  };

  return (
    <div className={`streak-banner streak-banner--${status}`}>
      <div className="streak-banner__icon">
        {status === 'safe' && '🔥'}
        {status === 'risk' && '⚠️'}
        {status === 'lost' && '💀'}
        {status === 'none' && '🎯'}
      </div>
      <div className="streak-banner__text">{texts[status][lang] || texts[status].NL}</div>
    </div>
  );
}
