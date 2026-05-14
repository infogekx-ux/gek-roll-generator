import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import SceneFrame from '../components/SceneFrame.jsx';
import Confetti from '../components/Confetti.jsx';
import Lightning from '../components/Lightning.jsx';
import OmeJanPopup from '../components/OmeJanPopup.jsx';
import Inspecteur from '../components/Inspecteur.jsx';
import { sfx } from '../utils/audio.js';
import { pickInspecteurQuote } from '../data/inspecteurQuotes.js';
import EasterEgg from '../components/EasterEgg.jsx';

// Bouwmarkt scene: tap items to add to cart, then KASSA → boss confrontation.
// Phases: 'shopping' | 'kassa' | 'boss' | 'done'

export default function BouwmarktScene({ scene, player, onComplete, onAbort }) {
  const { t, lang } = useGame();
  const nationality = player?.nationality || 'NL';

  const [phase, setPhase] = useState('shopping');
  const [cart, setCart] = useState({});           // { itemId: 'zakelijk' | 'prive' | 'cart-only' }
  const [bossIdx, setBossIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [rage, setRage] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const [lightningKey, setLightningKey] = useState(0);
  const [inspecteurLine, setInspecteurLine] = useState(scene.items ? null : null);
  const [explainOverlay, setExplainOverlay] = useState(null);

  // ---------- SHOPPING PHASE ----------
  function tapItem(item) {
    sfx.click();
    setCart(prev => {
      const has = prev[item.id];
      if (has) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }
      return { ...prev, [item.id]: 'cart-only' };
    });
  }

  function goKassa() {
    if (Object.keys(cart).length === 0) {
      sfx.wrong();
      alert(t('bm_emptyCart'));
      return;
    }
    sfx.click();
    setPhase('kassa');
  }

  // ---------- KASSA PHASE ----------
  function tagItem(itemId, tag) {
    sfx.click();
    setCart(prev => ({ ...prev, [itemId]: tag }));
  }

  function startBoss() {
    sfx.click();
    setRage(1);
    setInspecteurLine(scene.bossIntroText || null);
    setPhase('boss');
    setBossIdx(0);
  }

  // ---------- BOSS PHASE ----------
  const bossItems = scene.items.filter(it => cart[it.id]);
  const bossItem = bossItems[bossIdx];

  function bossDecide(claimBusiness) {
    if (!bossItem) return;
    const truth = bossItem.truthBusiness;
    const playerTagged = cart[bossItem.id] === 'zakelijk';
    // 'claimBusiness' = player verdedigt als zakelijk; otherwise admit private.
    const claimed = claimBusiness;
    // Correct if claim matches truth.
    const isCorrect = claimed === truth;

    if (isCorrect) {
      sfx.correct();
      setConfettiKey(k => k + 1);
      setScore(s => s + scene.defendCorrectPts);
      setRage(r => Math.min(5, r + 1));   // inspecteur wordt rooder bij elke goede verdediging
    } else {
      sfx.wrong();
      setLightningKey(k => k + 1);
      setRage(r => Math.max(0, r - 1));   // inspecteur is blij bij fout
    }

    setInspecteurLine(pickInspecteurQuote(nationality, isCorrect ? Math.min(5, rage + 1) : Math.max(0, rage - 1)));
    setExplainOverlay({
      kind: isCorrect ? 'correct' : 'wrong',
      title: isCorrect ? `+${scene.defendCorrectPts} ${t('points')}` : t('wrong'),
      body: bossItem.explain?.[lang] || bossItem.explain?.NL,
      next: () => advanceBoss(),
    });
  }

  function advanceBoss() {
    setExplainOverlay(null);
    if (bossIdx + 1 >= bossItems.length) {
      // finalize
      sfx.levelUp();
      setPhase('done');
      onComplete({
        sceneId: scene.id,
        score,
        maxScore: scene.maxScore,
      });
    } else {
      setBossIdx(i => i + 1);
    }
  }

  // ---------------- RENDER ----------------
  return (
    <SceneFrame
      rage={rage}
      score={score}
      onStop={onAbort}
      title={t('bm_title')}
      inspecteurCorner={phase !== 'boss'}
    >
      <Confetti trigger={confettiKey} />
      <Lightning trigger={lightningKey} />
      <OmeJanPopup active={phase === 'shopping' || phase === 'kassa'} minSec={15} maxSec={28} />

      {phase === 'shopping' && (
        <>
          <div className="scene-intro">{t('bm_intro')}</div>

          {/* Easter eggs verstopt in de winkel */}
          <EasterEgg
            eggId="lichtschakelaar"
            style={{ position: 'absolute', top: 60, right: 10, zIndex: 6 }}
            onCaught={() => { setRage(r => Math.min(5, r + 2)); setLightningKey(k => k + 1); }}
          />
          <EasterEgg
            eggId="koffiezetapparaat"
            style={{ position: 'absolute', top: 60, left: 10, zIndex: 6 }}
            onCaught={() => { setRage(r => Math.min(5, r + 2)); setLightningKey(k => k + 1); }}
          />

          <div className="shop-shelves">
            {scene.items.map(it => {
              const inCart = !!cart[it.id];
              return (
                <button
                  key={it.id}
                  className={`shop-item ${inCart ? 'shop-item--picked' : ''}`}
                  onClick={() => tapItem(it)}
                  aria-pressed={inCart}
                >
                  <div className="shop-emoji">{it.emoji}</div>
                  <div className="shop-name">{it.name?.[lang] || it.name?.NL}</div>
                  <div className="shop-price">€{it.price}</div>
                </button>
              );
            })}
          </div>

          <div className="cart-bar">
            <div className="cart-label">
              🛒 {t('bm_cart')}: <b>{Object.keys(cart).length}</b>
            </div>
            <button className="btn btn--big" onClick={goKassa}>
              {t('bm_checkout')}
            </button>
          </div>
        </>
      )}

      {phase === 'kassa' && (
        <>
          <div className="kassa-card">
            <h2>🛒 {t('bm_kassaTitle')}</h2>
            <p className="muted">{t('bm_kassaIntro')}</p>
          </div>
          <div className="kassa-list">
            {scene.items.filter(it => cart[it.id]).map(it => {
              const tag = cart[it.id];
              return (
                <div key={it.id} className="kassa-row">
                  <span className="kassa-emoji">{it.emoji}</span>
                  <span className="kassa-name">{it.name?.[lang] || it.name?.NL}</span>
                  <span className="kassa-price">€{it.price}</span>
                  <div className="kassa-toggle">
                    <button
                      className={`tog ${tag === 'zakelijk' ? 'tog--on' : ''}`}
                      onClick={() => tagItem(it.id, 'zakelijk')}
                    >{t('bm_zakelijk')}</button>
                    <button
                      className={`tog ${tag === 'prive' ? 'tog--off' : ''}`}
                      onClick={() => tagItem(it.id, 'prive')}
                    >{t('bm_prive')}</button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="btn btn--big btn--red"
            disabled={Object.values(cart).every(v => v === 'cart-only')}
            onClick={startBoss}
          >
            {t('bm_payConfirm')} →
          </button>
        </>
      )}

      {phase === 'boss' && bossItem && (
        <>
          <div className="boss-stage">
            <div className="boss-inspecteur">
              <Inspecteur rage={rage} size={180} />
            </div>
            {inspecteurLine && (
              <div className="bubble bubble--inspecteur">{inspecteurLine}</div>
            )}
            <div className="boss-item-card">
              <div className="boss-item-emoji">{bossItem.emoji}</div>
              <div className="boss-item-name">{bossItem.name?.[lang] || bossItem.name?.NL}</div>
              <div className="boss-item-price">€{bossItem.price}</div>
              <div className="muted">
                {t('bm_cart')}: {bossIdx + 1}/{bossItems.length}
              </div>
            </div>
          </div>

          {!explainOverlay && (
            <div className="boss-choices">
              <button className="btn btn--green btn--big" onClick={() => bossDecide(true)}>
                {t('bm_defend')}
              </button>
              <button className="btn btn--ghost btn--big" onClick={() => bossDecide(false)}>
                {t('bm_admit')}
              </button>
            </div>
          )}

          {explainOverlay && (
            <div className={`explain-card kind--${explainOverlay.kind}`}>
              <div className="explain-title">{explainOverlay.title}</div>
              <div className="explain-body">{explainOverlay.body}</div>
              <button className="btn btn--blue btn--big" onClick={explainOverlay.next}>
                {t('next')} →
              </button>
            </div>
          )}
        </>
      )}
    </SceneFrame>
  );
}
