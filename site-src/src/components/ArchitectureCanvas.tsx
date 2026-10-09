import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Interactive delivery-pipeline map: GitHub → CI/CD → AWS → Kubernetes, with
// security and observability, drawn in WebGL with particles flowing along each link.

// Each node gets its own 3D shape: a gem for source control, a loop for CI/CD, a cloud for AWS,
// a heptagon prism for Kubernetes, a crystal for security and a radar orb for observability.
const NODES = [
  { id: 'github', label: 'GitHub', pos: [-3.9, 2.25], size: 0.36, color: 0x1fa8e0, shape: 'gem' },
  { id: 'cicd', label: 'CI/CD', pos: [-1.7, 0.8], size: 0.3, color: 0x6b4dff, shape: 'loop' },
  { id: 'aws', label: 'AWS', pos: [0.55, 1.95], size: 0.38, color: 0xff8a1f, shape: 'cloud' },
  { id: 'eks', label: 'Kubernetes', pos: [2.85, 0.65], size: 0.34, color: 0x3360ff, shape: 'heptagon' },
  { id: 'security', label: 'Security', pos: [0.55, -1.15], size: 0.31, color: 0x16c47a, shape: 'crystal' },
  { id: 'observe', label: 'Observability', pos: [3.95, -1.45], size: 0.34, color: 0x18b8e8, shape: 'radar' },
] as const;

type Shape = (typeof NODES)[number]['shape'];

