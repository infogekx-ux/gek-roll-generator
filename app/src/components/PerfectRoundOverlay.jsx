import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { sfx } from '../utils/audio.js';
import { buildShareText } from './ShareButton.jsx';

// Volledig scherm "PERFECTE RONDE!" overlay bij 3⭐.
// TikTok-shareable moment — speler kan direct delen.
export default function PerfectRoundOverlay({ open, score, levelId, levelTitle, onClose }) {
  const { state, t, lang } = useGame();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    sfx.levelUp();
    setCopied(false);
  }, [open]);

  if (!open) return null;

  const text = buildShareText({
    score,
    euroSaved: score * 10,
    levelId,
    levelTitle,
    stars: 3,
  });

  async function share() {
    sfx.click();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LULBAL — 3⭐!',
          text,
          url: 'https://lulbal.netlify.app',
        });
        return;
      } catch {}
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div className="perfect-overlay" onClick={onClose}>
      <div className="perfect-confetti" />
      <div className="perfect-card" onClick={(e) => e.stopPropagation()}>
        <div className="perfect-stars">⭐⭐⭐</div>
        <div className="perfect-title">
          {lang === 'PL' && 'PERFEKCYJNA RUNDA!'}
          {lang === 'EN' && 'PERFECT ROUND!'}
          {lang === 'NL' && 'PERFECTE RONDE!'}
        </div>
        <div className="perfect-subtitle">
          {state.player?.nickname || 'jij'} · Level {levelId} · {score} {t('points')}
        </div>
        <div className="perfect-body">
          {lang === 'PL' && 'Inspektor płacze. Wujek Janek stawia browca. Czas się pochwalić.'}
          {lang === 'EN' && 'Inspector cries. Uncle Jan owes you a beer. Time to brag.'}
          {lang === 'NL' && 'De inspecteur huilt. Ome Jan trakteert. Tijd om op te scheppen.'}
        </div>

        <button className="btn btn--big btn--green" onClick={share}>
          {copied ? '✅' : '📲'} {lang === 'PL' ? 'Pochwal się' : lang === 'EN' ? 'Brag now' : 'Schep op'}
        </button>
        <button className="btn btn--ghost" onClick={onClose}>
          {t('next')} →
        </button>
      </div>
    </div>
  );
}
