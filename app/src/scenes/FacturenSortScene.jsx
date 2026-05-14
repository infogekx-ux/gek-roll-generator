import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import SceneFrame from '../components/SceneFrame.jsx';
import PointerDraggable from '../components/PointerDraggable.jsx';
import Confetti from '../components/Confetti.jsx';
import Lightning from '../components/Lightning.jsx';
import OmeJanPopup from '../components/OmeJanPopup.jsx';
import { sfx } from '../utils/audio.js';
import { pickInspecteurQuote } from '../data/inspecteurQuotes.js';

// Drag invoices to the right BTW bucket. Timer ticks. Mobile-first.
export default function FacturenSortScene({ scene, player, onComplete, onAbort }) {
  const { t, lang } = useGame();
  const nationality = player?.nationality || 'NL';

  const [placements, setPlacements] = useState({}); // { itemId: bucketId }
  const [results, setResults] = useState({});       // { itemId: 'correct' | 'wrong' }
  const [timeLeft, setTimeLeft] = useState(scene.timerSec);
  const [score, setScore] = useState(0);
  const [rage, setRage] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const [lightningKey, setLightningKey] = useState(0);
  const [inspecteurLine, setInspecteurLine] = useState(null);
  const [finished, setFinished] = useState(false);
  const [explainOverlay, setExplainOverlay] = useState(null);

  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) { finalize(); return; }
    const id = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, finished]); // eslint-disable-line

  function onDrop(itemId, dropZoneId) {
    if (results[itemId]) return; // already placed
    if (!dropZoneId) {
      sfx.click();
      return;
    }
    if (!scene.buckets.includes(dropZoneId)) return;
    const item = scene.items.find(i => i.id === itemId);
    const correct = item.correct === dropZoneId;

    setPlacements(p => ({ ...p, [itemId]: dropZoneId }));
    setResults(r => ({ ...r, [itemId]: correct ? 'correct' : 'wrong' }));

    if (correct) {
      sfx.correct();
      setConfettiKey(k => k + 1);
      setScore(s => s + 80);
      setRage(r => Math.min(5, r + 1));
    } else {
      sfx.wrong();
      setLightningKey(k => k + 1);
      setRage(r => Math.max(0, r - 1));
      setInspecteurLine(pickInspecteurQuote(nationality, 3));
    }

    setExplainOverlay({
      kind: correct ? 'correct' : 'wrong',
      title: correct ? `+80 ${t('points')}` : t('wrong'),
      body: item.explain?.[lang] || item.explain?.NL,
    });

    // Auto-finish if all placed
    const placedCount = Object.keys(results).length + 1;
    if (placedCount >= scene.items.length) {
      setTimeout(() => finalize(correct ? score + 80 : score), 1400);
    }
  }

  function dismissExplain() {
    sfx.click();
    setExplainOverlay(null);
  }

  function finalize(finalScore = score) {
    if (finished) return;
    setFinished(true);
    // Speed bonus
    const speedBonus = Math.round(timeLeft * 2);
    const total = finalScore + speedBonus;
    sfx.levelUp();
    setTimeout(() => {
      onComplete({
        sceneId: scene.id,
        score: total,
        maxScore: scene.maxScore,
      });
    }, 600);
  }

  const bucketLabel = (b) => {
    if (b === 'btw21') return t('fs_btw21');
    if (b === 'btw9') return t('fs_btw9');
    if (b === 'btw0') return t('fs_btw0');
    if (b === 'prive') return t('fs_prive');
    return b;
  };

  return (
    <SceneFrame
      rage={rage}
      score={score}
      timer={timeLeft}
      onStop={onAbort}
      title={t('fs_title')}
    >
      <Confetti trigger={confettiKey} />
      <Lightning trigger={lightningKey} />
      <OmeJanPopup active={!finished && !explainOverlay} minSec={14} maxSec={26} />

      <div className="scene-intro" style={{ marginBottom: 6 }}>
        {t('fs_intro')}
      </div>
      {inspecteurLine && (
        <div className="bubble bubble--inspecteur" style={{ marginBottom: 8 }}>
          {inspecteurLine}
        </div>
      )}

      <div className="invoice-stack">
        {scene.items.map(item => {
          const placedTo = placements[item.id];
          if (placedTo) return null;  // hide once placed (visualized in bucket)
          return (
            <PointerDraggable
              key={item.id}
              id={item.id}
              onDrop={onDrop}
              className="invoice-card"
            >
              <div className="invoice-icon">📄</div>
              <div className="invoice-text">{item.label?.[lang] || item.label?.NL}</div>
            </PointerDraggable>
          );
        })}
      </div>

      <div className="buckets">
        {scene.buckets.map(b => {
          const count = Object.entries(placements).filter(([, v]) => v === b).length;
          return (
            <div key={b} className="bucket" data-dropzone={b}>
              <div className="bucket-label">{bucketLabel(b)}</div>
              <div className="bucket-count">📂 {count}</div>
            </div>
          );
        })}
      </div>

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
