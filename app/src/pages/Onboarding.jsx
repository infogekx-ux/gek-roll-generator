import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { NATIONALITIES } from '../data/inspecteurQuotes.js';
import { LANGUAGES, uiLangFromNationality } from '../data/i18n.js';
import Inspecteur from '../components/Inspecteur.jsx';
import DisclaimerBar from '../components/DisclaimerBar.jsx';
import { sfx } from '../utils/audio.js';

export default function Onboarding() {
  const { startMagicLink, online, awaitingMagicLink, setAwaitingMagicLink, t, lang, changeLanguage } = useGame();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [company, setCompany] = useState('');
  const [nationality, setNationality] = useState('NL');
  const [uiLang, setUiLang] = useState(lang);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverErr, setServerErr] = useState('');
  const [magicSentTo, setMagicSentTo] = useState('');

  function onNatChange(nat) {
    setNationality(nat);
    const sug = uiLangFromNationality(nat);
    setUiLang(sug);
    changeLanguage(sug);
  }

  function onLangChange(l) { setUiLang(l); changeLanguage(l); }

  function validate() {
    const e = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('ob_emailErr');
    if (!nickname.trim() || nickname.length < 3 || nickname.length > 20) e.nickname = t('ob_nickErr');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    sfx.click();
    setServerErr('');
    if (!validate()) return;
    setSubmitting(true);
    const r = await startMagicLink({ email, nickname, company, nationality, uiLang });
    setSubmitting(false);
    if (!r.ok) { setServerErr(r.error?.message || 'server-fout'); return; }
    if (r.offline) return;
    setMagicSentTo(email.trim().toLowerCase());
  }

  // ---- "Check je mail!" screen with tappping-inspector ----
  if (awaitingMagicLink && magicSentTo) {
    return (
      <div className="app-shell">
        <div className="onb-hero" style={{ height: 230 }}>
          <div className="inspecteur-stage rage-2 inspecteur-tapping">
            <Inspecteur rage={2} size={200} />
          </div>
        </div>
        <h1 className="onb-logo" style={{ fontSize: 42, marginTop: 4 }}>📬</h1>
        <h2 style={{ textAlign: 'center', color: '#fff', marginTop: 12 }}>
          {lang === 'PL' && 'Sprawdź skrzynkę!'}
          {lang === 'EN' && 'Check your email!'}
          {lang === 'NL' && 'Check je mail!'}
        </h2>
        <p className="onb-tagline" style={{ marginBottom: 16 }}>{magicSentTo}</p>

        <div className="card">
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            {lang === 'PL' && (
              <>
                Wysłaliśmy ci link! Kliknij <strong style={{ color: 'var(--lb-yellow)' }}>SPELEN!</strong> w mailu i jesteś w grze. Bez hasła.
                <br /><br />
                <span className="muted">Nie widzisz? Sprawdź spam. Inspektor pyta gdzie jesteś.</span>
              </>
            )}
            {lang === 'EN' && (
              <>
                We sent you a link! Click <strong style={{ color: 'var(--lb-yellow)' }}>SPELEN!</strong> in the email and you're in. No password.
                <br /><br />
                <span className="muted">Not there? Check spam. The Inspector is asking where you are.</span>
              </>
            )}
            {lang === 'NL' && (
              <>
                We hebben je een link gestuurd! Klik op <strong style={{ color: 'var(--lb-yellow)' }}>SPELEN!</strong> in de mail en je bent binnen. Geen wachtwoord.
                <br /><br />
                <span className="muted">Niet zien? Check je spam. De Inspecteur vraagt al waar je blijft.</span>
              </>
            )}
          </div>
        </div>

        <button
          className="btn btn--ghost"
          onClick={() => { setAwaitingMagicLink(false); setMagicSentTo(''); }}
        >← {t('back')}</button>

        <div style={{ flex: 1 }} />
        <DisclaimerBar />
      </div>
    );
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
          <input type="email" placeholder="jij@stamkroeg.nl"
            value={email} onChange={e => setEmail(e.target.value)}
            inputMode="email" autoCapitalize="none" disabled={submitting} />
          {errors.email && <div className="field-err">{errors.email}</div>}
        </div>

        <div className={`field ${errors.nickname ? 'field--err' : ''}`}>
          <label>{t('ob_nickname')}</label>
          <input type="text" placeholder="LoodgieterLoek"
            value={nickname} onChange={e => setNickname(e.target.value)}
            maxLength={20} disabled={submitting} />
          {errors.nickname && <div className="field-err">{errors.nickname}</div>}
        </div>

        <div className="field">
          <label>{t('ob_company')}</label>
          <input type="text" value={company} onChange={e => setCompany(e.target.value)}
            maxLength={60} disabled={submitting} />
        </div>

        <div className="field">
          <label>{t('ob_nationality')}</label>
          <select value={nationality} onChange={e => onNatChange(e.target.value)} disabled={submitting}>
            {NATIONALITIES.map(n => <option key={n.code} value={n.code}>{n.label}</option>)}
          </select>
        </div>

        <div className="field">
          <label>{t('ob_language')}</label>
          <select value={uiLang} onChange={e => onLangChange(e.target.value)} disabled={submitting}>
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>

        <button className="btn btn--big" type="submit" disabled={submitting}>
          {submitting ? '...' : (online ? `📬 ${t('play')}` : t('play'))}
        </button>

        {serverErr && <div className="field-err" style={{ marginTop: 10, textAlign: 'center' }}>{serverErr}</div>}

        <p className="muted" style={{ marginTop: 14, fontSize: 12, textAlign: 'center' }}>
          {online ? (
            <>
              {lang === 'PL' && 'Wyślemy ci link mailem. Bez hasła.'}
              {lang === 'EN' && 'We\'ll email you a link. No password.'}
              {lang === 'NL' && 'We sturen je een link per mail. Geen wachtwoord.'}
              <br />
            </>
          ) : null}
          {t('ob_termsHint')}
        </p>
      </form>

      <div style={{ flex: 1 }} />
      <DisclaimerBar />
    </div>
  );
}
