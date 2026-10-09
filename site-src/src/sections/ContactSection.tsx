import { ArrowUpRight } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { LINKS } from '../content';

const CONTACTS = [
  { label: 'GitHub', href: LINKS.github },
  { label: 'LinkedIn', href: LINKS.linkedin },
  { label: 'Medium', href: LINKS.medium },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="rounded-t-[40px] bg-white px-5 pb-10 pt-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center">
        <FadeIn delay={0} y={30}>
          <p className="text-xs font-light uppercase tracking-widest opacity-60 sm:text-sm">Learning in public</p>
          <p
            className="mx-auto mt-4 max-w-[640px] font-light leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)' }}
          >
            I write about AWS, Kubernetes, DevOps, DevSecOps and cloud-native engineering, explaining concepts through
            things I actually build.{' '}
            <a href={LINKS.medium} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">
              Read my technical writing
            </a>
            .
          </p>
        </FadeIn>

        <FadeIn delay={0.1} y={40}>
          <h2 className="font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            Let&apos;s connect
          </h2>
        </FadeIn>

        <FadeIn delay={0.2} y={20}>
          <p className="mx-auto max-w-[560px] font-light leading-relaxed opacity-70" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)' }}>
            Have a cloud, DevOps or platform problem to discuss? For collaboration, project conversations or professional
            opportunities, reach out on any of these.
          </p>
        </FadeIn>

        <FadeIn delay={0.3} y={20} className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#0C0C0C] px-8 py-3 text-sm font-medium uppercase tracking-widest transition-colors duration-200 hover:bg-[#0C0C0C] hover:text-white sm:px-10 sm:py-3.5 sm:text-base"
            >
              {c.label}
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          ))}
        </FadeIn>
      </div>

      <footer className="mx-auto mt-24 flex max-w-5xl flex-col items-center justify-between gap-2 border-t border-[#0C0C0C]/15 pt-6 text-xs uppercase tracking-widest opacity-60 sm:flex-row sm:text-sm">
        <span>© {new Date().getFullYear()} Sandeep Komal</span>
        <a href="./classic/" className="hover:opacity-70">
          Classic portfolio
        </a>
      </footer>
    </section>
  );
}
