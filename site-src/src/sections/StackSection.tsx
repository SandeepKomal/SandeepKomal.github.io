import FadeIn from '../components/FadeIn';
import { STACK } from '../content';

export default function StackSection() {
  return (
    <section
      id="stack"
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Stack
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {STACK.map((group, i) => (
          <FadeIn key={group.name} delay={i * 0.1}>
            <div
              className="flex items-center gap-6 py-8 text-[#0C0C0C] sm:gap-10 sm:py-10 md:gap-14 md:py-12"
              style={{
                borderTop: '1px solid rgba(12, 12, 12, 0.15)',
                borderBottom: i === STACK.length - 1 ? '1px solid rgba(12, 12, 12, 0.15)' : undefined,
              }}
            >
              <span className="font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                  {group.name}
                </h3>
                <p
                  className="max-w-2xl font-light leading-relaxed"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}
                >
                  {group.tools}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
