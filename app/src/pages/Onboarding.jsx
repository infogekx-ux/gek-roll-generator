import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { NATIONALITIES } from '../data/inspecteurQuotes.js';
import { LANGUAGES, uiLangFromNationality } from '../data/i18n.js';
import Inspecteur from '../components/Inspecteur.jsx';
import DisclaimerBar from '../components/DisclaimerBar.jsx';
import { sfx } from '../utils/audio.js';

export default function Onboarding() {
  const { registerPlayer, t, lang, changeLanguage } = useGame();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [company, setCompany] = useState('');
  const [nationality, setNationality] = useState('NL');
  const [uiLang, setUiLang] = useState(lang);
  const [errors, setErrors] = useState({});

  // Auto-suggest UI lang when nationality changes (only if user hasn't manually picked one yet implicitly)
  function onNatChange(nat) {
    setNationality(nat);
    const suggested = uiLangFromNationality(nat);
    setUiLang(suggested);
    changeLanguage(suggested);
  }

  function onLangChange(l) {
    setUiLang(l);
    changeLanguage(l);
  }

  function validate() {
    const e = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('ob_emailErr');
    if (!nickname.trim() || nickname.length < 3) e.nickname = t('ob_nickErr');
    if (nickname.length > 20) e.nickname = t('ob_nickErr');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    sfx.click();
    if (!validate()) return;
    registerPlayer({ email, nickname, company, nationality, uiLang });
  }

  return (
    <div className="app-shell">
      <div className="onb-hero">
        <div className="inspecteur-stage rage-3">
          <Inspecteur rage={3} size={220} />
        </div>
      </div>

      <h1 className="onb-logo">LULBAL</h1>
      <p className="onb-tagline">{t('ob_tagline')}</p>

      <form onSubmit={onSubmit}>
        <div className={`field ${errors.email ? 'field--err' : ''}`}>
          <label>{t('ob_email')}</label>
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
          <label>{t('ob_nickname')}</label>
          <input
            type="text"
            placeholder="LoodgieterLoek"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            maxLength={20}
          />
          {errors.nickname && <div className="field-err">{errors.nickname}</div>}
        </div>

        <div className="field">
          <label>{t('ob_company')}</label>
          <input
            type="text"
            placeholder=""
            value={company}
            onChange={e => setCompany(e.target.value)}
            maxLength={60}
          />
        </div>

        <div className="field">
          <label>{t('ob_nationality')}</label>
          <select value={nationality} onChange={e => onNatChange(e.target.value)}>
            {NATIONALITIES.map(n => (
              <option key={n.code} value={n.code}>{n.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>{t('ob_language')}</label>
          <select value={uiLang} onChange={e => onLangChange(e.target.value)}>
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        <button className="btn btn--big" type="submit">{t('play')}</button>

        <p className="muted" style={{ marginTop: 14, fontSize: 12, textAlign: 'center' }}>
          {t('ob_termsHint')}
        </p>
      </form>

      <div style={{ flex: 1 }} />
      <DisclaimerBar />
    </div>
  );
}
