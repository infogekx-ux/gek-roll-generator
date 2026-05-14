import React from 'react';
import Inspecteur from './Inspecteur.jsx';
import { useGame } from '../context/GameContext.jsx';

// Common HUD wrapper for scenes.
// Shows: top bar (score, timer, stop), inspecteur watching from corner, content slot.
export default function SceneFrame({
  rage = 0,
  score = 0,
  timer = null,
  onStop,
  title,
  inspecteurCorner = true,
  children,
}) {
  const { t } = useGame();
  return (
    <div className="scene-frame">
      <div className="scene-hud">
        <button
          className="hud-btn"
          onClick={onStop}
          aria-label={t('stop')}
        >← {t('stop')}</button>
        <div className="hud-title">{title}</div>
        <div className="hud-meta">
          <span className="hud-score">⭐ {score}</span>
          {timer != null && (
            <span className={`hud-timer ${timer <= 10 ? 'hud-timer--low' : ''}`}>
              ⏱ {timer}s
            </span>
          )}
        </div>
      </div>

      {inspecteurCorner && (
        <div className={`inspecteur-corner inspecteur-corner--rage${rage}`}>
          <Inspecteur rage={rage} size={88} />
        </div>
      )}

      <div className="scene-body">
        {children}
      </div>
    </div>
  );
}