/** Soft round glow used for node halos and the flowing particles */
function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Builds the 3D object for one node, centred on the origin */
function makeShape(shape: Shape, size: number, material: THREE.Material, track: (d: { dispose: () => void }) => void) {
  const group = new THREE.Group();
  const add = (geo: THREE.BufferGeometry, edges = false) => {
    track(geo);
    const mesh = new THREE.Mesh(geo, material);
    group.add(mesh);
    if (edges) {
      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 });
      track(edgeGeo);
      track(edgeMat);
      group.add(new THREE.LineSegments(edgeGeo, edgeMat));
    }
    return mesh;
  };

  switch (shape) {
    case 'gem':
      add(new THREE.IcosahedronGeometry(size * 1.05, 0), true);
      break;
    case 'loop': {
      add(new THREE.TorusGeometry(size * 0.85, size * 0.3, 24, 64));
      break;
    }
    case 'cloud': {
      const puffs: [number, number, number, number][] = [
        [0, 0.1, 0, 0.62],
        [-0.55, -0.12, 0, 0.45],
        [0.55, -0.1, 0, 0.48],
        [0.2, 0.42, -0.05, 0.4],
        [-0.25, 0.32, 0.05, 0.36],
      ];
      puffs.forEach(([x, y, z, r]) => add(new THREE.SphereGeometry(size * r * 1.25, 32, 24)).position.set(x * size * 1.3, y * size * 1.3, z));
      break;
    }
    case 'heptagon': {
      const prism = add(new THREE.CylinderGeometry(size * 1.05, size * 1.05, size * 0.55, 7), true);
      prism.rotation.x = Math.PI / 2;
      break;
    }
    case 'crystal': {
      const crystal = add(new THREE.OctahedronGeometry(size * 1.05, 0), true);
      crystal.scale.set(0.85, 1.35, 0.85);
      break;
    }
    case 'radar':
      add(new THREE.SphereGeometry(size * 0.75, 40, 28));
      break;
  }
  return group;
}

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    // Filmic tone mapping keeps highlights soft instead of blown out
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.1, 11);

    const stage = new THREE.Group();
    const network = new THREE.Group();
    stage.add(network);
    scene.add(stage);

    const positions = new Map<string, THREE.Vector3>();
    const disposables: { dispose: () => void }[] = [];
    const track = (d: { dispose: () => void }) => disposables.push(d);

    // Studio reflections + soft key/rim lights give the shapes a polished, product-render look
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    track(envMap);
    scene.environment = envMap;
    scene.add(new THREE.AmbientLight(0x8090ff, 0.25));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0xb600a8, 8, 20, 2);
    rim.position.set(4, -2, 3);
    scene.add(rim);

    const glowTexture = makeGlowTexture();
    track(glowTexture);

    const nodeObjects = NODES.map((node, i) => {
      const pos = new THREE.Vector3(node.pos[0], node.pos[1], 0);
      positions.set(node.id, pos);
      const holder = new THREE.Group();
      holder.position.copy(pos);
      network.add(holder);

      const faceted = node.shape === 'gem' || node.shape === 'crystal' || node.shape === 'heptagon';
      const material = new THREE.MeshPhysicalMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.04,
        metalness: faceted ? 0.15 : 0.3,
        roughness: faceted ? 0.08 : 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 0.7,
        flatShading: faceted,
      });
      track(material);
      const body = makeShape(node.shape, node.size * 1.35, material, track);
      holder.add(body);

      // Halo behind the object
      const haloMat = new THREE.SpriteMaterial({
        map: glowTexture,
        color: node.color,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      track(haloMat);
      const halo = new THREE.Sprite(haloMat);
      halo.scale.setScalar(node.size * 5.5);
      halo.position.z = -0.3;
      holder.add(halo);

      // Thin orbit ring around each node (the radar node gets a bolder one)
      const orbitGeo = new THREE.TorusGeometry(node.size * 2.1, node.shape === 'radar' ? 0.028 : 0.012, 8, 96);
      const orbitMat = new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: node.shape === 'radar' ? 0.7 : 0.3 });
      track(orbitGeo);
      track(orbitMat);
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.rotation.set(Math.PI * 0.42, 0, i * 0.6);
      holder.add(orbit);

      return { body, halo, orbit, holder, baseScale: 1, hover: 0 };
    });

    const lineMat = new THREE.LineBasicMaterial({ color: 0x6f8cff, transparent: true, opacity: 0.45 });
    const particleMat = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x9ff0ff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    disposables.push(lineMat, particleMat);

    const particles = EDGES.map(([from, to], i) => {
      const a = positions.get(from)!;
      const b = positions.get(to)!;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([a, b]);
      disposables.push(lineGeo);
      network.add(new THREE.Line(lineGeo, lineMat));

      const mesh = new THREE.Sprite(particleMat);
      mesh.scale.setScalar(0.32);
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

    const pointer = { x: 0, y: 0, inside: false };
    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
      pointer.inside = false;
    };
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let hovered = -1;
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

        // Which node is under the cursor?
        hovered = -1;
        if (pointer.inside) {
          ndc.set(pointer.x, -pointer.y);
          raycaster.setFromCamera(ndc, camera);
          const hit = raycaster.intersectObjects(nodeObjects.map((n) => n.body), true)[0];
          if (hit) hovered = nodeObjects.findIndex((n) => n.body === hit.object.parent || n.body === hit.object);
        }

        nodeObjects.forEach((n, i) => {
          n.hover += ((i === hovered ? 1 : 0) - n.hover) * 0.12;
          if (NODES[i].shape === 'loop' || NODES[i].shape === 'heptagon') {
            // Flat shapes spin in the screen plane so they never turn edge-on
            n.body.rotation.z = t * 0.6 + i;
            n.body.rotation.y = Math.sin(t * 0.7 + i) * 0.45;
          } else {
            n.body.rotation.y = t * 0.5 + i;
            n.body.rotation.x = Math.sin(t * 0.6 + i) * 0.25;
          }
          n.holder.position.y = NODES[i].pos[1] + Math.sin(t * 1.1 + i * 0.9) * 0.08;
          n.body.scale.setScalar(1 + n.hover * 0.28);
          (n.halo.material as THREE.SpriteMaterial).opacity = 0.16 + n.hover * 0.22;
          n.orbit.rotation.z = t * (0.4 + i * 0.07) + i;
          n.halo.scale.setScalar(NODES[i].size * (5.5 + n.hover * 2) * (1 + Math.sin(t * 1.35 + i * 0.7) * 0.05));
        });
      }

      renderer.render(scene, camera);

      // Pin the HTML labels under each node
      NODES.forEach((node, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        projected.set(node.pos[0], node.pos[1] - node.size * 1.35 - 0.5, 0);
        projected.applyMatrix4(network.matrixWorld).project(camera);
        el.style.transform = `translate(-50%, 0) translate(${((projected.x + 1) / 2) * width}px, ${((1 - projected.y) / 2) * height}px)`;
        el.style.color = i === hovered ? '#FFFFFF' : '';
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
