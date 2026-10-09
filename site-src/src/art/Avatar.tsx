// Original illustrated developer character for the hero -- drawn in code, no third-party art.
// Idle animation: gentle float, a slight head tilt and blinking eyes (disabled for reduced motion).
import { useId } from 'react';

type AvatarProps = {
  className?: string;
  style?: React.CSSProperties;
  /** Optional rendered head image (transparent background) used instead of the drawn face */
  headSrc?: string;
};

export default function Avatar({ className, style, headSrc }: AvatarProps) {
  const id = useId().replace(/:/g, '');
  const g = (name: string) => `url(#${id}-${name})`;

  return (
    <svg viewBox="0 0 520 600" className={className} style={style} role="img" aria-label="Illustrated character of Sandeep">
      <style>{`
        .${id}-float { animation: ${id}-float 5s ease-in-out infinite; transform-origin: 260px 600px; }
        .${id}-head { animation: ${id}-tilt 7s ease-in-out infinite; transform-origin: 260px 330px; }
        .${id}-eye { animation: ${id}-blink 4.5s infinite; transform-box: fill-box; transform-origin: center; }
        .${id}-chip { animation: ${id}-bob 4s ease-in-out infinite; }
        .${id}-chip2 { animation: ${id}-bob 4s ease-in-out -2s infinite; }
        @keyframes ${id}-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes ${id}-tilt { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2.5deg); } }
        @keyframes ${id}-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes ${id}-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @media (prefers-reduced-motion: reduce) {
          .${id}-float, .${id}-head, .${id}-eye, .${id}-chip, .${id}-chip2 { animation: none; }
        }
      `}</style>
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#B600A8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#B600A8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-hoodie`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#8A3BC9" />
          <stop offset="55%" stopColor="#5B1B8F" />
          <stop offset="100%" stopColor="#2A0B45" />
        </linearGradient>
        <linearGradient id={`${id}-hood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A1577" />
          <stop offset="100%" stopColor="#2A0B45" />
        </linearGradient>
        <radialGradient id={`${id}-skin`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#E3A97E" />
          <stop offset="60%" stopColor="#C4835A" />
          <stop offset="100%" stopColor="#9A5F3C" />
        </radialGradient>
        <linearGradient id={`${id}-neck`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A4329" />
          <stop offset="100%" stopColor="#C98A60" />
        </linearGradient>
        <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#2B2233" />
          <stop offset="100%" stopColor="#0E0A12" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A2418" stopOpacity="0" />
          <stop offset="100%" stopColor="#3A2418" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="260" cy="330" r="250" fill={g('glow')} />

      {/* floating tech chips */}
      <g className={`${id}-chip`}>
        <rect x="6" y="196" width="92" height="40" rx="20" fill="#0C0C0C" stroke="#67DFFF" strokeWidth="2" />
        <text x="52" y="222" textAnchor="middle" fontFamily="Kanit, sans-serif" fontWeight="600" fontSize="17" fill="#67DFFF">AWS</text>
      </g>
      <g className={`${id}-chip2`}>
        <rect x="420" y="96" width="96" height="40" rx="20" fill="#0C0C0C" stroke="#5EE69D" strokeWidth="2" />
        <text x="468" y="122" textAnchor="middle" fontFamily="Kanit, sans-serif" fontWeight="600" fontSize="17" fill="#5EE69D">K8s</text>
      </g>
      <g className={`${id}-chip2`}>
        <rect x="30" y="330" width="78" height="40" rx="20" fill="#0C0C0C" stroke="#8E96FF" strokeWidth="2" />
        <text x="69" y="356" textAnchor="middle" fontFamily="Kanit, sans-serif" fontWeight="600" fontSize="17" fill="#8E96FF">{'</>'}</text>
      </g>

      <ellipse cx="260" cy="592" rx="190" ry="14" fill={g('shadow')} />

      <g className={`${id}-float`}>
        {/* hood behind the neck */}
        <path d="M150 430 Q160 360 260 352 Q360 360 370 430 Z" fill={g('hood')} />

        {/* neck */}
        <path d="M222 340 L298 340 L304 440 L216 440 Z" fill={g('neck')} />

        {/* hoodie body */}
        <path
          d="M70 600 Q64 470 150 432 Q196 414 222 412 Q260 470 298 412 Q324 414 370 432 Q456 470 450 600 Z"
          fill={g('hoodie')}
        />
        {/* hood collar edges */}
        <path d="M222 412 Q260 478 298 412" fill="none" stroke="#2A0B45" strokeWidth="10" strokeLinecap="round" />
        <path d="M150 432 Q190 420 222 412" fill="none" stroke="#A35BDB" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        {/* drawstrings */}
        <path d="M240 450 Q236 490 242 520" fill="none" stroke="#D7E2EA" strokeWidth="5" strokeLinecap="round" />
        <path d="M280 450 Q284 490 278 520" fill="none" stroke="#D7E2EA" strokeWidth="5" strokeLinecap="round" />
        <circle cx="242" cy="524" r="6" fill="#D7E2EA" />
        <circle cx="278" cy="524" r="6" fill="#D7E2EA" />
        {/* cloud logo on the chest */}
        <path
          d="M318 548 a18 18 0 0 1 4 -35 a24 24 0 0 1 45 6 a15 15 0 0 1 1 29 Z"
          fill="none"
          stroke="#67DFFF"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* sleeve shading */}
        <path d="M70 600 Q66 500 120 450 Q100 520 110 600 Z" fill="#2A0B45" opacity="0.5" />
        <path d="M450 600 Q454 500 400 450 Q420 520 410 600 Z" fill="#2A0B45" opacity="0.5" />

        {/* head */}
        <g className={`${id}-head`}>
          {headSrc ? (
            <image href={headSrc} x="104" y="66" width="312" height="356" preserveAspectRatio="xMidYMid meet" />
          ) : (
            <>
              {/* ears */}
              <ellipse cx="160" cy="250" rx="22" ry="32" fill="#B87650" />
              <ellipse cx="360" cy="250" rx="22" ry="32" fill="#B87650" />
              <ellipse cx="162" cy="252" rx="10" ry="18" fill="#9A5F3C" />
              <ellipse cx="358" cy="252" rx="10" ry="18" fill="#9A5F3C" />

              {/* face */}
              <path
                d="M170 210 Q170 120 260 118 Q350 120 350 210 L350 260 Q348 330 300 358 Q260 378 220 358 Q172 330 170 260 Z"
                fill={g('skin')}
              />
              {/* beard / stubble */}
              <path
                d="M178 272 Q190 340 228 360 Q260 376 292 360 Q330 340 342 272 Q330 312 300 322 Q260 334 220 322 Q190 312 178 272 Z"
                fill="#3A2418"
                opacity="0.55"
              />
              <path d="M226 300 Q260 288 294 300 Q280 310 260 308 Q240 310 226 300 Z" fill="#2B1A12" opacity="0.8" />
              <path d="M252 338 Q260 346 268 338 L266 352 Q260 356 254 352 Z" fill="#2B1A12" opacity="0.6" />
              <rect x="170" y="300" width="180" height="70" fill={g('shade')} opacity="0.4" />

              {/* eyebrows */}
              <path d="M200 214 Q222 202 244 212" fill="none" stroke="#1A1218" strokeWidth="8" strokeLinecap="round" />
              <path d="M276 212 Q298 202 320 214" fill="none" stroke="#1A1218" strokeWidth="8" strokeLinecap="round" />

              {/* eyes */}
              <g className={`${id}-eye`}>
                <ellipse cx="222" cy="240" rx="11" ry="14" fill="#1A1218" />
                <circle cx="226" cy="235" r="4" fill="#FFFFFF" />
              </g>
              <g className={`${id}-eye`}>
                <ellipse cx="298" cy="240" rx="11" ry="14" fill="#1A1218" />
                <circle cx="302" cy="235" r="4" fill="#FFFFFF" />
              </g>

              {/* nose */}
              <path d="M260 246 Q252 276 248 282 Q260 290 272 282" fill="none" stroke="#8E5435" strokeWidth="5" strokeLinecap="round" />
              {/* smile */}
              <path d="M236 316 Q260 330 284 316" fill="none" stroke="#5A2E1E" strokeWidth="5" strokeLinecap="round" />
              {/* cheeks */}
              <ellipse cx="196" cy="282" rx="16" ry="9" fill="#E07A5F" opacity="0.25" />
              <ellipse cx="324" cy="282" rx="16" ry="9" fill="#E07A5F" opacity="0.25" />

              {/* hair: full top with a swept fringe */}
              <path
                d="M156 236 Q140 150 196 104 Q252 66 318 92 Q378 118 370 214 Q362 200 352 196 Q348 160 322 150
                   Q300 186 262 192 Q282 176 284 160 Q252 196 206 200 Q220 186 222 172 Q196 196 170 206 Q164 220 156 236 Z"
                fill={g('hair')}
              />
              {/* hair highlights */}
              <path d="M210 112 Q252 92 296 104" fill="none" stroke="#5A4A66" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
              <path d="M236 128 Q270 116 304 130" fill="none" stroke="#5A4A66" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
              <path d="M190 140 Q200 128 214 124" fill="none" stroke="#5A4A66" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            </>
          )}
        </g>
      </g>
    </svg>
  );
}
