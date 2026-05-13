import React, { useState } from 'react';
import { sfx } from '../utils/audio.js';

export default function ShareButton({ score, euroSaved, levelId, levelTitle, stars }) {
  const [copied, setCopied] = useState(false);

  const shareText = buildShareText({ score, euroSaved, levelId, levelTitle, stars });

  function onShare() {
    sfx.click();
    if (navigator.share) {
      navigator.share({
        title: 'LULBAL — Speel met je belasting',
        text: shareText,
        url: 'https://lulbal.nl',
      }).catch(() => copyToClipboard());
    } else {
      copyToClipboard();
    }
  }

  function copyToClipboard() {
    navigator.clipboard?.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const wa = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="col" style={{ gap: 8 }}>
      <button className="btn btn--green" onClick={onShare}>
        {copied ? 'Gekopieerd!' : '📲 Deel je score'}
      </button>
      <a className="btn btn--ghost" href={wa} target="_blank" rel="noreferrer" onClick={() => sfx.click()}>
        💬 Stuur via WhatsApp
      </a>
      <pre className="share-text">{shareText}</pre>
    </div>
  );
}

export function buildShareText({ score, euroSaved, levelId, levelTitle, stars }) {
  const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  const eur = (euroSaved || 0).toLocaleString('nl-NL');
  return `🚨 Ik heb €${eur} belasting 'bespaard' in LULBAL!
Level ${levelId} — ${levelTitle} — ${starStr}
Score: ${score} pts.

Kun jij het beter? De inspecteur huilt al.
👉 lulbal.nl`;
}
