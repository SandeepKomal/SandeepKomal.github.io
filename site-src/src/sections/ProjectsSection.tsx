import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import LiveProjectButton from '../components/LiveProjectButton';
import Scene, { PALETTES } from '../art/Scene';
import { PROJECTS } from '../content';

const IMAGE_RADIUS = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';

type Project = (typeof PROJECTS)[number];

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const [colOneTop, colOneBottom, colTwo] = project.scenes.map(([palette, variant], i) => (
    <Scene key={i} palette={PALETTES[palette]} variant={variant} className="h-full w-full" />
  ));

  return (
    <div className="sticky top-24 flex h-[85vh] items-start justify-center md:top-32">
      <motion.div
        className="w-full origin-top rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
        style={{ scale, top: `${index * 28}px`, position: 'relative' }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1">
              <span
                className="font-light uppercase tracking-widest text-[#D7E2EA]/60"
                style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)' }}
              >
                {project.category}
              </span>
              <h3 className="font-medium uppercase text-[#D7E2EA]" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                {project.name}
              </h3>
              <div className="mt-1 hidden flex-wrap gap-2 sm:flex">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#D7E2EA]/30 px-3 py-0.5 text-xs uppercase tracking-wider text-[#D7E2EA]/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <LiveProjectButton href={project.href} label="View Repo" />
        </div>

        <p
          className="mb-4 max-w-3xl font-light leading-relaxed text-[#D7E2EA]/70 sm:mb-6"
          style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }}
        >
          {project.description}
        </p>

        <div className="flex gap-3 sm:gap-4" aria-hidden="true">
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4">
            <div className={`w-full overflow-hidden ${IMAGE_RADIUS}`} style={{ height: 'clamp(110px, 13vw, 200px)' }}>
              {colOneTop}
            </div>
            <div className={`w-full overflow-hidden ${IMAGE_RADIUS}`} style={{ height: 'clamp(130px, 18vw, 280px)' }}>
              {colOneBottom}
            </div>
          </div>
          <div className="w-[60%]">
            <div className={`h-full w-full overflow-hidden ${IMAGE_RADIUS}`}>{colTwo}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section id="projects" className="relative bg-[#0C0C0C] px-5 pt-24 sm:px-8 sm:pt-32 md:px-10 md:pt-40">
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Projects
        </h2>
      </FadeIn>

      <div ref={ref} className="mx-auto max-w-6xl">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} total={PROJECTS.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
