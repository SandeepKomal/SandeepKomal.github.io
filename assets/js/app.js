const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer:fine)').matches;

toggle?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    links.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section .reveal, .contact.reveal, .signal-strip.reveal')
  .forEach((el) => revealObserver.observe(el));

const hasGsap = typeof window.gsap !== 'undefined';
const hasLenis = typeof window.Lenis !== 'undefined';

if (!reducedMotion && hasGsap) {
  gsap.registerPlugin(ScrollTrigger);

  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTimeline
    .from('.hero-copy .eyebrow', { y: 18, opacity: 0, duration: 0.7 })
    .from('.hero h1', { y: 32, opacity: 0, duration: 0.9 }, '-=0.35')
    .from('.hero-text', { y: 20, opacity: 0, duration: 0.65 }, '-=0.55')
    .from('.hero-actions .btn', { y: 14, opacity: 0, stagger: 0.1, duration: 0.45 }, '-=0.35')
    .from('.social-row a', { y: 10, opacity: 0, stagger: 0.07, duration: 0.35 }, '-=0.2')
    .from('.terminal-card', { y: 26, opacity: 0, scale: 0.97, rotateX: -4, duration: 0.9 }, '-=0.7');

  gsap.utils.toArray('.signal-strip > div').forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%', once: true },
      y: 24,
      opacity: 0,
      duration: 0.55,
      delay: index * 0.06,
      ease: 'power2.out'
    });
  });

  gsap.utils.toArray('.section-content').forEach((section) => {
    gsap.from(section, {
      scrollTrigger: { trigger: section, start: 'top 82%', once: true },
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    });
  });

  gsap.utils.toArray('.skill').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      y: 22,
      opacity: 0,
      scale: 0.985,
      duration: 0.52,
      delay: (index % 2) * 0.08,
      ease: 'power2.out'
    });
  });

  gsap.utils.toArray('.project').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 86%', once: true },
      y: 26,
      opacity: 0,
      scale: 0.985,
      duration: 0.6,
      delay: (index % 2) * 0.09,
      ease: 'power3.out'
    });
  });

  gsap.utils.toArray('.timeline-item').forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%', once: true },
      x: -18,
      opacity: 0,
      duration: 0.6,
      delay: index * 0.08,
      ease: 'power2.out'
    });
  });

  gsap.to('.orbit-a', {
    yPercent: -12,
    rotation: 8,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
  });

  gsap.to('.orbit-b', {
    yPercent: -20,
    rotation: -12,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
  });

  gsap.to('.ambient-one', {
    yPercent: 12,
    xPercent: -8,
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2.5 }
  });

  gsap.to('.ambient-two', {
    yPercent: -15,
    xPercent: 7,
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 3 }
  });
}

if (!reducedMotion && hasLenis) {
  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: !hasGsap
  });

  if (hasGsap) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
}

const progress = document.querySelector('.scroll-progress');
const updateProgress = () => {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const value = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
  if (progress) progress.style.transform = `scaleX(${value / 100})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

if (!reducedMotion && finePointer) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.body.classList.add('has-pointer');

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener('pointermove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  }, { passive: true });

  const animateGlow = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.transform = `translate3d(${currentX}px,${currentY}px,0) translate(-50%,-50%)`;
    requestAnimationFrame(animateGlow);
  };
  animateGlow();

  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      button.style.transform = `translate(${x * 0.08}px,${y * 0.08}px) translateY(-2px)`;
    });

    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
  });

  document.querySelectorAll('.terminal-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 5;
      const rotateX = (0.5 - y) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
