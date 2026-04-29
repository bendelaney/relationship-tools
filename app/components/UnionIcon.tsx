export default function UnionIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Two overlapping speech bubbles — dialogue */}
      <rect x="8" y="12" width="38" height="28" rx="8"
        stroke="#1a1612" strokeWidth="2.4" fill="#fbf7ee" />
      <path d="M 20 40 L 16 50 L 26 42"
        stroke="#1a1612" strokeWidth="2.4" fill="#fbf7ee" />
      {/* Lines inside left bubble */}
      <line x1="16" y1="22" x2="38" y2="22" stroke="#e3dac8" strokeWidth="2" />
      <line x1="16" y1="28" x2="34" y2="28" stroke="#e3dac8" strokeWidth="2" />
      <line x1="16" y1="34" x2="30" y2="34" stroke="#e3dac8" strokeWidth="2" />

      <rect x="34" y="28" width="38" height="28" rx="8"
        stroke="#1a1612" strokeWidth="2.4" fill="#e8e0cf" />
      <path d="M 60 56 L 64 66 L 54 58"
        stroke="#1a1612" strokeWidth="2.4" fill="#e8e0cf" />
      {/* Lines inside right bubble */}
      <line x1="42" y1="38" x2="64" y2="38" stroke="#c8d4c2" strokeWidth="2" />
      <line x1="42" y1="44" x2="60" y2="44" stroke="#c8d4c2" strokeWidth="2" />
      <line x1="42" y1="50" x2="56" y2="50" stroke="#c8d4c2" strokeWidth="2" />

      {/* Heart accent */}
      <path d="M 36 8 C 33 2, 26 4, 28 10 C 28 14, 36 18, 36 18 C 36 18, 44 14, 44 10 C 46 4, 39 2, 36 8 Z"
        fill="#3d5a44" opacity="0.7" />
    </svg>
  );
}
