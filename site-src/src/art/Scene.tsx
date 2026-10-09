// Procedural "render" scenes -- original artwork used in place of photos.
import { useId } from 'react';

export type Palette = { bg: [string, string]; a: string; b: string; c: string };

export const PALETTES: Palette[] = [
  { bg: ['#1B0630', '#5B1B8F'], a: '#B600A8', b: '#FFB070', c: '#D7E2EA' },
  { bg: ['#06202E', '#0F5E7A'], a: '#3FD0E0', b: '#F2F7A1', c: '#FFFFFF' },
  { bg: ['#2A0F05', '#8A3A0A'], a: '#FF8A3D', b: '#FFD9A0', c: '#4B1B8A' },
  { bg: ['#0A1A0E', '#1E5A2C'], a: '#7EE787', b: '#E8FFB5', c: '#0C0C0C' },
  { bg: ['#14142B', '#3A3A8C'], a: '#8C8CFF', b: '#FFC7F4', c: '#D7E2EA' },
  { bg: ['#2B0A1A', '#8C1E4F'], a: '#FF5FA2', b: '#FFE29A', c: '#1B0630' },
  { bg: ['#101418', '#3A4652'], a: '#BBCCD7', b: '#646973', c: '#FF8A3D' },
];

type SceneProps = { palette: Palette; variant: number; className?: string; label?: string };

/** Abstract 3D-style composition. `variant` picks the layout. */
export default function Scene({ palette, variant, className, label }: SceneProps) {
  const id = useId().replace(/:/g, '');
  const { bg, a, b, c } = palette;
  const v = variant % 4;

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg[0]} />
          <stop offset="100%" stopColor={bg[1]} />
        </linearGradient>
        <radialGradient id={`${id}-a`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="30%" stopColor={a} />
          <stop offset="100%" stopColor={bg[0]} />
        </radialGradient>
        <radialGradient id={`${id}-b`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="35%" stopColor={b} />
          <stop offset="100%" stopColor={bg[1]} />
        </radialGradient>
        <clipPath id={`${id}-front`}>
          <rect x="-100" y="160" width="600" height="300" transform="rotate(-18 200 160)" />
        </clipPath>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-bg)`} />
      <rect y="200" width="400" height="100" fill={`url(#${id}-floor)`} />

      {v === 0 && (
        <>
          <ellipse cx="200" cy="250" rx="110" ry="16" fill="#000" opacity="0.4" />
          <circle cx="200" cy="150" r="95" fill={`url(#${id}-a)`} />
          <circle cx="310" cy="80" r="30" fill={`url(#${id}-b)`} />
          <circle cx="80" cy="220" r="18" fill={c} opacity="0.8" />
        </>
      )}
      {v === 1 && (
        <>
          <polygon points="200,60 300,110 200,160 100,110" fill={b} />
          <polygon points="100,110 200,160 200,250 100,200" fill={a} opacity="0.9" />
          <polygon points="200,160 300,110 300,200 200,250" fill={a} opacity="0.65" />
          <circle cx="320" cy="230" r="26" fill={`url(#${id}-b)`} />
          <circle cx="70" cy="70" r="14" fill={c} opacity="0.7" />
        </>
      )}
      {v === 2 && (
        <>
          <ellipse cx="200" cy="160" rx="150" ry="55" fill="none" stroke={b} strokeWidth="22" transform="rotate(-18 200 160)" />
          <circle cx="200" cy="150" r="62" fill={`url(#${id}-a)`} />
          <ellipse cx="200" cy="160" rx="150" ry="55" fill="none" stroke={b} strokeWidth="22" transform="rotate(-18 200 160)" clipPath={`url(#${id}-front)`} />
          <circle cx="90" cy="70" r="20" fill={`url(#${id}-b)`} />
        </>
      )}
      {v === 3 && (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={60 + i * 60}
              y={230 - (i + 1) * 30}
              width="44"
              height={(i + 1) * 30}
              rx="10"
              fill={i % 2 ? a : b}
              opacity={0.65 + i * 0.07}
            />
          ))}
          <circle cx="330" cy="60" r="28" fill={`url(#${id}-a)`} />
          <circle cx="60" cy="60" r="10" fill={c} opacity="0.8" />
        </>
      )}
    </svg>
  );
}
