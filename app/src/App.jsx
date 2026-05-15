import React from 'react';
import { useGame } from './context/GameContext.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LevelPlayer from './pages/LevelPlayer.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import AuthCallback from './pages/AuthCallback.jsx';

export default function App() {
  const { screen, isAuthCallback } = useGame();

  if (isAuthCallback) return <AuthCallback />;

  if (screen === 'boot') {
    return (
      <div className="app-shell" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
        <div className="onb-logo">LULBAL</div>
      </div>
    );
  }

  if (screen === 'onboarding') return <Onboarding />;
  if (screen === 'level')      return <LevelPlayer />;
  if (screen === 'leaderboard') return <Leaderboard />;
  return <Dashboard />;
}
