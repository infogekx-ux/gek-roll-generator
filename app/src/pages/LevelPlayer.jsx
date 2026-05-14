import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { getLevelNew } from '../data/scenes.js';
import BouwmarktScene from '../scenes/BouwmarktScene.jsx';
import FacturenSortScene from '../scenes/FacturenSortScene.jsx';
import BrievenbusScene from '../scenes/BrievenbusScene.jsx';
import AangifteScene from '../scenes/AangifteScene.jsx';
import DisclaimerBar from '../components/DisclaimerBar.jsx';
import Confetti from '../components/Confetti.jsx';
import ShareButton from '../components/ShareButton.jsx';
import { starsFor, euroFromScore } from '../utils/scoring.js';
import { sfx } from '../utils/audio.js';

const SCENE_COMPONENTS = {
  bouwmarkt: BouwmarktScene,
  sort: FacturenSortScene,
  mailbox: BrievenbusScene,
  aangifte: AangifteScene,
};

export default function LevelPlayer() {
  const { state, currentLevelId, backToDashboard, completeLevel, t, lang } = useGame();
  const level = getLevelNew(currentLevelId);

  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneScores, setSceneScores] = useState([]); // [{ sceneId, score, maxScore }]
  const [done, setDone] = useState(false);

  if (!level) {
    return (
      <div className="app-shell">
        <h2 style={{ marginTop: 24 }}>Hmm... level niet gevonden.</h2>
        <button className="btn" onClick={backToDashboard}>← {t('back')}</button>
      </div>
    );
  }

  const totalMax = level.scenes.reduce((a, s) => a + s.maxScore, 0);
  const totalScore = sceneScores.reduce((a, s) => a + s.score, 0);

  function onSceneComplete(result) {
    sfx.click();
    const updated = [...sceneScores, result];
    setSceneScores(updated);
    if (sceneIdx + 1 >= level.scenes.length) {
      // Final
      const final = updated.reduce((a, s) => a + s.score, 0);
      const stars = starsFor(final / totalMax);
      const euro = euroFromScore(final, stars);
      completeLevel({ levelId: level.id, score: final, stars, euroGained: euro, timeSec: 0 });
      setDone(true);
    } else {
      setSceneIdx(i => i + 1);
    }
  }

  function onAbort() {
    if (confirm(lang === 'NL' ? 'Stoppen? Je voortgang in dit level gaat verloren.'
              : lang === 'EN' ? 'Stop? You lose level progress.'
              : 'Zatrzymać? Stracisz postęp w tym poziomie.')) {
      backToDashboard();
    }
  }

  if (done) {
    const stars = starsFor(totalScore / totalMax);
    const euro = euroFromScore(totalScore, stars);
    const titleStr = level.title?.[lang] || level.title?.NL;
    return (
      <div className="app-shell">
        <Confetti trigger={1} count={120} />
        <h1 style={{ marginTop: 16, textAlign: 'center' }}>{t('levelComplete')}</h1>
        <p className="muted" style={{ textAlign: 'center', fontSize: 18 }}>{titleStr}</p>
        <div className="card" style={{ textAlign: 'center', marginTop: 14 }}>
          <div style={{ fontSize: 42 }}>{'⭐'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
          <div className="big-num">{totalScore} {t('points')}</div>
          <div className="muted">"{lang === 'PL' ? 'Zaoszczędzono' : lang === 'EN' ? 'Saved' : 'Bespaard'}": € {(euro).toLocaleString('nl-NL')}</div>
        </div>
        <ShareButton
          score={totalScore}
          euroSaved={euro}
          levelId={level.id}
          levelTitle={titleStr}
          stars={stars}
        />
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={backToDashboard}>← {t('dashboard')}</button>
        </div>
        <div style={{ flex: 1 }} />
        <DisclaimerBar />
      </div>
    );
  }

  const scene = level.scenes[sceneIdx];
  const SceneComp = SCENE_COMPONENTS[scene.type];

  if (!SceneComp) {
    return (
      <div className="app-shell">
        <h2 style={{ marginTop: 24 }}>Scene-type "{scene.type}" niet geïmplementeerd.</h2>
        <button className="btn" onClick={backToDashboard}>← {t('back')}</button>
      </div>
    );
  }

  return (
    <SceneComp
      scene={scene}
      player={state.player}
      onComplete={onSceneComplete}
      onAbort={onAbort}
    />
  );
}
