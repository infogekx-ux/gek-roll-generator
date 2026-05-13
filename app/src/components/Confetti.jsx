import React, { useEffect, useState } from 'react';

const COLORS = ['#FFC107', '#E53935', '#1E88E5', '#66BB6A', '#FF7043', '#fff'];

export default function Confetti({ trigger, count = 50 }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const arr = Array.from({ length: count }).map((_, i) => ({
      id: trigger + '_' + i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.3,
      duration: 1.2 + Math.random() * 0.8,
      rotate: Math.random() * 360,
    }));
    setPieces(arr);
    const t = setTimeout(() => setPieces([]), 2000);
    return () => clearTimeout(t);
  }, [trigger, count]);

  if (!pieces.length) return null;

  return (
    <div className="fx-layer">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
