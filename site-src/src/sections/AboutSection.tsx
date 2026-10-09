import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';
import { Brick, Moon, Spheres, Torus } from '../art/Shapes';
import { ABOUT_STATS, ABOUT_TEXT } from '../content';

const DECORATIONS = [
  {
    Art: Moon,
    className: 'top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]',
    delay: 0.1,
    x: -80,
  },
  {
    Art: Spheres,
    className: 'bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]',
    delay: 0.25,
    x: -80,
  },
  {
    Art: Brick,
    className: 'top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]',
    delay: 0.15,
    x: 80,
  },
  {
    Art: Torus,
    className: 'bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]',
    delay: 0.3,
    x: 80,
  },
];


export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center px-5 py-20 sm:px-8 md:px-10"
    >
      {DECORATIONS.map(({ Art, className, delay, x }, i) => (
        <FadeIn key={i} className={`pointer-events-none absolute ${className}`} delay={delay} x={x} y={0} duration={0.9}>
          <Art className="block w-full" />
        </FadeIn>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading text-center font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              About me
            </h2>
          </FadeIn>
          <AnimatedText
            text={ABOUT_TEXT}
            className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
          <div className="grid w-full max-w-[640px] grid-cols-2 gap-3 sm:grid-cols-4">
            {ABOUT_STATS.map((stat, i) => (
              <FadeIn key={stat.title} delay={i * 0.08} y={20}>
                <div className="h-full rounded-3xl border border-[#D7E2EA]/20 px-4 py-4 text-center">
                  <p className="font-semibold uppercase tracking-wider text-[#D7E2EA]">{stat.title}</p>
                  <p className="mt-1 text-sm font-light text-[#D7E2EA]/60">{stat.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
        <ContactButton />
      </div>
    </section>
  );
}
