// All page text lives here -- edit this file to update the site.

import komoraImg from './assets/projects/komora.webp';
import pasteSafeImg from './assets/projects/paste-safe.webp';
import git3dImg from './assets/projects/git3d-universe.webp';
import neonArenaImg from './assets/projects/neon-arena.webp';
import glassfolioImg from './assets/projects/glassfolio.webp';
import devsecopsImg from './assets/projects/devsecops.webp';

export const LINKS = {
  email: 'mailto:sandeepkomalp@gmail.com',
  github: 'https://github.com/SandeepKomal',
  linkedin: 'https://www.linkedin.com/in/sandeep-komal-pothu-ba4497283',
  medium: 'https://sandeepkomalp.medium.com',
};

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#stack' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const HERO_TAGLINE = 'cloud, devops & devsecops engineer building automated, secure and observable systems';

// Marquee rows: first 11 move right, the rest move left.
export const MARQUEE_TOOLS = [
  'AWS', 'EKS', 'Terraform', 'Docker', 'Kubernetes', 'Helm', 'Ansible', 'Python', 'GitHub Actions', 'Jenkins', 'Harness',
  'CodeQL', 'SonarQube', 'Trivy', 'Checkov', 'Kyverno', 'Falco', 'Prometheus', 'Grafana', 'Vault', 'Splunk',
];

export const ABOUT_TEXT =
  "Automate the repeatable. Secure the critical. Observe the whole system. I'm Sandeep Komal, and I enjoy turning infrastructure and delivery problems into repeatable engineering systems across AWS, Kubernetes, Terraform, CI/CD, security automation and observability.";

export const ABOUT_STATS = [
  { title: 'Cloud', text: 'AWS-first infrastructure' },
  { title: 'Platform', text: 'Kubernetes & containers' },
  { title: 'Delivery', text: 'CI/CD automation' },
  { title: 'Security', text: 'Shift-left controls' },
];

export const STACK = [
  { name: 'Cloud', tools: 'AWS · EC2 · EKS · ECS · ECR · S3 · RDS · IAM · VPC · Route 53' },
  { name: 'Platform', tools: 'Kubernetes · Docker · Helm · kind · RBAC · Network Policies · HPA · StatefulSets' },
  { name: 'Automation', tools: 'Terraform · Ansible · Python · Shell · GitHub Actions · Jenkins · Harness' },
  { name: 'Security', tools: 'CodeQL · SonarQube · Trivy · Checkov · Kyverno · Falco · OWASP ZAP' },
  { name: 'Observability', tools: 'Prometheus · Grafana · Alertmanager · Node Exporter · Blackbox Exporter · Splunk' },
  { name: 'Secrets', tools: 'AWS Secrets Manager · External Secrets Operator · Vault' },
];

// scenes: three [palette index, layout variant] pairs for the card artwork
// Preview images live in assets/projects (KOMORA and DevSecOps art is drawn for this site).
export const PROJECTS = [
  {
    name: 'KOMORA',
    category: 'Cloud Native',
    description: 'A Flask e-commerce storefront and admin, shipped to Kubernetes with restricted pod security, default-deny networking, Kyverno policies and a fully scanned CI/CD pipeline.',
    stack: ['Flask', 'Kubernetes', 'Kyverno', 'Trivy'],
    href: 'https://github.com/SandeepKomal/komorapy_v4',
    image: komoraImg,
    accent: '#7EE787',
  },
  {
    name: 'Paste-Safe',
    category: 'Security Tool',
    description: 'Strips secrets out of logs and configs before you paste them into an AI, then puts the real values back into its answer. Runs entirely in your browser.',
    stack: ['JavaScript', 'PWA', 'CodeQL', 'Playwright'],
    href: 'https://github.com/SandeepKomal/paste-safe',
    live: 'https://sandeepkomal.github.io/paste-safe/',
    image: pasteSafeImg,
    accent: '#FFB000',
  },
  {
    name: 'Git3D Universe',
    category: 'GitHub Action',
    description: 'Turns a year of GitHub activity into a living 3D contribution universe: month wedges round a glowing core, with top repositories orbiting as planets.',
    stack: ['GitHub Actions', 'SVG', 'Automation'],
    href: 'https://github.com/SandeepKomal/Git3D-Universe',
    image: git3dImg,
    accent: '#B600A8',
  },
  {
    name: 'Neon Arena',
    category: 'GitHub Action',
    description: 'A GitHub Action that turns a year of contributions into a neon 3D stadium SVG: lit bars, a wrap-around LED ribbon of top repositories and a streak light-cycle.',
    stack: ['GitHub Actions', 'SVG', 'Marketplace'],
    href: 'https://github.com/SandeepKomal/Neon-Arena',
    image: neonArenaImg,
    accent: '#3FD0E0',
  },
  {
    name: 'README-Glassfolio',
    category: 'Profile Tooling',
    description: 'A free, browser-based generator that turns any GitHub username into a live, themed, self-updating profile README with stats, a heatmap and a 3D contribution universe.',
    stack: ['JavaScript', 'GitHub API', 'Actions'],
    href: 'https://github.com/SandeepKomal/README-Glassfolio',
    live: 'https://sandeepkomal.github.io/README-Glassfolio/',
    image: glassfolioImg,
    accent: '#8C8CFF',
  },
  {
    name: 'DevSecOps',
    category: 'Security',
    description: 'A defense-in-depth security lab in GitHub Actions: secrets, SAST, SCA, IaC, container and DAST scanning with SBOMs and supply-chain checks.',
    stack: ['CodeQL', 'Semgrep', 'Trivy', 'OWASP ZAP'],
    href: 'https://github.com/SandeepKomal/DevSecOps',
    image: devsecopsImg,
    accent: '#FF8A3D',
  },
] as const;

export const JOURNEY = [
  {
    label: 'Professional experience',
    title: 'Application Operations · Cloud & Automation',
    text: 'Experience working across application operations, cloud platforms, automation, delivery workflows and production support.',
  },
  {
    label: 'Engineering projects',
    title: 'DevOps → DevSecOps → Platform Engineering',
    text: 'Building hands-on projects around AWS, Kubernetes, CI/CD, security automation, infrastructure as code and observability.',
  },
  {
    label: 'Public building',
    title: 'Open-source tooling & technical writing',
    text: 'Sharing experiments, reusable workflows and engineering lessons through GitHub projects and technical writing.',
  },
];
