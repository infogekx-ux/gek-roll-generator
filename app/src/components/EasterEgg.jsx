import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { rollCaught, EASTER_EGGS } from '../data/easterEggs.js';
import { pickInspecteurQuote } from '../data/inspecteurQuotes.js';
import { sfx } from '../utils/audio.js';

// Subtiel klikbaar object dat ergens in de scene zit.
// Props:
//   eggId — key in EASTER_EGGS
//   style — positie (absolute) bv { top: 8, right: 8 }
//   onCaught(line) — optioneel callback wanneer de speler betrapt is (scene mag rage spike doen)
export default function EasterEgg({ eggId, style, onCaught }) {
  const egg = EASTER_EGGS[eggId];
  const { state, unlockAchievement, hasAchievement, lang } = useGame();
  const player = state.player;
  const [usedThisSession, setUsedThisSession] = useState(false);
  const [reveal, setReveal] = useState(null);

  if (!egg) return null;

  const alreadyHave = hasAchievement(egg.id);

  function onTap(e) {
    e.preventDefault();
    e.stopPropagation();
    if (usedThisSession) return;
    setUsedThisSession(true);

    const caught = rollCaught(egg);
    if (caught) {
      sfx.wrong();
      const inspLine = pickInspecteurQuote(player?.nationality || 'NL', 3);
      setReveal({
        kind: 'caught',
        title: '👮 BETRAPT!',
        body: egg.caughtText[lang] || egg.caughtText.NL,
        inspLine,
      });
      if (onCaught) onCaught(inspLine);
    } else {
      sfx.correct();
      if (!alreadyHave) unlockAchievement(egg.id);
      setReveal({
        kind: 'unlocked',
        title: alreadyHave
          ? (lang === 'PL' ? '🎁 ZNÓW ZNALAZŁEŚ' : lang === 'EN' ? '🎁 FOUND AGAIN' : '🎁 ALWEER GEVONDEN')
          : `🏆 ${egg.title[lang] || egg.title.NL}`,
        body: egg.achText[lang] || egg.achText.NL,
      });
    }
  }

  return (
    <>
      {!usedThisSession && (
        <button
          className="easter-egg"
          style={style}
          onClick={onTap}
          aria-label={egg.name[lang] || egg.name.NL}
          title={egg.name[lang] || egg.name.NL}
        >
          <span className="easter-egg__icon">{egg.emoji}</span>
        </button>
      )}

      {reveal && (
        <div className="achievement-modal" onClick={() => setReveal(null)}>
          <div
            className={`achievement-card achievement-card--${reveal.kind}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="achievement-title">{reveal.title}</div>
            {reveal.inspLine && (
              <div className="bubble bubble--inspecteur" style={{ marginBottom: 8 }}>
                {reveal.inspLine}
              </div>
            )}
            <div className="achievement-body">{reveal.body}</div>
            <button className="btn btn--big" onClick={() => setReveal(null)}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
