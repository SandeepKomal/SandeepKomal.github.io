import { useEffect, useRef } from 'react';
import base from '../assets/portrait/base.webp';
import hair from '../assets/portrait/hair.webp';
import irisL from '../assets/portrait/iris-l.webp';
import irisR from '../assets/portrait/iris-r.webp';
import maskL from '../assets/portrait/mask-l.png';
import maskR from '../assets/portrait/mask-r.png';
import geometry from '../assets/portrait/geometry.json';

import closed from '../assets/portrait/closed.webp';

// The 3D portrait split into layers: a base with the irises removed, each iris on its own
// (moved by the cursor, clipped to the eye opening) and the hair strands that cross the eyes
// drawn back on top. At rest it matches the original image.
//
// Blinking: a closed-eyes render of the same character, aligned to this one and cut down to
// the eye areas (closed.webp), is flashed in for a natural ~150 ms blink.

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
      let shut = 0;
      if (blinkStart >= 0) {
        const t = now - blinkStart;
        // Paced like the 12-frame reference: ~3 frames closing, ~4 held shut, ~2 opening (≈190 ms)
        const one = (u: number) => (u < 50 ? u / 50 : u < 115 ? 1 : u < 185 ? 1 - (u - 115) / 70 : 0);
        shut = one(t) + (doubleBlink ? one(t - 280) : 0);
        if (t > (doubleBlink ? 480 : 195)) {
          blinkStart = -1;
          nextBlink = now + rand(2800, 6000);
        }
      }
      const eased = shut * shut * (3 - 2 * shut);
      const cl = closedRef.current;
      if (cl) {
        // The closed lid slides down over each eye: reveal the closed render top-down with a soft
        // edge that travels from the upper lash line to the lower lid (each eye has its own edge).
        cl.style.opacity = eased > 0.01 ? '1' : '0';
        if (eased > 0.01) {
          const edge = ([top, bottom]: readonly number[]) => {
            const e = top + (bottom - top + 12) * eased - 10;
            return `linear-gradient(180deg, #000 ${e}%, transparent ${e + 10}%)`;
          };
          const mask = `${edge(geometry.closedLid.l)}, ${edge(geometry.closedLid.r)}`;
          cl.style.webkitMaskImage = mask;
          cl.style.maskImage = mask;
        }
      }
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

      <img
        ref={closedRef}
        src={closed}
        alt=""
        draggable={false}
        className="pointer-events-none absolute"
        style={{
          ...place([geometry.closed[0], geometry.closed[1], geometry.closed[2] - geometry.closed[0], geometry.closed[3] - geometry.closed[1]]),
          opacity: 0,
          WebkitMaskSize: `${geometry.closedLid.split}% 100%, ${100 - geometry.closedLid.split}% 100%`,
          maskSize: `${geometry.closedLid.split}% 100%, ${100 - geometry.closedLid.split}% 100%`,
          WebkitMaskPosition: 'left top, right top',
          maskPosition: 'left top, right top',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      />
    </div>
  );
}
