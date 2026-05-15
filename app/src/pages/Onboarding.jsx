import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { NATIONALITIES } from '../data/inspecteurQuotes.js';
import { LANGUAGES, uiLangFromNationality } from '../data/i18n.js';
import Inspecteur from '../components/Inspecteur.jsx';
import DisclaimerBar from '../components/DisclaimerBar.jsx';
import { sfx } from '../utils/audio.js';

export default function Onboarding() {
  const { startMagicLink, verifyOtpCode, online, awaitingMagicLink, setAwaitingMagicLink, t, lang, changeLanguage } = useGame();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [company, setCompany] = useState('');
  const [nationality, setNationality] = useState('NL');
  const [uiLang, setUiLang] = useState(lang);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverErr, setServerErr] = useState('');
  const [magicSentTo, setMagicSentTo] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // 60s cooldown on resend
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const id = setTimeout(() => setResendCountdown(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendCountdown]);

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

  async function onSubmit(ev) {
    ev.preventDefault();
    sfx.click();
    if (!validate()) return;
    setSubmitting(true);
    setServerErr('');
    const result = await startMagicLink({ email, nickname, company, nationality, uiLang });
    setSubmitting(false);
    if (!result.ok) {
      setServerErr(result.error?.message || 'Server-fout, probeer opnieuw.');
      return;
    }
    if (result.offline) {
      // Offline — direct naar level
      return;
    }
    setMagicSentTo(email.trim().toLowerCase());
    setResendCountdown(60);
  }

  async function onVerifyCode(ev) {
    ev.preventDefault();
    sfx.click();
    setServerErr('');
    if (otpCode.length !== 6) {
      setServerErr(lang === 'PL' ? '6 cyfr.' : lang === 'EN' ? '6 digits.' : '6 cijfers.');
      return;
    }
    setVerifying(true);
    const result = await verifyOtpCode(otpCode);
    setVerifying(false);
    if (!result.ok) {
      setServerErr(
        result.error?.message?.includes('expired')
          ? (lang === 'PL' ? 'Kod wygasł. Wyślij nowy.' : lang === 'EN' ? 'Code expired. Send a new one.' : 'Code verlopen. Vraag nieuwe aan.')
          : (lang === 'PL' ? 'Zły kod. Spróbuj ponownie.' : lang === 'EN' ? 'Wrong code. Try again.' : 'Foute code. Probeer opnieuw.')
      );
      return;
    }
    // success — onAuthStateChange takes over from here
  }

  async function onResend() {
    if (resendCountdown > 0) return;
    sfx.click();
    setServerErr('');
    setOtpCode('');
    const result = await startMagicLink({ email: magicSentTo, nickname, company, nationality, uiLang });
    if (result.ok) {
      setResendCountdown(60);
    } else {
      setServerErr(result.error?.message || 'Server-fout.');
    }
  }

  // ---- "Voer code in" screen ----
  if (awaitingMagicLink && magicSentTo) {
    return (
      <div className="app-shell">
        <div className="onb-hero" style={{ height: 200 }}>
          <div className="inspecteur-stage rage-1">
            <Inspecteur rage={1} size={170} />
          </div>
        </div>
        <h1 className="onb-logo" style={{ fontSize: 42 }}>📬</h1>
        <h2 style={{ textAlign: 'center', color: '#fff', marginTop: 12 }}>
          {lang === 'PL' && 'Wpisz kod z maila'}
          {lang === 'EN' && 'Enter the code'}
          {lang === 'NL' && 'Voer de code in'}
        </h2>
        <p className="onb-tagline" style={{ marginBottom: 12, marginTop: 4 }}>{magicSentTo}</p>

        <form onSubmit={onVerifyCode}>
          <div className="field">
            <label>
              {lang === 'PL' && '6-cyfrowy kod'}
              {lang === 'EN' && '6-digit code'}
              {lang === 'NL' && '6-cijferige code'}
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              value={otpCode}
              onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={verifying}
              autoFocus
              style={{
                fontSize: 32,
                textAlign: 'center',
                letterSpacing: 8,
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 700,
              }}
            />
          </div>

          <button
            className="btn btn--big"
            type="submit"
            disabled={verifying || otpCode.length !== 6}
          >
            {verifying ? '...' : (
              lang === 'PL' ? 'WEJDŹ DO GRY' : lang === 'EN' ? 'ENTER GAME' : 'NAAR HET SPEL'
            )}
          </button>

          {serverErr && (
            <div className="field-err" style={{ marginTop: 10, textAlign: 'center' }}>
              {serverErr}
            </div>
          )}
        </form>

        <div className="card" style={{ marginTop: 14, fontSize: 13, lineHeight: 1.5 }}>
          {lang === 'PL' && (
            <>
              Sprawdź skrzynkę (i spam). Mail jest od <code>noreply@mail.app.supabase.io</code> z 6-cyfrowym kodem.
              <br /><br />
              <span className="muted">Link w mailu możesz zignorować — wpisz tutaj sam kod.</span>
            </>
          )}
          {lang === 'EN' && (
            <>
              Check your inbox (and spam). The email is from <code>noreply@mail.app.supabase.io</code> with a 6-digit code.
              <br /><br />
              <span className="muted">Ignore the link in the email — type the code here.</span>
            </>
          )}
          {lang === 'NL' && (
            <>
              Check je inbox (en spam). Mail komt van <code>noreply@mail.app.supabase.io</code> met een 6-cijferige code.
              <br /><br />
              <span className="muted">De link in de mail mag je negeren — typ hier alleen de code.</span>
            </>
          )}
        </div>

        <button
          className="btn btn--ghost"
          onClick={onResend}
          disabled={resendCountdown > 0}
          style={{ marginTop: 10 }}
        >
          {resendCountdown > 0
            ? (lang === 'PL' ? `Nowy kod za ${resendCountdown}s` : lang === 'EN' ? `Resend in ${resendCountdown}s` : `Nieuwe code over ${resendCountdown}s`)
            : (lang === 'PL' ? '↻ Wyślij nowy kod' : lang === 'EN' ? '↻ Send new code' : '↻ Stuur nieuwe code')}
        </button>

        <button
          className="btn btn--ghost"
          onClick={() => { setAwaitingMagicLink(false); setMagicSentTo(''); setOtpCode(''); }}
          style={{ marginTop: 6 }}
        >
          ← {t('back')}
        </button>

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
          <input
            type="email"
            placeholder="jij@stamkroeg.nl"
            value={email}
            onChange={e => setEmail(e.target.value)}
            inputMode="email"
            autoCapitalize="none"
            disabled={submitting}
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
            disabled={submitting}
          />
          {errors.nickname && <div className="field-err">{errors.nickname}</div>}
        </div>

        <div className="field">
          <label>{t('ob_company')}</label>
          <input
            type="text"
            value={company}
            onChange={e => setCompany(e.target.value)}
            maxLength={60}
            disabled={submitting}
          />
        </div>

        <div className="field">
          <label>{t('ob_nationality')}</label>
          <select value={nationality} onChange={e => onNatChange(e.target.value)} disabled={submitting}>
            {NATIONALITIES.map(n => (
              <option key={n.code} value={n.code}>{n.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>{t('ob_language')}</label>
          <select value={uiLang} onChange={e => onLangChange(e.target.value)} disabled={submitting}>
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        <button className="btn btn--big" type="submit" disabled={submitting}>
          {submitting ? '...' : (online ? `📬 ${t('play')}` : t('play'))}
        </button>

        {serverErr && (
          <div className="field-err" style={{ marginTop: 10, textAlign: 'center' }}>
            {serverErr}
          </div>
        )}

        <p className="muted" style={{ marginTop: 14, fontSize: 12, textAlign: 'center' }}>
          {online ? (
            <>
              {lang === 'PL' && 'Wyślemy 6-cyfrowy kod mailem. Bez hasła.'}
              {lang === 'EN' && 'We\'ll email you a 6-digit code. No password.'}
              {lang === 'NL' && 'We sturen je een 6-cijferige code per e-mail. Geen wachtwoord.'}
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
