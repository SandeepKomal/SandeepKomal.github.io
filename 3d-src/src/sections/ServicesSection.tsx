import FadeIn from '../components/FadeIn';

const SERVICES = [
  {
    name: '3D Modeling',
    description:
      'Precise, production-ready models of products, characters and spaces, built clean so they work in games, ads and real-time scenes.',
  },
  {
    name: 'Rendering',
    description:
      'Studio-grade stills with crafted lighting, materials and camera work that make a concept look finished before it exists.',
  },
  {
    name: 'Motion Design',
    description:
      'Animated sequences and loops that give products and brands rhythm, personality and a story worth watching.',
  },
  {
    name: 'Branding',
    description:
      'Visual identities with depth -- logos, 3D brand marks and asset kits that stay consistent everywhere they appear.',
  },
  {
    name: 'Web Design',
    description:
      'Fast, modern sites that pair strong layouts and typography with interactive 3D moments people remember.',
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Services
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {SERVICES.map((service, i) => (
          <FadeIn key={service.name} delay={i * 0.1}>
            <div
              className="flex items-center gap-6 py-8 text-[#0C0C0C] sm:gap-10 sm:py-10 md:gap-14 md:py-12"
              style={{
                borderTop: '1px solid rgba(12, 12, 12, 0.15)',
                borderBottom: i === SERVICES.length - 1 ? '1px solid rgba(12, 12, 12, 0.15)' : undefined,
              }}
            >
              <span className="font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                  {service.name}
                </h3>
                <p
                  className="max-w-2xl font-light leading-relaxed"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
