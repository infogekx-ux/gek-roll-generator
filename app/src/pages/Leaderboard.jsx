import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { NATIONALITIES } from '../data/inspecteurQuotes.js';
import {
  fetchGlobalLeaderboard,
  fetchWeeklyLeaderboard,
  fetchLeaderboardByNationality,
} from '../lib/supabase.js';
import DisclaimerBar from '../components/DisclaimerBar.jsx';
import { sfx } from '../utils/audio.js';

const FLAGS = Object.fromEntries(NATIONALITIES.map(n => [n.code, n.label.split(' ')[0]]));

export default function Leaderboard() {
  const { backToDashboard, online, profile, lang, t } = useGame();
  const [tab, setTab] = useState('global');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [natFilter, setNatFilter] = useState(profile?.nationality || 'NL');

  async function load() {
    if (!online) { setRows([]); return; }
    setLoading(true);
    try {
      let data = [];
      if (tab === 'global') {
        data = await fetchGlobalLeaderboard(100);
      } else if (tab === 'weekly') {
        const raw = await fetchWeeklyLeaderboard(50);
        data = raw.map(r => ({
          id: r.user?.id,
          nickname: r.user?.nickname,
          company_name: r.user?.company_name,
          nationality: r.user?.nationality,
          current_title: r.user?.current_title,
          total_score: r.total_score,
        }));
      } else if (tab === 'country') {
        data = await fetchLeaderboardByNationality(natFilter, 100);
      }
      setRows(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [tab, natFilter]); // eslint-disable-line

  function onTab(name) {
    sfx.click();
    setTab(name);
  }

  return (
    <div className="app-shell">
      <div className="dash-hero" style={{ paddingTop: 10, paddingBottom: 10 }}>
        <button className="btn btn--ghost" onClick={backToDashboard} style={{ width: 'auto', padding: '6px 10px', fontSize: 13 }}>
          ← {t('back')}
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', color: 'var(--lb-yellow)' }}>🏆 LEADERBOARD</h2>
        <span style={{ width: 56 }} />
      </div>

      <div className="lb-tabs">
        <button className={`lb-tab ${tab === 'global' ? 'lb-tab--active' : ''}`} onClick={() => onTab('global')}>
          🌐 {lang === 'PL' ? 'Globalny' : 'Global'}
        </button>
        <button className={`lb-tab ${tab === 'weekly' ? 'lb-tab--active' : ''}`} onClick={() => onTab('weekly')}>
          🗓️ {lang === 'PL' ? 'Tygodniowy' : 'Weekly'}
        </button>
        <button className={`lb-tab ${tab === 'country' ? 'lb-tab--active' : ''}`} onClick={() => onTab('country')}>
          🏁 {lang === 'PL' ? 'Kraj' : 'Country'}
        </button>
      </div>

      {tab === 'country' && (
        <div className="field" style={{ marginTop: 6 }}>
          <select value={natFilter} onChange={e => setNatFilter(e.target.value)}>
            {NATIONALITIES.map(n => (
              <option key={n.code} value={n.code}>{n.label}</option>
            ))}
          </select>
        </div>
      )}

      <div className="card">
        {!online && (
          <div className="muted" style={{ fontSize: 13 }}>
            {lang === 'PL' && 'Brak połączenia. Ranking online nie dostępny.'}
            {lang === 'EN' && 'Offline. Online leaderboard unavailable.'}
            {lang === 'NL' && 'Offline. Online leaderboard niet beschikbaar.'}
          </div>
        )}
        {online && loading && <div className="muted">…</div>}
        {online && !loading && rows.length === 0 && (
          <div className="muted">
            {lang === 'PL' && 'Pusto. Bądź pierwszy!'}
            {lang === 'EN' && 'Empty. Be the first!'}
            {lang === 'NL' && 'Leeg. Wees jij de eerste!'}
          </div>
        )}
        {online && !loading && rows.map((row, i) => {
          const me = profile?.id === row.id;
          return (
            <div key={row.id || i} className={`leaderboard-row ${me ? 'leaderboard-row--me' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                <span style={{ width: 28, fontWeight: 700, color: i < 3 ? 'var(--lb-yellow)' : '#888' }}>
                  {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                </span>
                <span style={{ fontSize: 16 }}>{FLAGS[row.nationality] || '🌐'}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.nickname}
                  </div>
                  {row.company_name && (
                    <div className="muted" style={{ fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {row.company_name}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--lb-yellow)', fontWeight: 700 }}>
                  {row.total_score}
                </div>
                <div className="muted" style={{ fontSize: 10 }}>{row.current_title}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />
      <DisclaimerBar />
    </div>
  );
}
