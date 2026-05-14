import React from 'react';
import { useGame } from '../context/GameContext.jsx';
import { getLevelNew, LEVELS_NEW } from '../data/scenes.js';
import { LANGUAGES } from '../data/i18n.js';
import { EASTER_EGGS, eggsList } from '../data/easterEggs.js';
import DisclaimerBar from '../components/DisclaimerBar.jsx';
import { sfx } from '../utils/audio.js';

export default function Dashboard() {
  const { state, startLevel, title, resetAll, t, lang, changeLanguage } = useGame();
  const player = state.player;
  const eur = (state.euroSaved || 0).toLocaleString('nl-NL');

  function lvlLocked(id) {
    if (id === 1) return false;
    if (id === 2) return false;
    return true;
  }

  function onPlay(id) {
    if (lvlLocked(id)) { sfx.wrong(); return; }
    sfx.click();
    startLevel(id);
  }

  const lb = (state.leaderboard || []).slice(0, 10);

  return (
    <div className="app-shell">
      <div className="dash-hero">
        <div className="avatar-circle">{player?.nickname?.[0]?.toUpperCase() || '?'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{player?.nickname}</div>
          {player?.company ? <div className="muted">{player.company}</div> : null}
          <div className="row" style={{ gap: 6, marginTop: 4 }}>
            <span className="tag tag--gold">{title.label}</span>
            <span className="tag">🔥 {state.streakDays || 0}d</span>
          </div>
        </div>
        <select
          value={lang}
          onChange={(e) => changeLanguage(e.target.value)}
          style={{
            background: '#222', color: '#fff', border: '1px solid #444',
            padding: '4px 8px', borderRadius: 8, fontSize: 12
          }}
        >
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.code}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="muted">{t('d_saved')}</div>
        <div className="big-num">€ {eur}</div>
        <div className="muted" style={{ marginTop: 4 }}>
          {state.starsTotal || 0} ⭐ · {state.scoreTotal || 0} {t('points')}
        </div>
      </div>

      <h3 style={{ margin: '14px 0 8px' }}>{t('d_levels')}</h3>
      <div className="level-grid">
        {Array.from({ length: 10 }).map((_, i) => {
          const id = i + 1;
          const lvl = getLevelNew(id);
          const locked = lvlLocked(id);
          const stars = state.levels?.[id]?.stars || 0;
          const ttl = lvl ? (lvl.title?.[lang] || lvl.title?.NL) : 'Coming soon';
          return (
            <button
              key={id}
              className={`level-tile ${locked ? 'level-tile--locked' : 'level-tile--unlocked'}`}
              onClick={() => onPlay(id)}
              disabled={locked}
            >
              <div className="level-tile__num">{id}</div>
              <div style={{ fontSize: 11, lineHeight: 1.1, minHeight: 28 }}>{ttl}</div>
              <div className="stars">
                {locked ? '🔒' : '⭐'.repeat(stars) + '☆'.repeat(3 - stars)}
              </div>
            </button>
          );
        })}
      </div>

      <div className="weekly-card" style={{ marginTop: 14 }}>
        <h3>{t('d_weekly')}</h3>
        <div style={{ fontSize: 14, marginTop: 4 }}>
          <strong>{t('d_weeklyDesc')}</strong>
        </div>
        <div className="muted" style={{ color: '#FFC107' }}>
          {t('d_weeklySpon')}
        </div>
      </div>

      <h3 style={{ margin: '14px 0 8px' }}>
        🏆 {lang === 'PL' ? 'Odznaki' : lang === 'EN' ? 'Achievements' : 'Achievements'}
        {' '}
        <span className="muted">({Object.keys(state.achievements || {}).length} / {eggsList().length})</span>
      </h3>
      <div className="card">
        <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
          {lang === 'PL' && 'Stukaj w ukryte obiekty w scenach. 30–50% szansy na wpadkę.'}
          {lang === 'EN' && 'Tap hidden objects in scenes. 30–50% chance of getting caught.'}
          {lang === 'NL' && 'Tik op verborgen objecten in scenes. 30–50% kans op betrapping.'}
        </div>
        <div className="achievements-row">
          {eggsList().map(egg => {
            const have = !!(state.achievements && state.achievements[egg.id]);
            return (
              <span key={egg.id} className={`ach-pill ${have ? '' : 'ach-pill--locked'}`}>
                {have ? egg.emoji : '🔒'}{' '}
                {have ? (egg.title[lang] || egg.title.NL) : '???'}
              </span>
            );
          })}
        </div>
      </div>

      <h3 style={{ margin: '14px 0 8px' }}>{t('d_leader')}</h3>
      <div className="card">
        {lb.length === 0 && <div className="muted">{t('d_leaderEmpty')}</div>}
        {lb.map((row, i) => {
          const me = row.nickname === player?.nickname;
          return (
            <div key={i} className={`leaderboard-row ${me ? 'leaderboard-row--me' : ''}`}>
              <div>
                <strong>#{i + 1}</strong> {row.nickname}
                {row.company ? <span className="muted"> · {row.company}</span> : null}
              </div>
              <div>{row.score} <span className="muted">{t('points')}</span></div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn btn--ghost" onClick={resetAll}>
          {t('d_resetAll')}
        </button>
      </div>

      <div style={{ flex: 1 }} />
      <DisclaimerBar />
    </div>
  );
}
