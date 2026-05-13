import React from 'react';

// Inspecteur — SVG karikatuur die opbloeit van kalm → rood → ontploft → huilt.
// rage: 0..5
export default function Inspecteur({ rage = 0, size = 220 }) {
  const r = Math.max(0, Math.min(5, rage));

  const faceColors = ['#FFE0B2', '#FFCCBC', '#FF9E80', '#FF6E40', '#E53935', '#B71C1C'];
  const faceColor = faceColors[r];

  // Eyebrows angle increases with rage
  const browAngle = r * 6; // degrees
  // Mouth path: a curve that goes from smile/flat → frown
  const mouthY = 145 - r * 2;
  const mouthDip = r >= 3 ? 18 : (r >= 2 ? 6 : -4);
  const mouthPath = `M 78 ${mouthY} Q 100 ${mouthY + mouthDip} 122 ${mouthY}`;

  // Pupils smaller when angrier
  const pupilR = r >= 3 ? 2.5 : 3.5;
  const eyeStroke = r >= 4 ? '#5d0000' : '#1a1a1a';

  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      aria-label={`Inspecteur, rage ${r}`}
      role="img"
    >
      {/* hat */}
      <g>
        <ellipse cx="100" cy="38" rx="58" ry="10" fill="#1a1a1a" />
        <rect x="58" y="20" width="84" height="22" rx="6" fill="#1a1a1a" />
        <rect x="58" y="34" width="84" height="6" fill="#444" />
      </g>

      {/* ears */}
      <ellipse cx="32" cy="115" rx="10" ry="14" fill={faceColor} stroke="#000" strokeWidth="3" />
      <ellipse cx="168" cy="115" rx="10" ry="14" fill={faceColor} stroke="#000" strokeWidth="3" />

      {/* steam from ears at rage>=3 */}
      {r >= 3 && (
        <g>
          <circle className="steam-puff" cx="22" cy="100" r="6" />
          <circle className="steam-puff" cx="22" cy="100" r="5" />
          <circle className="steam-puff" cx="178" cy="100" r="6" />
          <circle className="steam-puff" cx="178" cy="100" r="5" />
        </g>
      )}

      {/* head */}
      <ellipse cx="100" cy="115" rx="58" ry="64" fill={faceColor} stroke="#000" strokeWidth="4" />

      {/* hair sides */}
      <path d="M 42 88 Q 60 75 78 80" fill="none" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round" />
      <path d="M 158 88 Q 140 75 122 80" fill="none" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round" />

      {/* eyebrows */}
      <g transform={`rotate(${-browAngle} 72 100)`}>
        <rect x="58" y="98" width="28" height="6" rx="3" fill="#1a1a1a" />
      </g>
      <g transform={`rotate(${browAngle} 128 100)`}>
        <rect x="114" y="98" width="28" height="6" rx="3" fill="#1a1a1a" />
      </g>

      {/* eyes */}
      <g>
        <circle cx="72" cy="118" r="9" fill="#fff" stroke={eyeStroke} strokeWidth="2" />
        <circle cx="128" cy="118" r="9" fill="#fff" stroke={eyeStroke} strokeWidth="2" />
        <circle cx={72 + (r >= 3 ? 1 : 0)} cy={118 + (r >= 4 ? 1 : 0)} r={pupilR} fill="#000" />
        <circle cx={128 - (r >= 3 ? 1 : 0)} cy={118 + (r >= 4 ? 1 : 0)} r={pupilR} fill="#000" />
      </g>

      {/* tears at rage 5 */}
      {r === 5 && (
        <g>
          <path className="tear" d="M 72 130 q -3 6 0 12 q 3 -6 0 -12 z" />
          <path className="tear" d="M 128 130 q -3 6 0 12 q 3 -6 0 -12 z" />
        </g>
      )}

      {/* nose */}
      <path d="M 95 125 Q 100 140 105 125" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />

      {/* mouth */}
      {r === 5 ? (
        <path d={`M 80 155 Q 100 145 120 155`} fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />
      ) : (
        <path d={mouthPath} fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />
      )}
      {/* teeth when ontploft */}
      {r === 4 && (
        <g>
          <rect x="90" y="148" width="6" height="9" fill="#fff" stroke="#000" strokeWidth="1.5" />
          <rect x="98" y="148" width="6" height="9" fill="#fff" stroke="#000" strokeWidth="1.5" />
          <rect x="106" y="148" width="6" height="9" fill="#fff" stroke="#000" strokeWidth="1.5" />
        </g>
      )}

      {/* neck */}
      <rect x="80" y="172" width="40" height="22" fill={faceColor} stroke="#000" strokeWidth="3" />

      {/* shirt + tie */}
      <path d="M 50 195 L 30 240 L 170 240 L 150 195 Z" fill="#0d47a1" stroke="#000" strokeWidth="3" />
      <path d="M 95 195 L 90 200 L 100 240 L 110 200 L 105 195 Z" fill={r >= 3 ? '#E53935' : '#FFC107'} stroke="#000" strokeWidth="2.5" />
      <path d="M 95 195 L 100 192 L 105 195 L 100 200 Z" fill="#fff" stroke="#000" strokeWidth="1.5" />

      {/* sweat drop on stage 2 */}
      {r === 2 && (
        <path d="M 152 110 q -3 6 0 12 q 3 -6 0 -12 z" fill="#4FC3F7" stroke="#000" strokeWidth="1.5" />
      )}

      {/* phone-to-ear at stage 5 */}
      {r === 5 && (
        <g>
          <rect x="148" y="100" width="14" height="34" rx="3" fill="#1a1a1a" stroke="#000" strokeWidth="2" />
          <rect x="151" y="105" width="8" height="14" fill="#4FC3F7" />
        </g>
      )}
    </svg>
  );
}
