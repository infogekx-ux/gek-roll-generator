import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import SceneFrame from '../components/SceneFrame.jsx';
import PointerDraggable from '../components/PointerDraggable.jsx';
import Confetti from '../components/Confetti.jsx';
import Lightning from '../components/Lightning.jsx';
import OmeJanPopup from '../components/OmeJanPopup.jsx';
import { sfx } from '../utils/audio.js';
import { pickInspecteurQuote } from '../data/inspecteurQuotes.js';

// Phases: 'income' (drag income items to boxes) → 'aftrek' (drag deductions) → 'submit'
export default function AangifteScene({ scene, player, onComplete, onAbort }) {
  const { t, lang } = useGame();
  const nationality = player?.nationality || 'NL';

  const [phase, setPhase] = useState('income');
  const [incomePlacements, setIncomePlacements] = useState({}); // { itemId: boxId | null }
  const [incomeResults, setIncomeResults] = useState({});
  const [aftrekPlacements, setAftrekPlacements] = useState({}); // { itemId: 'applied' | 'rejected' }
  const [aftrekResults, setAftrekResults] = useState({});
  const [score, setScore] = useState(0);
  const [rage, setRage] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const [lightningKey, setLightningKey] = useState(0);
  const [inspecteurLine, setInspecteurLine] = useState(null);
  const [explainOverlay, setExplainOverlay] = useState(null);

  // ----- INCOME PHASE -----
  function onIncomeDrop(itemId, dz) {
    if (incomeResults[itemId]) return;
    if (!dz) return;
    if (!scene.boxes.includes(dz)) return;
    const it = scene.incomeItems.find(i => i.id === itemId);
    const correct = it.correct === dz;
    setIncomePlacements(p => ({ ...p, [itemId]: dz }));
    setIncomeResults(r => ({ ...r, [itemId]: correct ? 'correct' : 'wrong' }));
    if (correct) {
      sfx.correct(); setConfettiKey(k => k + 1); setScore(s => s + 100);
      setRage(r => Math.min(5, r + 1));
    } else {
      sfx.wrong(); setLightningKey(k => k + 1);
      setRage(r => Math.max(0, r - 1));
      setInspecteurLine(pickInspecteurQuote(nationality, 3));
    }
    setExplainOverlay({
      kind: correct ? 'correct' : 'wrong',
      title: correct ? `+100 ${t('points')}` : t('wrong'),
      body: it.explain?.[lang] || it.explain?.NL,
    });

    if (Object.keys(incomeResults).length + 1 >= scene.incomeItems.length) {
      setTimeout(() => { setExplainOverlay(null); setPhase('aftrek'); }, 1800);
    }
  }

  // ----- AFTREK PHASE -----
  function onAftrekDecide(itemId, applyIt) {
    if (aftrekResults[itemId]) return;
    const it = scene.aftrekItems.find(i => i.id === itemId);
    const correct = applyIt === it.applies;
    setAftrekPlacements(p => ({ ...p, [itemId]: applyIt ? 'applied' : 'rejected' }));
    setAftrekResults(r => ({ ...r, [itemId]: correct ? 'correct' : 'wrong' }));
    if (correct) {
      sfx.correct(); setConfettiKey(k => k + 1); setScore(s => s + 100);
      setRage(r => Math.min(5, r + 1));
    } else {
      sfx.wrong(); setLightningKey(k => k + 1);
      setRage(r => Math.max(0, r - 1));
    }
    setExplainOverlay({
      kind: correct ? 'correct' : 'wrong',
      title: correct ? `+100 ${t('points')}` : t('wrong'),
      body: it.explain?.[lang] || it.explain?.NL,
    });
  }

  function dismissExplain() {
    setExplainOverlay(null);
    if (phase === 'aftrek' && Object.keys(aftrekResults).length >= scene.aftrekItems.length) {
      setPhase('submit');
    }
  }

  function submitForm() {
    sfx.levelUp();
    onComplete({ sceneId: scene.id, score, maxScore: scene.maxScore });
  }

  const boxLabel = (b) => {
    if (b === 'box1') return t('ag_box1');
    if (b === 'box2') return t('ag_box2');
    if (b === 'box3') return t('ag_box3');
    return b;
  };

  return (
    <SceneFrame rage={rage} score={score} onStop={onAbort} title={t('ag_title')}>
      <Confetti trigger={confettiKey} />
      <Lightning trigger={lightningKey} />
      <OmeJanPopup active={!explainOverlay} minSec={16} maxSec={28} />

      <div className="scene-intro">{t('ag_intro')}</div>

      {phase === 'income' && (
        <>
          <div className="invoice-stack">
            {scene.incomeItems.map(item => {
              if (incomePlacements[item.id]) return null;
              return (
                <PointerDraggable
                  key={item.id}
                  id={item.id}
                  onDrop={onIncomeDrop}
                  className="income-card"
                >
                  <div className="invoice-icon">💰</div>
                  <div className="invoice-text">{item.label?.[lang] || item.label?.NL}</div>
                </PointerDraggable>
              );
            })}
          </div>
          <div className="boxes">
            {scene.boxes.map(b => {
              const count = Object.entries(incomePlacements).filter(([, v]) => v === b).length;
              return (
                <div key={b} className="box-card" data-dropzone={b}>
                  <div className="box-label">{boxLabel(b)}</div>
                  <div className="box-count">📥 {count}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {phase === 'aftrek' && (
        <>
          <h3 style={{ marginTop: 10 }}>{t('ag_aftrekTitle')}</h3>
          <div className="aftrek-list">
            {scene.aftrekItems.map(it => {
              const decision = aftrekResults[it.id];
              return (
                <div key={it.id} className={`aftrek-row ${decision ? `aftrek-row--${decision}` : ''}`}>
                  <div className="aftrek-name">{it.label?.[lang] || it.label?.NL}</div>
                  {!decision && (
                    <div className="aftrek-buttons">
                      <button className="btn btn--green" onClick={() => onAftrekDecide(it.id, true)}>
                        ✅ {t('ag_applied')}
                      </button>
                      <button className="btn btn--red" onClick={() => onAftrekDecide(it.id, false)}>
                        ❌
                      </button>
                    </div>
                  )}
                  {decision && (
                    <div className="muted" style={{ fontSize: 12 }}>
                      {decision === 'correct' ? '✅' : '❌'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {phase === 'submit' && (
        <>
          <div className="explain-card kind--correct">
            <div className="explain-title">📤 {t('ag_submit')}</div>
            <div className="explain-body">
              {lang === 'NL' && 'Klaar voor verzending. 1 mei is de deadline (zonder uitstel). Druk op de knop.'}
              {lang === 'EN' && 'Ready to send. May 1 is the deadline (without extension). Press the button.'}
              {lang === 'PL' && 'Gotowe do wysłania. 1 maja to deadline (bez przedłużenia). Wciśnij przycisk.'}
            </div>
          </div>
          <button className="btn btn--green btn--big" onClick={submitForm}>
            📨 {t('ag_submit')}
          </button>
        </>
      )}

      {explainOverlay && (
        <div className={`explain-card kind--${explainOverlay.kind}`}>
          <div className="explain-title">{explainOverlay.title}</div>
          <div className="explain-body">{explainOverlay.body}</div>
          <button className="btn btn--blue btn--big" onClick={dismissExplain}>
            {t('next')} →
          </button>
        </div>
      )}
    </SceneFrame>
  );
}
