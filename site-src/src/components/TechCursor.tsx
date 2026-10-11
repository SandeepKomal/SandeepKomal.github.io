import { useEffect, useRef } from 'react';

// Custom cursor: a bevelled chrome arrow in the hero heading's silver, edged with the
// Contact button's purple → magenta → orange gradient, plus a soft trailing ring that
// grows over links and buttons. Only on devices with a precise pointer (mouse/trackpad).

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, canvas';

export default function TechCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const arrow = arrowRef.current;
    const ring = ringRef.current;
    if (!arrow || !ring) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('tech-cursor');

    const pos = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };
    let hover = 0;
    let hoverTarget = 0;
    let press = 0;
    let visible = false;
    let frame = 0;

    const show = (v: boolean) => {
      visible = v;
      arrow.style.opacity = v ? '1' : '0';
      ring.style.opacity = v ? '1' : '0';
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        trail.x = pos.x;
        trail.y = pos.y;
        show(true);
      }
      hoverTarget = (e.target as Element | null)?.closest?.(INTERACTIVE) ? 1 : 0;
    };
    const onDown = () => (press = 1);
    const onUp = () => (press = 0);
    const onLeave = () => show(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeave);

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const k = reduceMotion ? 1 : 0.2;
      trail.x += (pos.x - trail.x) * k;
      trail.y += (pos.y - trail.y) * k;
      hover += (hoverTarget - hover) * 0.18;
      const tilt = hover * -8;
      const scale = 1 - press * 0.12;
      arrow.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${tilt}deg) scale(${scale})`;
      const size = 34 + hover * 22 - press * 6;
      ring.style.transform = `translate3d(${trail.x - size / 2}px, ${trail.y - size / 2}px, 0)`;
      ring.style.width = ring.style.height = `${size}px`;
      ring.style.setProperty('--fill', String(hover * 0.14));
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove('tech-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="tech-cursor-ring" aria-hidden />
      <div ref={arrowRef} className="tech-cursor-arrow" aria-hidden>
        <svg width="30" height="36" viewBox="0 0 30 36" fill="none">
          <defs>
            {/* chrome body, same silver as the hero heading */}
            <linearGradient id="tc-face" x1="4" y1="2" x2="18" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.45" stopColor="#D7E2EA" />
              <stop offset="1" stopColor="#8E99A6" />
            </linearGradient>
            {/* shaded right-hand bevel */}
            <linearGradient id="tc-bevel" x1="10" y1="14" x2="22" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#7A8491" />
              <stop offset="1" stopColor="#3E4550" />
            </linearGradient>
            {/* brand edge: Contact button gradient */}
            <linearGradient id="tc-edge" x1="3" y1="2" x2="22" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#B600A8" />
              <stop offset="0.55" stopColor="#7621B0" />
              <stop offset="1" stopColor="#BE4C00" />
            </linearGradient>
            <filter id="tc-shadow" x="-40%" y="-30%" width="180%" height="170%">
              <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.6" floodColor="#000" floodOpacity="0.55" />
              <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="#B600A8" floodOpacity="0.45" />
            </filter>
          </defs>
          <g filter="url(#tc-shadow)">
            {/* arrow outline: tip at (3,2) */}
            <path
              d="M3 2 L3 27.5 L9.6 21.6 L14.2 32.2 L18.6 30.3 L14.1 19.9 L23 19.6 Z"
              fill="url(#tc-face)"
              stroke="url(#tc-edge)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* bevel facet on the lower-right side for depth */}
            <path d="M9.6 21.6 L14.2 32.2 L18.6 30.3 L14.1 19.9 Z" fill="url(#tc-bevel)" opacity="0.85" />
            <path d="M14.1 19.9 L23 19.6 L9.6 21.6 Z" fill="#5A6370" opacity="0.55" />
            {/* specular highlight along the left edge */}
            <path d="M4.6 5.2 L4.6 22.5" stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round" opacity="0.9" />
          </g>
        </svg>
      </div>
    </>
  );
}
