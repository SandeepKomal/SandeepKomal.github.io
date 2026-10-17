import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { PROJECTS } from '../content';

// 3D project carousel: glass cards stood round a slowly turning cylinder. Drag (or swipe) to spin
// it with inertia, use the arrows or keyboard to step card by card; it pauses while hovered and
// stops rendering when scrolled out of view.

type Project = (typeof PROJECTS)[number];

const STEP = 360 / PROJECTS.length;
const AUTO_SPEED = 14; // degrees per second
const TILT = -8; // look down on the ring a little so the cards at the back show above the front ones
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

function ProjectCard({ project }: { project: Project }) {
  const { accent } = project;
  return (
    <article
      className="flex h-full flex-col rounded-[28px] p-4 sm:p-5"
      style={{
        background: `linear-gradient(165deg, ${accent}2e 0%, ${accent}0d 38%, rgba(12,12,12,0.82) 100%)`,
        border: `1px solid ${accent}55`,
        boxShadow: `0 30px 60px rgba(0,0,0,0.55), inset 0 1px 0 ${accent}40`,
      }}
    >
      <span
        className="self-start rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] sm:text-[11px]"
        style={{ fontFamily: MONO, color: accent, border: `1px solid ${accent}80`, background: `${accent}14` }}
      >
        {project.category}
      </span>

      <div
        className="mt-4 overflow-hidden rounded-[18px]"
        style={{ aspectRatio: '16 / 9.5', border: '1px solid rgba(215,226,234,0.12)', background: '#0C0C0C' }}
      >
        <img
          src={project.image}
          alt={`${project.name} preview`}
          draggable={false}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <h3 className="mt-4 text-xl font-medium uppercase text-[#D7E2EA] sm:text-2xl">{project.name}</h3>
      <p className="mt-2 line-clamp-2 text-[13px] sm:line-clamp-3 font-light leading-relaxed text-[#D7E2EA]/65 sm:text-sm">
        {project.description}
      </p>

      <div className="mt-auto flex items-end justify-between gap-3 border-t pt-4" style={{ borderColor: 'rgba(215,226,234,0.1)' }}>
        <p className="text-[11px] leading-relaxed text-[#D7E2EA]/55 sm:text-xs" style={{ fontFamily: MONO }}>
          <span style={{ color: accent }}>&gt;_</span> {project.stack.join(' · ')}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {'live' in project && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-3 py-2 text-[11px] uppercase tracking-widest text-[#0C0C0C] transition-transform hover:scale-105"
              style={{ background: accent, fontFamily: MONO }}
            >
              Live
            </a>
          )}
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.name} on GitHub`}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110"
            style={{ border: `1px solid ${accent}`, color: accent, background: `${accent}1a` }}
          >
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

function useCardWidth() {
  const [width, setWidth] = useState(400);
  useEffect(() => {
    // fit the card to the screen's width and height so the ring and its controls fit in one view
    const update = () =>
      setWidth(Math.round(Math.max(230, Math.min(440, window.innerWidth * 0.62, (window.innerHeight * 0.68) / 1.32))));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return width;
}

export default function ProjectsSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctrl = useRef({ angle: 0, velocity: 0, target: null as number | null, hover: false, dragging: false });
  const [active, setActive] = useState(0);
  const cardWidth = useCardWidth();
  const radius = Math.round((cardWidth / 2 / Math.tan(Math.PI / PROJECTS.length)) * 1.25);

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return;
    const c = ctrl.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frame = 0;
    let last = performance.now();
    let onScreen = true;
    let shown = -1;

    const render = () => {
      ring.style.transform = `translateZ(${-radius}px) rotateX(${TILT}deg) rotateY(${c.angle}deg)`;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        // 1 when the card faces the viewer, -1 when it is at the back of the ring
        const facing = Math.cos(((i * STEP + c.angle) * Math.PI) / 180);
        el.style.opacity = String(0.6 + 0.4 * Math.max(0, facing));
        el.style.filter = `brightness(${0.6 + 0.4 * Math.max(0, facing)})`;
        el.style.pointerEvents = facing > 0.7 ? 'auto' : 'none';
        el.toggleAttribute('data-front', facing > 0.85);
      });
      const front = ((Math.round(-c.angle / STEP) % PROJECTS.length) + PROJECTS.length) % PROJECTS.length;
      if (front !== shown) {
        shown = front;
        setActive(front);
      }
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!onScreen) return;
      if (c.dragging) {
        // angle is driven by pointer moves
      } else if (c.target !== null) {
        const diff = c.target - c.angle;
        c.angle += diff * Math.min(1, dt * 8);
        if (Math.abs(diff) < 0.05) {
          c.angle = c.target;
          c.target = null;
        }
      } else if (Math.abs(c.velocity) > 0.5) {
        c.angle += c.velocity * dt;
        c.velocity *= Math.pow(0.04, dt);
      } else if (!c.hover && !reduceMotion) {
        c.velocity = 0;
        c.angle -= AUTO_SPEED * dt;
      }
      render();
    };

    // drag / swipe with inertia
    let startX = 0;
    let lastX = 0;
    let lastT = 0;
    let moved = 0;
    const degPerPx = 360 / (2 * Math.PI * radius);
    const onDown = (e: PointerEvent) => {
      c.dragging = true;
      c.target = null;
      c.velocity = 0;
      startX = lastX = e.clientX;
      lastT = performance.now();
      moved = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!c.dragging) return;
      const dx = e.clientX - lastX;
      const t = performance.now();
      c.angle += dx * degPerPx * 1.4;
      c.velocity = (dx * degPerPx * 1.4) / Math.max(0.008, (t - lastT) / 1000);
      lastX = e.clientX;
      lastT = t;
      moved = Math.max(moved, Math.abs(e.clientX - startX));
      if (moved > 6) stage.setPointerCapture(e.pointerId);
    };
    const onUp = () => {
      if (!c.dragging) return;
      c.dragging = false;
      if (performance.now() - lastT > 80) c.velocity = 0;
    };
    // a drag should not also count as a click on a card link
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };
    // pause only while the cursor rests on the front card, so it can be read and clicked
    const onHover = (e: PointerEvent) => (c.hover = !!(e.target as Element | null)?.closest?.('[data-front]'));
    const onLeave = () => (c.hover = false);

    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    stage.addEventListener('click', onClick, true);
    stage.addEventListener('pointermove', onHover);
    stage.addEventListener('pointerleave', onLeave);
    const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
    io.observe(stage);

    render();
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      stage.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      stage.removeEventListener('click', onClick, true);
      stage.removeEventListener('pointermove', onHover);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [radius]);

  const go = (dir: number) => {
    const c = ctrl.current;
    const base = c.target ?? c.angle;
    c.velocity = 0;
    c.target = (Math.round(base / STEP) - dir) * STEP;
  };

  // narrow (phone) cards need relatively more height for the same text
  const cardHeight = Math.round(cardWidth * (cardWidth < 320 ? 1.5 : 1.32));

  return (
    <section id="projects" className="relative overflow-hidden bg-[#0C0C0C] px-5 pt-24 sm:px-8 sm:pt-32 md:px-10 md:pt-40">
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading mb-6 text-center font-black uppercase leading-none tracking-tight sm:mb-10"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Projects
        </h2>
      </FadeIn>

      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1);
          if (e.key === 'ArrowLeft') go(-1);
        }}
        className="relative mx-auto flex touch-pan-y select-none items-center justify-center outline-none"
        style={{ height: cardHeight + 60 + Math.round(radius * 0.18), perspective: '1600px', perspectiveOrigin: '50% 40%' }}
      >
        <div
          ref={ringRef}
          className="relative"
          style={{ width: cardWidth, height: cardHeight, transformStyle: 'preserve-3d' }}
        >
          {PROJECTS.map((project, i) => (
            <div
              key={project.name}
              ref={(el) => (cardRefs.current[i] = el)}
              className="absolute inset-0"
              style={{ transform: `rotateY(${i * STEP}deg) translateZ(${radius}px)` }}
              aria-hidden={i !== active}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
        {/* soft floor reflection under the ring */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[50%]"
          style={{ background: `radial-gradient(closest-side, ${PROJECTS[active].accent}33, transparent)`, filter: 'blur(8px)' }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center gap-6 pb-24 sm:pb-32">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D7E2EA]/30 text-[#D7E2EA] transition-colors hover:border-[#D7E2EA]"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          {PROJECTS.map((p, i) => (
            <span
              key={p.name}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === active ? 28 : 8, background: i === active ? p.accent : 'rgba(215,226,234,0.25)' }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D7E2EA]/30 text-[#D7E2EA] transition-colors hover:border-[#D7E2EA]"
        >
          <ArrowRight size={20} />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {PROJECTS[active].name}
      </p>
    </section>
  );
}
