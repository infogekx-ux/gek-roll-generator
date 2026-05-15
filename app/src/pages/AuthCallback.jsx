import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import Inspecteur from '../components/Inspecteur.jsx';

// Magic-link landing page. Supabase JS picks up the URL hash automatically
// (detectSessionInUrl: true). We just wait for onAuthStateChange to fire,
// which triggers GameContext.hydrateForSession → ensureProfile → dashboard.
export default function AuthCallback() {
  const { lang } = useGame();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Detect Supabase auth-error in URL hash, e.g. expired link.
    const hash = window.location.hash || '';
    const m = hash.match(/error_description=([^&]+)/);
    if (m) {
      try { setError(decodeURIComponent(m[1].replace(/\+/g, ' '))); }
      catch { setError(m[1]); }
    }
  }, []);

  return (
    <div className="app-shell" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="inspecteur-stage rage-1" style={{ marginTop: 40 }}>
        <Inspecteur rage={1} size={200} />
      </div>
      <h1 className="onb-logo" style={{ fontSize: 38, marginTop: 16 }}>LULBAL</h1>
      <p style={{ textAlign: 'center', color: '#fff', marginTop: 12, fontSize: 18, fontWeight: 700 }}>
        {lang === 'PL' && 'Logowanie…'}
        {lang === 'EN' && 'Logging in…'}
        {(!lang || lang === 'NL') && 'Inloggen…'}
      </p>
      <p className="muted" style={{ textAlign: 'center', marginTop: 4 }}>
        {lang === 'PL' && 'Inspektor stuka palcem w blat.'}
        {lang === 'EN' && 'Inspector taps his fingers on the desk.'}
        {(!lang || lang === 'NL') && 'De Inspecteur tikt met zijn vingers op het bureau.'}
      </p>
      {error && (
        <div className="explain-card kind--wrong" style={{ marginTop: 24, maxWidth: 380 }}>
          <div className="explain-title">Auth error</div>
          <div className="explain-body">{error}</div>
          <a className="btn btn--ghost" href="/" style={{ marginTop: 8 }}>← Terug</a>
        </div>
      )}
    </div>
  );
}
