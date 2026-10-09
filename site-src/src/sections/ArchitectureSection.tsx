import { lazy, Suspense } from 'react';
import FadeIn from '../components/FadeIn';

// Three.js is large, so the map loads as its own chunk after the rest of the page
const ArchitectureCanvas = lazy(() => import('../components/ArchitectureCanvas'));

const LEGEND = [
  { label: 'Delivery', color: '#67DFFF' },
  { label: 'Platform', color: '#8E96FF' },
  { label: 'Security', color: '#5EE69D' },
];

export default function ArchitectureSection() {
  return (
    <section
      id="architecture"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading mb-10 text-center font-black uppercase leading-none tracking-tight sm:mb-12"
          style={{ fontSize: 'clamp(2.6rem, 10vw, 140px)' }}
        >
          Architecture
        </h2>
      </FadeIn>
      <FadeIn delay={0.1} y={20}>
        <p
          className="mx-auto mb-10 max-w-[620px] text-center font-light leading-relaxed text-[#D7E2EA] sm:mb-14"
          style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)' }}
        >
          From commit to production, visualized. Move your cursor over the map to explore how I think about delivery:
          source control, CI/CD, cloud infrastructure, Kubernetes, security and observability.
        </p>
      </FadeIn>
      <FadeIn delay={0.2} y={30} className="mx-auto max-w-6xl">
        <Suspense
          fallback={
            <div className="h-[360px] w-full rounded-[40px] border-2 border-[#D7E2EA] sm:h-[440px] sm:rounded-[50px] md:h-[520px] md:rounded-[60px]" />
          }
        >
          <ArchitectureCanvas />
        </Suspense>
        <div className="mt-6 flex justify-center gap-6 text-xs uppercase tracking-widest text-[#D7E2EA]/70 sm:text-sm">
          {LEGEND.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-2">
              <i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
