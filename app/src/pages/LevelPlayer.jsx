import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { getLevel, maxScoreForLevel } from '../data/levels.js';
import Inspecteur from '../components/Inspecteur.jsx';
import OmeJan from '../components/OmeJan.jsx';
import Confetti from '../components/Confetti.jsx';
import Lightning from '../components/Lightning.jsx';
import DisclaimerBar from '../components/DisclaimerBar.jsx';
import ShareButton from '../components/ShareButton.jsx';
import { pickInspecteurQuote } from '../data/inspecteurQuotes.js';
import { pickOmeJanQuote } from '../data/omeJanQuotes.js';
import { scenarioScore, starsFor, euroFromScore } from '../utils/scoring.js';
import { sfx } from '../utils/audio.js';

export default function LevelPlayer() {
  const { state, currentLevelId, backToDashboard, completeLevel } = useGame();
  const level = getLevel(currentLevelId);
  const nationality = state.player?.nationality || 'NL';

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [rage, setRage] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [timeLeft, setTimeLeft] = useState(level?.timerPerScenario || 25);
  const [confettiKey, setConfettiKey] = useState(0);
  const [lightningKey, setLightningKey] = useState(0);
  const [inspecteurLine, setInspecteurLine] = useState(level?.intro || '');
  const [omeJan, setOmeJan] = useState(null); // {text, isGood}
  const [gameOver, setGameOver] = useState(false);
  const [done, setDone] = useState(false);
  const [scoreBlip, setScoreBlip] = useState(null);

  const timerRef = useRef(null);
  const startedAtRef = useRef(Date.now());

  const scenario = level?.scenarios[idx];

  useEffect(() => {
    if (!scenario || chosen || done || gameOver) return;
    startedAtRef.current = Date.now();
    setTimeLeft(level.timerPerScenario);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, scenario, chosen, done, gameOver]);

  function handleTimeout() {
    if (chosen) return;
    setChosen({ id: 'timeout', kind: 'wrong', explain: 'Tijd is op. Inspecteur tikt op z\'n horloge. Dat kost je punten.' });
    setRage(r => Math.min(5, r + 1));
    setStreak(0);
    sfx.wrong();
    setLightningKey(k => k + 1);
    setInspecteurLine(pickInspecteurQuote(nationality, 3) || 'Tijd is op, joh.');
  }

  function pickAnswer(c) {
    if (chosen) return;
    clearInterval(timerRef.current);
    const timeUsed = (Date.now() - startedAtRef.current) / 1000;
    const max = level.timerPerScenario;

    if (c.kind === 'illegal') {
      sfx.illegal();
      setRage(5);
      setLightningKey(k => k + 1);
      setInspecteurLine(pickInspecteurQuote(nationality, 5) || 'GAME OVER.');
      setChosen(c);
      setTimeout(() => setGameOver(true), 1400);
      return;
    }

    const result = scenarioScore({ kind: c.kind, timeUsedSec: timeUsed, timerMax: max, streak });

    if (c.kind === 'correct') {
      sfx.correct();
      setConfettiKey(k => k + 1);
      setRage(r => Math.max(0, r - 1));
      setStreak(s => s + 1);
      setScore(s => s + result.points);
      setScoreBlip({ value: `+${result.points}`, neg: false, key: Date.now() });
      setInspecteurLine(pickInspecteurQuote(nationality, Math.max(0, rage - 1)) || 'Tjonge, dat klopt.');
    } else if (c.kind === 'dumb') {
      sfx.rage();
      setRage(r => Math.min(5, r + 1));
      setStreak(0);
      setScore(s => s + result.points);
      setScoreBlip({ value: `+${result.points}`, neg: false, key: Date.now() });
      setInspecteurLine(pickInspecteurQuote(nationality, Math.min(5, rage + 1)) || 'Nou nou nou.');
    } else {
      // wrong
      sfx.wrong();
      setLightningKey(k => k + 1);
      setRage(r => Math.min(5, r + 1));
      setStreak(0);
      setScoreBlip({ value: '+0', neg: true, key: Date.now() });
      setInspecteurLine(pickInspecteurQuote(nationality, Math.min(5, rage + 1)) || 'Doe even normaal!');
    }

    setChosen(c);
  }

  function next() {
    sfx.click();
    setChosen(null);
    setOmeJan(null);
    if (idx + 1 >= level.scenarios.length) {
      const maxScore = maxScoreForLevel(level);
      const stars = starsFor(score / maxScore);
      const euro = euroFromScore(score, stars);
      sfx.levelUp();
      completeLevel({
        levelId: level.id,
        score,
        stars,
        euroGained: euro,
      });
      setDone(true);
    } else {
      setIdx(i => i + 1);
    }
  }

  function callOmeJan() {
    sfx.click();
    setOmeJan(pickOmeJanQuote());
  }

  function callBoekhouder() {
    sfx.click();
    // Free in MVP — toon de correct answer
    const correct = scenario.choices.find(c => c.kind === 'correct');
    setOmeJan({
      text: `De Boekhouder zegt: kies "${correct.text}". Hier — zonder gekheid.`,
      isGood: true,
      isBoekhouder: true,
    });
  }

  if (!level || !scenario) {
    return (
      <div className="app-shell">
        <h2>Hmm... level niet gevonden.</h2>
        <button className="btn" onClick={backToDashboard}>Terug</button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="app-shell">
        <div className="gameover-overlay">
          <div style={{ marginBottom: 12 }}>
            <Inspecteur rage={5} size={200} />
          </div>
          <div className="gameover-title">GAME OVER</div>
          <p style={{ marginTop: 12, fontSize: 16, maxWidth: 360 }}>
            Inspecteur belt z'n manager. Jij staat met je bonnetjes in de hand.
            Belastingontduiking is geen LULBAL-werk.
          </p>
          <p className="muted" style={{ marginTop: 6 }}>
            Score: {score} pts (verlies)
          </p>
          <div style={{ marginTop: 18, width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn--red" onClick={() => {
              // Reset het level
              setIdx(0); setScore(0); setStreak(0); setRage(0);
              setChosen(null); setGameOver(false); setOmeJan(null);
              setInspecteurLine(level.intro);
            }}>
              🔄 Opnieuw proberen
            </button>
            <button className="btn btn--ghost" onClick={backToDashboard}>
              Terug naar dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    const maxScore = maxScoreForLevel(level);
    const stars = starsFor(score / maxScore);
    const euro = euroFromScore(score, stars);
    return (
      <div className="app-shell">
        <Confetti trigger={confettiKey + 1} count={80} />
        <h1 style={{ marginTop: 12, textAlign: 'center' }}>LEVEL {level.id}<br />GEKLAARD!</h1>
        <p className="muted" style={{ textAlign: 'center' }}>{level.title}</p>
        <div className="card" style={{ textAlign: 'center', marginTop: 14 }}>
          <div style={{ fontSize: 42 }}>{'⭐'.repeat(stars) + '☆'.repeat(3 - stars)}</div>
          <div className="big-num">{score} pts</div>
          <div className="muted">"Bespaard": € {(euro).toLocaleString('nl-NL')}</div>
        </div>
        <ShareButton score={score} euroSaved={euro} levelId={level.id} levelTitle={level.title} stars={stars} />
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={backToDashboard}>← Naar dashboard</button>
        </div>
        <div style={{ flex: 1 }} />
        <DisclaimerBar />
      </div>
    );
  }

  // ACTIVE SCENARIO
  return (
    <div className="app-shell">
      <Confetti trigger={confettiKey} />
      <Lightning trigger={lightningKey} />

      <div className="level-top">
        <button className="btn btn--ghost" style={{ width: 'auto', padding: '6px 10px', fontSize: 13 }} onClick={() => {
          if (confirm('Stoppen? Je voortgang in dit level gaat verloren.')) backToDashboard();
        }}>
          ← Stop
        </button>
        <div style={{ fontSize: 13, color: '#999' }}>
          Level {level.id} · vraag {idx + 1}/{level.scenarios.length}
        </div>
        <div className={`timer ${timeLeft <= 5 ? 'timer--low' : ''}`}>
          {timeLeft}s
        </div>
      </div>

      <div className="row row--between" style={{ marginBottom: 4 }}>
        <span className="tag tag--gold">Score: {score}</span>
        <span className="tag tag--red">Rage: {rage}/5</span>
        <span className="tag">🔥 streak {streak}</span>
      </div>

      <div className={`inspecteur-stage rage-${rage}`}>
        <Inspecteur rage={rage} size={150} />
      </div>

      {inspecteurLine && (
        <div className="bubble bubble--inspecteur">{inspecteurLine}</div>
      )}

      <div className="scene" style={{ position: 'relative' }}>
        {scoreBlip && (
          <div
            key={scoreBlip.key}
            className={`score-blip ${scoreBlip.neg ? 'score-blip--neg' : ''}`}
            style={{ left: '50%', top: 20, transform: 'translateX(-50%)' }}
          >
            {scoreBlip.value}
          </div>
        )}
        <div className="scene__prompt">{scenario.prompt}</div>
      </div>

      {omeJan && !chosen && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flexShrink: 0 }}>
            <OmeJan size={70} />
          </div>
          <div className="bubble bubble--omejan">{omeJan.text}</div>
        </div>
      )}

      <div className="choices">
        {scenario.choices.map(c => (
          <button
            key={c.id}
            className={`choice ${chosen?.id === c.id ? 'choice--' + c.kind : ''}`}
            onClick={() => pickAnswer(c)}
            disabled={!!chosen}
          >
            <strong style={{ marginRight: 6 }}>{c.id.toUpperCase()}.</strong>{c.text}
          </button>
        ))}
      </div>

      {!chosen && (
        <div className="row" style={{ gap: 8, marginTop: 4 }}>
          <button className="btn btn--ghost" onClick={callOmeJan} style={{ flex: 1, fontSize: 13 }}>
            🍺 Vraag Ome Jan
          </button>
          <button className="btn btn--ghost" onClick={callBoekhouder} style={{ flex: 1, fontSize: 13 }}>
            📚 Boekhouder
          </button>
        </div>
      )}

      {chosen && (
        <>
          <div className={`explain-card kind--${chosen.kind}`}>
            <div style={{ fontSize: 12, opacity: 0.7, textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 }}>
              {chosen.kind === 'correct' && '✅ Kassa!'}
              {chosen.kind === 'wrong' && '❌ Fout'}
              {chosen.kind === 'dumb' && '🟡 Dom maar legaal'}
              {chosen.kind === 'illegal' && '☠️ Illegaal'}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>
              Joh, {chosen.explain}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <button className="btn btn--blue btn--big" onClick={next}>
              {idx + 1 >= level.scenarios.length ? 'AFRONDEN →' : 'VOLGENDE →'}
            </button>
          </div>
        </>
      )}

      <div style={{ flex: 1 }} />
      <DisclaimerBar />
    </div>
  );
}
