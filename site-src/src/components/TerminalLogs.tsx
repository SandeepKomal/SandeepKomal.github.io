import { useEffect, useRef } from 'react';

// Hero background: faint terminal lines ("$ kubectl apply -f ✓") drifting slowly upward, each
// with a prompt in one of the Contact button's colours. Lines near the cursor brighten. Plain
// canvas 2D; pauses when scrolled out of view and draws a still frame for reduced motion.

const COMMANDS = [
  'kubectl apply -f deploy.yaml',
  'terraform plan -out=tfplan',
  'docker build -t app:1.4.2 .',
  'helm upgrade --install api ./chart',
  'aws eks update-kubeconfig',
  'trivy image app:1.4.2',
  'git push origin main',
  'argocd app sync api',
  'checkov -d infra/',
  'kubectl rollout status deploy/api',
  'terraform apply tfplan',
  'gh workflow run deploy.yml',
  'codeql database analyze',
  'kubectl get pods -n prod',
];
const PROMPT_COLOURS = ['#B600A8', '#7621B0', '#BE4C00'];
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";
const LINE_GAP = 40; // rows are evenly spaced and drift together, so lines never overlap
const SPEED = 0.3; // px per frame
const FADE = 120; // px over which lines fade in at the bottom and out at the top

type Line = { x: number; y: number; alpha: number; colour: string; cmd: string };

export default function TerminalLogs({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -1e4, y: -1e4 };
    let width = 0;
    let height = 0;
    let lines: Line[] = [];
    let frame = 0;
    let onScreen = true;

    const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
    const newLine = (y: number): Line => ({
      x: Math.random() * Math.max(1, width - (width < 640 ? 260 : 340)),
      y,
      alpha: 0.08 + Math.random() * 0.22,
      colour: pick(PROMPT_COLOURS),
      cmd: pick(COMMANDS),
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.ceil(height / LINE_GAP) + 1;
      const offset = lines[0] ? lines[0].y % LINE_GAP : 0;
      lines = Array.from({ length: count }, (_, i) => newLine(offset + i * LINE_GAP));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${width < 640 ? 12 : 15}px ${MONO}`;
      ctx.textBaseline = 'middle';
      for (const line of lines) {
        const near = Math.max(0, 1 - Math.hypot(mouse.x - (line.x + 120), mouse.y - line.y) / 240);
        const edge = Math.max(0, Math.min(1, line.y / FADE, (height - line.y) / FADE));
        // keep the lines behind the big heading quieter so it stays crisp
        const heading = line.y < height * 0.3 ? 0.55 : 1;
        const alpha = edge * Math.min(1, line.alpha * heading + near * 0.6);
        if (alpha <= 0) continue;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = line.colour;
        ctx.fillText('$', line.x, line.y);
        ctx.fillStyle = near > 0.3 ? '#F3D9F7' : '#D7E2EA';
        ctx.fillText(line.cmd, line.x + 16, line.y);
        ctx.globalAlpha = alpha * 0.8;
        ctx.fillStyle = '#7EE787';
        ctx.fillText('  ✓', line.x + 16 + ctx.measureText(line.cmd).width, line.y);
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!onScreen) return;
      for (let i = 0; i < lines.length; i++) {
        lines[i].y -= SPEED;
        // recycle a row that left the top to the bottom of the stack, keeping the spacing
        if (lines[i].y < -LINE_GAP / 2) lines[i] = newLine(lines[i].y + lines.length * LINE_GAP);
      }
      draw();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      if (reduceMotion) draw();
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
    io.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    if (reduceMotion) draw();
    else frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
