import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Interactive delivery-pipeline map: GitHub → CI/CD → AWS → Kubernetes, with
// security and observability, drawn in WebGL with particles flowing along each link.

const NODES = [
  { id: 'github', label: 'GitHub', pos: [-3.9, 2.25], size: 0.36, color: 0x67dfff },
  { id: 'cicd', label: 'CI/CD', pos: [-1.7, 0.8], size: 0.3, color: 0x8e96ff },
  { id: 'aws', label: 'AWS', pos: [0.55, 1.95], size: 0.38, color: 0x67dfff },
  { id: 'eks', label: 'Kubernetes', pos: [2.85, 0.65], size: 0.34, color: 0x8e96ff },
  { id: 'security', label: 'Security', pos: [0.55, -1.15], size: 0.31, color: 0x5ee69d },
  { id: 'observe', label: 'Observability', pos: [3.95, -1.45], size: 0.34, color: 0x67dfff },
] as const;

const EDGES = [
  ['github', 'cicd'],
  ['cicd', 'aws'],
  ['aws', 'eks'],
  ['cicd', 'security'],
  ['security', 'eks'],
  ['eks', 'observe'],
  ['security', 'observe'],
] as const;

export default function ArchitectureCanvas() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      root.dataset.fallback = 'true';
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.1, 11);

    const stage = new THREE.Group();
    const network = new THREE.Group();
    stage.add(network);
    scene.add(stage);

    const positions = new Map<string, THREE.Vector3>();
    const glows: THREE.Mesh[] = [];
    const disposables: { dispose: () => void }[] = [];

    NODES.forEach((node) => {
      const pos = new THREE.Vector3(node.pos[0], node.pos[1], 0);
      positions.set(node.id, pos);

      const glowGeo = new THREE.SphereGeometry(node.size * 1.55, 20, 20);
      const glowMat = new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.12 });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.copy(pos);

      const coreGeo = new THREE.SphereGeometry(node.size, 20, 20);
      const coreMat = new THREE.MeshBasicMaterial({ color: node.color });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.copy(pos);

      network.add(glow, core);
      glows.push(glow);
      disposables.push(glowGeo, glowMat, coreGeo, coreMat);
    });

    const lineMat = new THREE.LineBasicMaterial({ color: 0x5c77c9, transparent: true, opacity: 0.35 });
    const particleGeo = new THREE.SphereGeometry(0.075, 10, 10);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x76e6ff });
    disposables.push(lineMat, particleGeo, particleMat);

    const particles = EDGES.map(([from, to], i) => {
      const a = positions.get(from)!;
      const b = positions.get(to)!;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([a, b]);
      disposables.push(lineGeo);
      network.add(new THREE.Line(lineGeo, lineMat));

      const mesh = new THREE.Mesh(particleGeo, particleMat);
      network.add(mesh);
      return { mesh, a, b, offset: (i * 0.17) % 1, speed: 0.12 + (i % 3) * 0.035 };
    });

    const ringGeo = new THREE.TorusGeometry(4.65, 0.008, 8, 180);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4f6cff, transparent: true, opacity: 0.22 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.14;
    network.add(ring);
    disposables.push(ringGeo, ringMat);

    const grid = new THREE.GridHelper(11, 18, 0x263c70, 0x13203a);
    grid.position.y = -2.65;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.19;
    network.add(grid);
    disposables.push(grid.geometry, grid.material as THREE.Material);

    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    if (!reduceMotion) {
      root.addEventListener('pointermove', onMove, { passive: true });
      root.addEventListener('pointerleave', onLeave);
    }

    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = root.getBoundingClientRect();
      width = Math.max(rect.width, 280);
      height = Math.max(rect.height, 320);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Pull the camera back on narrow screens so all nodes (about ±5 units wide) stay in view
      const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
      camera.position.z = Math.max(11, 5.2 / (Math.tan(halfFov) * camera.aspect));
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    resize();

    // Only animate while the canvas is on screen
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(root);

    const clock = new THREE.Clock();
    const projected = new THREE.Vector3();
    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!visible) return;
      const t = clock.getElapsedTime();

      if (!reduceMotion) {
        stage.rotation.y += (pointer.x * 0.13 - stage.rotation.y) * 0.035;
        stage.rotation.x += (pointer.y * -0.07 - stage.rotation.x) * 0.035;
        stage.rotation.z = Math.sin(t * 0.22) * 0.014;
        network.rotation.y = Math.sin(t * 0.18) * 0.035;
        ring.rotation.z += 0.0014;
        particles.forEach((p) => p.mesh.position.lerpVectors(p.a, p.b, (t * p.speed + p.offset) % 1));
        glows.forEach((g, i) => g.scale.setScalar(1 + Math.sin(t * 1.35 + i * 0.7) * 0.06));
      }

      renderer.render(scene, camera);

      // Pin the HTML labels under each node
      NODES.forEach((node, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        projected.set(node.pos[0], node.pos[1] - node.size - 0.35, 0);
        projected.applyMatrix4(network.matrixWorld).project(camera);
        el.style.transform = `translate(-50%, 0) translate(${((projected.x + 1) / 2) * width}px, ${((1 - projected.y) / 2) * height}px)`;
      });
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative h-[360px] w-full overflow-hidden rounded-[40px] border-2 border-[#D7E2EA] sm:h-[440px] sm:rounded-[50px] md:h-[520px] md:rounded-[60px]"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #12183a 0%, #0C0C0C 70%)' }}
      aria-label="Interactive map of a delivery pipeline: GitHub, CI/CD, AWS, Kubernetes, security and observability"
      role="img"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {NODES.map((node, i) => (
        <span
          key={node.id}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          className="pointer-events-none absolute left-0 top-0 whitespace-nowrap text-[10px] font-medium uppercase tracking-widest text-[#D7E2EA]/80 sm:text-xs"
        >
          {node.label}
        </span>
      ))}
      <div className="pointer-events-none absolute left-6 top-5 flex gap-4 text-[10px] uppercase tracking-widest text-[#D7E2EA]/50 sm:left-10 sm:top-7 sm:text-xs">
        <span>Live system map</span>
        <span>WebGL</span>
      </div>
    </div>
  );
}
