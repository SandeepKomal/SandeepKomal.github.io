// Original vector artwork drawn for this site -- no third-party images are used.
import { useId } from 'react';

type ArtProps = { className?: string };

/** Glossy 3D orb with an orbiting ring, used as the hero centrepiece. */
export function HeroOrb({ className }: ArtProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 520 560" className={className} role="img" aria-label="Glossy 3D orb with an orbiting ring">
      <defs>
        <radialGradient id={`${id}-orb`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#F4D9FF" />
          <stop offset="25%" stopColor="#C04BE0" />
          <stop offset="60%" stopColor="#5B1B8F" />
          <stop offset="100%" stopColor="#12031F" />
        </radialGradient>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#BE4C00" />
          <stop offset="50%" stopColor="#FFB070" />
          <stop offset="100%" stopColor="#7621B0" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B600A8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#B600A8" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-front`}>
          <rect x="-100" y="280" width="720" height="400" transform="rotate(-14 260 280)" />
        </clipPath>
        <radialGradient id={`${id}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="260" cy="270" r="250" fill={`url(#${id}-glow)`} />
      <ellipse cx="260" cy="530" rx="170" ry="22" fill={`url(#${id}-shadow)`} />
      {/* back half of the ring */}
      <ellipse cx="260" cy="280" rx="235" ry="62" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="18" opacity="0.55" transform="rotate(-14 260 280)" />
      <circle cx="260" cy="280" r="175" fill={`url(#${id}-orb)`} />
      <ellipse cx="200" cy="200" rx="62" ry="38" fill="#FFFFFF" opacity="0.35" transform="rotate(-30 200 200)" />
      <ellipse cx="185" cy="188" rx="20" ry="12" fill="#FFFFFF" opacity="0.8" transform="rotate(-30 185 188)" />
      {/* front half of the ring, clipped to the lower arc */}
      <ellipse cx="260" cy="280" rx="235" ry="62" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="18" transform="rotate(-14 260 280)" clipPath={`url(#${id}-front)`} />
      <circle cx="455" cy="150" r="22" fill="#D7E2EA" opacity="0.9" />
      <circle cx="80" cy="420" r="12" fill="#B600A8" />
    </svg>
  );
}

/** Crescent moon with soft shading. */
export function Moon({ className }: ArtProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-m`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFF4C9" />
          <stop offset="55%" stopColor="#F2B84B" />
          <stop offset="100%" stopColor="#8A4A00" />
        </radialGradient>
        <mask id={`${id}-cut`}>
          <rect width="200" height="200" fill="#fff" />
          <circle cx="135" cy="70" r="70" fill="#000" />
        </mask>
      </defs>
      <circle cx="95" cy="105" r="80" fill={`url(#${id}-m)`} mask={`url(#${id}-cut)`} />
      <circle cx="55" cy="130" r="9" fill="#8A4A00" opacity="0.35" mask={`url(#${id}-cut)`} />
      <circle cx="85" cy="160" r="6" fill="#8A4A00" opacity="0.3" />
      <circle cx="160" cy="150" r="5" fill="#FFF4C9" />
      <circle cx="175" cy="120" r="3" fill="#FFF4C9" opacity="0.7" />
    </svg>
  );
}

/** Isometric toy brick. */
export function Brick({ className }: ArtProps) {
  const studs = [
    [70, 58],
    [110, 78],
    [110, 38],
    [150, 58],
  ];
  return (
    <svg viewBox="0 0 220 200" className={className} aria-hidden="true">
      <polygon points="110,40 190,80 110,120 30,80" fill="#FF6B5A" />
      <polygon points="30,80 110,120 110,180 30,140" fill="#C9372A" />
      <polygon points="110,120 190,80 190,140 110,180" fill="#E14B3B" />
      {studs.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x - 14} y={y + 2} width="28" height="12" fill="#C9372A" />
          <ellipse cx={x} cy={y + 14} rx="14" ry="7" fill="#C9372A" />
          <ellipse cx={x} cy={y + 2} rx="14" ry="7" fill="#FF8A7B" />
        </g>
      ))}
    </svg>
  );
}

/** Stack of glossy spheres. */
export function Spheres({ className }: ArtProps) {
  const id = useId().replace(/:/g, '');
  const balls = [
    { cx: 70, cy: 130, r: 52, c: ['#9AF5FF', '#1E7FBF', '#08223F'] },
    { cx: 140, cy: 120, r: 40, c: ['#FFC7F4', '#B600A8', '#3A0036'] },
    { cx: 108, cy: 62, r: 34, c: ['#E8FFB5', '#6DBE2E', '#1D3D06'] },
  ];
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        {balls.map((b, i) => (
          <radialGradient key={i} id={`${id}-b${i}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={b.c[0]} />
            <stop offset="55%" stopColor={b.c[1]} />
            <stop offset="100%" stopColor={b.c[2]} />
          </radialGradient>
        ))}
      </defs>
      {balls.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={`url(#${id}-b${i})`} />
      ))}
    </svg>
  );
}

/** Twisted torus knot-ish ring. */
export function Torus({ className }: ArtProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 220 220" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE29A" />
          <stop offset="45%" stopColor="#BE4C00" />
          <stop offset="100%" stopColor="#7621B0" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="110" rx="80" ry="42" fill="none" stroke={`url(#${id}-t)`} strokeWidth="30" transform="rotate(-30 110 110)" />
      <ellipse cx="110" cy="110" rx="80" ry="42" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="4" transform="rotate(-30 110 110) translate(0 -10)" />
      <ellipse cx="110" cy="110" rx="42" ry="80" fill="none" stroke={`url(#${id}-t)`} strokeWidth="22" opacity="0.85" transform="rotate(-30 110 110)" />
    </svg>
  );
}
