import React, { useEffect, useState } from 'react';
import OmeJan from './OmeJan.jsx';
import { pickOmeJanQuote } from '../data/omeJanQuotes.js';

// Random popup that slides in from the side every N seconds.
// Slides out after 6 sec, or when player taps it.
export default function OmeJanPopup({ active, minSec = 12, maxSec = 25 }) {
  const [visible, setVisible] = useState(false);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    if (!active) return;
    let mounted = true;
    let timer;

    function schedule() {
      const delay = (minSec + Math.random() * (maxSec - minSec)) * 1000;
      timer = setTimeout(() => {
        if (!mounted) return;
        setQuote(pickOmeJanQuote());
        setVisible(true);
        const hide = setTimeout(() => {
          if (!mounted) return;
          setVisible(false);
          schedule();
        }, 6500);
        timer = hide;
      }, delay);
    }

    schedule();
    return () => { mounted = false; clearTimeout(timer); };
  }, [active, minSec, maxSec]);

  if (!visible || !quote) return null;

  return (
    <div className="ome-popup" onClick={() => setVisible(false)}>
      <OmeJan size={64} />
      <div className="bubble bubble--omejan" style={{ flex: 1 }}>
        {quote.text}
      </div>
    </div>
  );
}
