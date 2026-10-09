import FadeIn from '../components/FadeIn';
import { JOURNEY } from '../content';

export default function JourneySection() {
  return (
    <section id="journey" className="bg-[#0C0C0C] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32">
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Journey
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {JOURNEY.map((step, i) => (
          <FadeIn key={step.title} delay={i * 0.1}>
            <div
              className="flex items-center gap-6 py-8 text-[#D7E2EA] sm:gap-10 sm:py-10 md:gap-14 md:py-12"
              style={{
                borderTop: '1px solid rgba(215, 226, 234, 0.15)',
                borderBottom: i === JOURNEY.length - 1 ? '1px solid rgba(215, 226, 234, 0.15)' : undefined,
              }}
            >
              <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-2 sm:gap-3">
                <span className="text-xs font-light uppercase tracking-widest opacity-60 sm:text-sm">{step.label}</span>
                <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                  {step.title}
                </h3>
                <p
                  className="max-w-2xl font-light leading-relaxed"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}
                >
                  {step.text}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
