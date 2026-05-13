import React from 'react';

// Ome Jan — stamkroeg-oom met snor, bril en biertje.
export default function OmeJan({ size = 120 }) {
  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} role="img" aria-label="Ome Jan">
      {/* haar zijden */}
      <path d="M 42 90 Q 100 30 158 90" fill="#3e2723" stroke="#000" strokeWidth="3" />
      {/* kale plek bovenop */}
      <ellipse cx="100" cy="55" rx="32" ry="12" fill="#FFCCBC" stroke="#000" strokeWidth="2" />

      {/* hoofd */}
      <ellipse cx="100" cy="115" rx="60" ry="64" fill="#FFCCBC" stroke="#000" strokeWidth="4" />

      {/* oren */}
      <ellipse cx="34" cy="115" rx="10" ry="14" fill="#FFCCBC" stroke="#000" strokeWidth="3" />
      <ellipse cx="166" cy="115" rx="10" ry="14" fill="#FFCCBC" stroke="#000" strokeWidth="3" />

      {/* bril */}
      <g stroke="#1a1a1a" strokeWidth="3" fill="none">
        <circle cx="73" cy="118" r="14" fill="#fff" />
        <circle cx="127" cy="118" r="14" fill="#fff" />
        <path d="M 87 118 L 113 118" />
        <path d="M 59 118 L 49 115" />
        <path d="M 141 118 L 151 115" />
      </g>

      {/* ogen achter bril */}
      <circle cx="73" cy="118" r="3" fill="#000" />
      <circle cx="127" cy="118" r="3" fill="#000" />

      {/* rode neus (te veel bier) */}
      <ellipse cx="100" cy="140" rx="10" ry="8" fill="#E53935" stroke="#000" strokeWidth="2.5" />

      {/* dikke snor */}
      <path d="M 70 158 Q 85 168 100 158 Q 115 168 130 158 Q 130 175 100 175 Q 70 175 70 158 Z"
            fill="#3e2723" stroke="#000" strokeWidth="3" />

      {/* mond / glimlach onder snor */}
      <path d="M 90 180 Q 100 188 110 180" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />

      {/* nek */}
      <rect x="80" y="174" width="40" height="18" fill="#FFCCBC" stroke="#000" strokeWidth="3" />

      {/* vest + shirt */}
      <path d="M 40 195 L 25 240 L 175 240 L 160 195 L 130 198 L 100 210 L 70 198 Z"
            fill="#5d4037" stroke="#000" strokeWidth="3" />
      <path d="M 88 198 L 100 220 L 112 198 Z" fill="#fff" stroke="#000" strokeWidth="2" />

      {/* biertje in hand (rechts) */}
      <g transform="translate(170, 200)">
        <rect x="-4" y="0" width="22" height="32" rx="2" fill="#FFC107" stroke="#000" strokeWidth="2.5" />
        <rect x="-4" y="0" width="22" height="8" fill="#fff" opacity="0.7" />
        <path d="M 18 8 q 8 4 0 18" fill="none" stroke="#000" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
