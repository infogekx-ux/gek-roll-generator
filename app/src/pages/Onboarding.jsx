import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { NATIONALITIES } from '../data/inspecteurQuotes.js';
import Inspecteur from '../components/Inspecteur.jsx';
import DisclaimerBar from '../components/DisclaimerBar.jsx';
import { sfx } from '../utils/audio.js';

export default function Onboarding() {
  const { registerPlayer } = useGame();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [company, setCompany] = useState('');
  const [nationality, setNationality] = useState('NL');
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Echte email, joh.';
    if (!nickname.trim() || nickname.length < 3) e.nickname = 'Min 3 tekens.';
    if (nickname.length > 20) e.nickname = 'Max 20 tekens.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    sfx.click();
    if (!validate()) return;
    registerPlayer({ email, nickname, company, nationality });
  }

  return (
    <div className="app-shell">
      <div className="onb-hero">
        <div className="inspecteur-stage rage-3">
          <Inspecteur rage={3} size={240} />
        </div>
      </div>

      <h1 className="onb-logo">LULBAL</h1>
      <p className="onb-tagline">"Speel met je belasting"</p>

      <form onSubmit={onSubmit}>
        <div className={`field ${errors.email ? 'field--err' : ''}`}>
          <label>E-mail</label>
          <input
            type="email"
            placeholder="jij@stamkroeg.nl"
            value={email}
            onChange={e => setEmail(e.target.value)}
            inputMode="email"
            autoCapitalize="none"
          />
          {errors.email && <div className="field-err">{errors.email}</div>}
        </div>

        <div className={`field ${errors.nickname ? 'field--err' : ''}`}>
          <label>Nickname</label>
          <input
            type="text"
            placeholder="Bijv. Loodgieter_Loek"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            maxLength={20}
          />
          {errors.nickname && <div className="field-err">{errors.nickname}</div>}
        </div>

        <div className="field">
          <label>Bedrijfsnaam (optioneel — voor de ranking)</label>
          <input
            type="text"
            placeholder="Bijv. Loek Loodgieters BV"
            value={company}
            onChange={e => setCompany(e.target.value)}
            maxLength={60}
          />
        </div>

        <div className="field">
          <label>Nationaliteit (de inspecteur vloekt in jouw taal)</label>
          <select value={nationality} onChange={e => setNationality(e.target.value)}>
            {NATIONALITIES.map(n => (
              <option key={n.code} value={n.code}>{n.label}</option>
            ))}
          </select>
        </div>

        <button className="btn btn--big" type="submit">SPELEN!</button>

        <p className="muted" style={{ marginTop: 14, fontSize: 12, textAlign: 'center' }}>
          Door op SPELEN te klikken ga je akkoord met de huisregels. <br />
          Je bent ≥16 jaar. Inspecteur is fictief. Beetje.
        </p>
      </form>

      <div style={{ flex: 1 }} />
      <DisclaimerBar />
    </div>
  );
}
