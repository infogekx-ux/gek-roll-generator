import React from 'react';
import { useGame } from '../context/GameContext.jsx';
import { LEVELS } from '../data/levels.js';
import DisclaimerBar from '../components/DisclaimerBar.jsx';
import { sfx } from '../utils/audio.js';

export default function Dashboard() {
  const { state, startLevel, title, resetAll } = useGame();
  const player = state.player;
  const eur = (state.euroSaved || 0).toLocaleString('nl-NL');

  function lvlLocked(id) {
    if (id === 1) return false;
    if (id === 2) return false; // MVP: 1 + 2 open. Hogere locked.
    // Voor hogere levels (later toegevoegd): vereisen 2*(N-1) sterren
    return true;
  }

  function onPlay(id) {
    if (lvlLocked(id)) {
      sfx.wrong();
      return;
    }
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
      </div>

      <div className="card">
        <div className="muted">Totaal "bespaarde" belasting</div>
        <div className="big-num">€ {eur}</div>
        <div className="muted" style={{ marginTop: 4 }}>
          {state.starsTotal || 0} ⭐ verzameld · {state.scoreTotal || 0} pts totaal
        </div>
      </div>

      <h3 style={{ margin: '14px 0 8px' }}>Levels</h3>
      <div className="level-grid">
        {Array.from({ length: 10 }).map((_, i) => {
          const id = i + 1;
          const lvl = LEVELS.find(l => l.id === id);
          const locked = lvlLocked(id);
          const stars = state.levels?.[id]?.stars || 0;
          return (
            <button
              key={id}
              className={`level-tile ${locked ? 'level-tile--locked' : 'level-tile--unlocked'}`}
              onClick={() => onPlay(id)}
              disabled={locked}
            >
              <div className="level-tile__num">{id}</div>
              <div style={{ fontSize: 11, lineHeight: 1.1, minHeight: 28 }}>
                {lvl ? lvl.title : 'Coming soon'}
              </div>
              <div className="stars">
                {locked ? '🔒' : '⭐'.repeat(stars) + '☆'.repeat(3 - stars)}
              </div>
            </button>
          );
        })}
      </div>

      <div className="weekly-card" style={{ marginTop: 14 }}>
        <h3>🗓️ Weekly Challenge</h3>
        <div style={{ fontSize: 14, marginTop: 4 }}>
          <strong>Level 2 — BTW basics in &lt; 60s</strong>
        </div>
        <div className="muted" style={{ color: '#FFC107' }}>
          Sponsor: Jouw lokale boekhouder (coming soon)
        </div>
        <div className="muted" style={{ color: '#fff', marginTop: 4 }}>
          Prijs: 1u gratis advies (binnenkort echt)
        </div>
      </div>

      <h3 style={{ margin: '14px 0 8px' }}>🏆 Leaderboard (lokaal)</h3>
      <div className="card">
        {lb.length === 0 && <div className="muted">Nog niemand. Wees jij de eerste. Of de enige.</div>}
        {lb.map((row, i) => {
          const me = row.nickname === player?.nickname;
          return (
            <div key={i} className={`leaderboard-row ${me ? 'leaderboard-row--me' : ''}`}>
              <div>
                <strong>#{i + 1}</strong> {row.nickname}
                {row.company ? <span className="muted"> · {row.company}</span> : null}
              </div>
              <div>{row.score} <span className="muted">pts</span></div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn btn--ghost" onClick={resetAll}>
          🧨 Reset alles (alleen voor dappere zielen)
        </button>
      </div>

      <div style={{ flex: 1 }} />
      <DisclaimerBar />
    </div>
  );
}
