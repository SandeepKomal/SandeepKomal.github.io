// All page text lives here -- edit this file to update the site.

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
export const PROJECTS = [
  {
    name: 'Git3D Universe',
    category: 'GitHub Action',
    description: 'A custom GitHub visualization project turning developer activity into a distinctive 3D-style profile experience.',
    tags: ['GitHub Actions', 'SVG', 'Automation'],
    href: 'https://github.com/SandeepKomal/Git3D-Universe',
    scenes: [[0, 1], [0, 3], [0, 0]],
  },
  {
    name: 'KOMORA',
    category: 'Cloud Native',
    description: 'A cloud-native application platform combining Kubernetes deployment, security controls, secrets management and CI/CD automation.',
    tags: ['AWS', 'Kubernetes', 'Kyverno'],
    href: 'https://github.com/SandeepKomal/KOMORAPY_V4',
    scenes: [[1, 2], [1, 1], [1, 0]],
  },
  {
    name: 'DevSecOps',
    category: 'Security',
    description: 'Security-focused delivery workflows bringing code, dependency, container and deployment controls into CI/CD.',
    tags: ['CodeQL', 'Trivy', 'GitHub Actions'],
    href: 'https://github.com/SandeepKomal/DevSecOps',
    scenes: [[3, 3], [3, 0], [3, 2]],
  },
  {
    name: 'Profile Observatory',
    category: 'Profile Tooling',
    description: 'Experimental GitHub profile analytics and visualization work designed to make developer activity more useful and engaging.',
    tags: ['GitHub', 'Automation', 'Visualization'],
    href: 'https://github.com/SandeepKomal',
    scenes: [[4, 2], [4, 1], [4, 0]],
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
