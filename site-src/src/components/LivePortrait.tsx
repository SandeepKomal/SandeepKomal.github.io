import { useEffect, useRef } from 'react';
import base from '../assets/portrait/base.webp';
import hair from '../assets/portrait/hair.webp';
import irisL from '../assets/portrait/iris-l.webp';
import irisR from '../assets/portrait/iris-r.webp';
import maskL from '../assets/portrait/mask-l.png';
import maskR from '../assets/portrait/mask-r.png';
import geometry from '../assets/portrait/geometry.json';

const closedFiles = import.meta.glob<string>('../assets/portrait/closed.{webp,png,jpg}', { eager: true, import: 'default' });
const CLOSED = Object.values(closedFiles)[0];

// The 3D portrait split into layers: a base with the irises removed, each iris on its own
// (moved by the cursor, clipped to the eye opening) and the hair strands that cross the eyes
// drawn back on top. At rest it matches the original image.
//
// Blinking: drop a closed-eyes render of the same image (same framing) at
// src/assets/portrait/closed.webp and the eyes will blink by briefly showing it.

const { width: W, height: H } = geometry;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
type Box = [number, number, number, number];

const EYES = [
  { key: 'l', iris: irisL, mask: maskL, ...geometry.eyes.l },
  { key: 'r', iris: irisR, mask: maskR, ...geometry.eyes.r },
] as const;

// How far an iris may travel, as a fraction of its radius
const MAX_X = 0.3;
const MAX_Y = 0.16;


export default function LivePortrait({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const irisRefs = useRef<(HTMLImageElement | null)[]>([]);
  const closedRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const target = { x: 0, y: 0 };
    const look = { x: 0, y: 0 };
    let lastPointer = -Infinity;
    let nextGlance = 0;
    let nextBlink = performance.now() + 1800;
    let blinkStart = -1;
    let doubleBlink = false;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = root.getBoundingClientRect();
      // aim from the point between the eyes
      const ex = r.left + r.width * 0.49;
      const ey = r.top + r.height * 0.58;
      const dx = (e.clientX - ex) / (window.innerWidth * 0.45);
      const dy = (e.clientY - ey) / (window.innerHeight * 0.45);
      const len = Math.hypot(dx, dy);
      const k = len > 1 ? 1 / len : 1;
      target.x = dx * k;
      target.y = dy * k;
      lastPointer = performance.now();
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);

      // No cursor recently (phones, or the mouse is idle): small natural glances
      if (now - lastPointer > 2500 && now > nextGlance) {
        const centre = Math.random() < 0.4;
        target.x = centre ? 0 : rand(-0.8, 0.8);
        target.y = centre ? 0 : rand(-0.35, 0.45);
        nextGlance = now + rand(1400, 3200);
      }

      // Eyes are quick: ease fast towards the target
      look.x += (target.x - look.x) * 0.16;
      look.y += (target.y - look.y) * 0.16;

      EYES.forEach((eye, i) => {
        const el = irisRefs.current[i];
        if (!el) return;
        const dx = look.x * eye.r * MAX_X;
        const dy = look.y * eye.r * MAX_Y;
        el.style.transform = `translate(${(dx / eye.irisBox[2]) * 100}%, ${(dy / eye.irisBox[3]) * 100}%)`;
      });

      // Blinks: about every 3–6 s, sometimes a quick double blink
      if (blinkStart < 0 && now > nextBlink) {
        blinkStart = now;
        doubleBlink = Math.random() < 0.18;
      }
      let closed = 0;
      if (blinkStart >= 0) {
        const t = now - blinkStart;
        const one = (u: number) => (u < 70 ? u / 70 : u < 110 ? 1 : u < 230 ? 1 - (u - 110) / 120 : 0);
        closed = one(t) + (doubleBlink ? one(t - 260) : 0);
        if (t > (doubleBlink ? 500 : 240)) {
          blinkStart = -1;
          nextBlink = now + rand(2800, 6000);
        }
      }
      const eased = closed * closed * (3 - 2 * closed);
      if (closedRef.current) closedRef.current.style.opacity = String(eased);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const place = ([x, y, w, h]: Box | readonly number[]) => ({
    left: pct(x, W),
    top: pct(y, H),
    width: pct(w, W),
    height: pct(h, H),
  });

  return (
    <div ref={rootRef} className={`relative select-none ${className ?? ''}`} style={{ aspectRatio: `${W} / ${H}` }}>
      <img src={base} alt="3D portrait of Sandeep" draggable={false} className="absolute inset-0 h-full w-full" />

      {EYES.map((eye, i) => {
        const [bx, by, bw, bh] = eye.box;
        const [ix, iy, iw, ih] = eye.irisBox;
        return (
          <div
            key={eye.key}
            className="absolute overflow-hidden"
            style={{
              ...place(eye.box),
              WebkitMaskImage: `url(${eye.mask})`,
              maskImage: `url(${eye.mask})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
            }}
          >
            <img
              ref={(el) => {
                irisRefs.current[i] = el;
              }}
              src={eye.iris}
              alt=""
              draggable={false}
              className="absolute"
              style={{
                left: pct(ix - bx, bw),
                top: pct(iy - by, bh),
                width: pct(iw, bw),
                height: pct(ih, bh),
                willChange: 'transform',
              }}
            />
          </div>
        );
      })}

      <img
        src={hair}
        alt=""
        draggable={false}
        className="pointer-events-none absolute"
        style={place([geometry.hair[0], geometry.hair[1], geometry.hair[2] - geometry.hair[0], geometry.hair[3] - geometry.hair[1]])}
      />

      {CLOSED && (
        <img
          ref={closedRef}
          src={CLOSED}
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{
            opacity: 0,
            // only the band around the eyes swaps, so any tiny difference elsewhere never shows
            WebkitMaskImage: 'linear-gradient(180deg, transparent 50%, #000 54%, #000 66%, transparent 70%)',
            maskImage: 'linear-gradient(180deg, transparent 50%, #000 54%, #000 66%, transparent 70%)',
          }}
        />
      )}
    </div>
  );
}
