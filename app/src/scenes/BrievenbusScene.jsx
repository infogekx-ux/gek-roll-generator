import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import SceneFrame from '../components/SceneFrame.jsx';
import Confetti from '../components/Confetti.jsx';
import Lightning from '../components/Lightning.jsx';
import OmeJanPopup from '../components/OmeJanPopup.jsx';
import { sfx } from '../utils/audio.js';
import { pickInspecteurQuote } from '../data/inspecteurQuotes.js';
import EasterEgg from '../components/EasterEgg.jsx';

// Phases: 'mailbox' | 'envelope' | 'letter' | 'consequence'
export default function BrievenbusScene({ scene, player, onComplete, onAbort }) {
  const { t, lang } = useGame();
  const nationality = player?.nationality || 'NL';

  const [phase, setPhase] = useState('mailbox');
  const [score, setScore] = useState(0);
  const [rage, setRage] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const [lightningKey, setLightningKey] = useState(0);
  const [chosen, setChosen] = useState(null);

  function openMailbox() {
    sfx.click();
    setPhase('envelope');
  }

  function openEnvelope() {
    sfx.click();
    setPhase('letter');
  }

  function chooseAction(opt) {
    sfx.click();
    setChosen(opt);
    let newScore = score + Math.max(0, opt.points);
    if (opt.kind === 'good') {
      sfx.correct();
      setConfettiKey(k => k + 1);
      setRage(r => Math.min(5, r + 1));
    } else if (opt.kind === 'bad') {
      sfx.wrong();
      setLightningKey(k => k + 1);
      setRage(5);
    } else {
      sfx.click();
      setRage(2);
    }
    setScore(newScore);
    setPhase('consequence');
  }

  function finish() {
    onComplete({ sceneId: scene.id, score, maxScore: scene.maxScore });
  }

  return (
    <SceneFrame rage={rage} score={score} onStop={onAbort} title={t('bv_title')}>
      <Confetti trigger={confettiKey} />
      <Lightning trigger={lightningKey} />
      <OmeJanPopup active={phase === 'mailbox' || phase === 'envelope'} minSec={18} maxSec={30} />

      {phase === 'mailbox' && (
        <>
          <div className="scene-intro">{t('bv_intro')}</div>

          <EasterEgg
            eggId="telefoon"
            style={{ position: 'absolute', bottom: 80, right: 12, zIndex: 6 }}
            onCaught={() => { setRage(r => Math.min(5, r + 2)); setLightningKey(k => k + 1); }}
          />
          <EasterEgg
            eggId="biertje"
            style={{ position: 'absolute', bottom: 80, left: 12, zIndex: 6 }}
            onCaught={() => { setRage(r => Math.min(5, r + 1)); setLightningKey(k => k + 1); }}
          />

          <div className="mailbox-scene">
            <div className="mailbox-house">🏠</div>
            <button className="mailbox-btn" onClick={openMailbox}>
              <svg viewBox="0 0 120 100" width="160" height="130">
                {/* mailbox */}
                <rect x="20" y="20" width="80" height="60" rx="6" fill="#0046A8" stroke="#000" strokeWidth="4" />
                <rect x="20" y="40" width="80" height="6" fill="#000" />
                <rect x="55" y="50" width="10" height="20" fill="#000" />
                <rect x="58" y="0" width="4" height="20" fill="#000" />
                <circle cx="60" cy="0" r="8" fill="#E53935" stroke="#000" strokeWidth="3" />
                <text x="60" y="70" textAnchor="middle" fontFamily="Bebas Neue" fontSize="14" fill="#fff">PTT</text>
              </svg>
              <div className="muted">{t('bv_openMailbox')}</div>
            </button>
          </div>
        </>
      )}

      {phase === 'envelope' && (
        <>
          <div className="scene-intro">{t('bv_intro')}</div>
          <button className="envelope-card" onClick={openEnvelope}>
            <svg viewBox="0 0 280 180" width="240" height="155">
              <rect x="10" y="10" width="260" height="160" rx="6" fill="#0046A8" stroke="#000" strokeWidth="5" />
              <path d="M 10 10 L 140 100 L 270 10" fill="none" stroke="#000" strokeWidth="4" />
              <rect x="190" y="22" width="60" height="40" fill="#fff" stroke="#000" strokeWidth="2" />
              <text x="220" y="48" textAnchor="middle" fontFamily="Inter" fontSize="10" fill="#000">€0.96</text>
              <text x="140" y="155" textAnchor="middle" fontFamily="Bebas Neue" fontSize="18" fill="#FFC107">BELASTINGDIENST</text>
            </svg>
            <div className="muted">{t('bv_openEnv')} ✉️</div>
          </button>
        </>
      )}

      {phase === 'letter' && (
        <>
          <div className="letter-card">
            <h2>{t('bv_letterHead')}</h2>
            <p className="big-num" style={{ fontSize: 32 }}>€ 4.500</p>
            <p>{t('bv_letterBody')}</p>
            <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
              Belastingdienst · {new Date().toISOString().slice(0, 10)}
            </div>
          </div>
          <div className="col" style={{ gap: 8 }}>
            <button className="btn btn--green btn--big" onClick={() => chooseAction(scene.options.find(o => o.id === 'pay'))}>
              💶 {t('bv_pay')}
            </button>
            <button className="btn btn--blue btn--big" onClick={() => chooseAction(scene.options.find(o => o.id === 'object'))}>
              ⚖️ {t('bv_object')}
            </button>
            <button className="btn btn--red btn--big" onClick={() => chooseAction(scene.options.find(o => o.id === 'ignore'))}>
              🙈 {t('bv_ignore')}
            </button>
          </div>
        </>
      )}

      {phase === 'consequence' && chosen && (
        <>
          <div className={`explain-card kind--${chosen.kind === 'bad' ? 'wrong' : chosen.kind === 'good' ? 'correct' : 'dumb'}`}>
            <div className="explain-title">
              {chosen.kind === 'good' && `+${chosen.points} ${t('points')}`}
              {chosen.kind === 'ok' && `+${chosen.points} ${t('points')}`}
              {chosen.kind === 'bad' && t('wrong')}
            </div>
            <div className="explain-body" style={{ marginBottom: 8 }}>
              {t(chosen.consequenceKey)}
            </div>
            <div className="explain-body">
              {chosen.explain?.[lang] || chosen.explain?.NL}
            </div>
          </div>

          {chosen.kind === 'bad' && (
            <div className="boete-banner">
              💸 +€469 verzuimboete
            </div>
          )}

          <button className="btn btn--big btn--blue" onClick={finish}>
            {t('next')} →
          </button>
        </>
      )}
    </SceneFrame>
  );
}
