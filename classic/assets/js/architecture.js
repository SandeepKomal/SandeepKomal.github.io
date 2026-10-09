import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js';

const root = document.querySelector('[data-architecture]');
const canvas = document.querySelector('#architecture-canvas');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!root || !canvas || !window.WebGLRenderingContext) {
  root?.classList.add('architecture-fallback');
  throw new Error('WebGL is not available.');
}

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: 'high-performance'
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(0, 1.1, 11);

const stage = new THREE.Group();
const network = new THREE.Group();
const nodes = [];
const links = [];
const particles = [];

stage.add(network);
scene.add(stage);

const ambient = new THREE.AmbientLight(0x6680ff, 1.25);
scene.add(ambient);

const keyLight = new THREE.PointLight(0x52d6ff, 18, 26, 2);
keyLight.position.set(2.4, 4.2, 5);
scene.add(keyLight);

const backLight = new THREE.PointLight(0x7c83ff, 14, 22, 2);
backLight.position.set(-4, -2, -2);
scene.add(backLight);

const nodeMaterial = (color) => new THREE.MeshBasicMaterial({ color });
const nodeGlowMaterial = (color) => new THREE.MeshBasicMaterial({
  color,
  transparent: true,
  opacity: 0.12,
  side: THREE.DoubleSide
});

const nodePalette = [0x67dfff, 0x8e96ff, 0x67dfff, 0x8e96ff, 0x5ee69d, 0x67dfff];

const points = [
  { id: 'github', label: 'GITHUB', pos: new THREE.Vector3(-3.9, 2.25, 0), size: 0.36 },
  { id: 'cicd', label: 'CI/CD', pos: new THREE.Vector3(-1.7, 0.8, 0), size: 0.30 },
  { id: 'aws', label: 'AWS', pos: new THREE.Vector3(0.55, 1.95, 0), size: 0.38 },
  { id: 'eks', label: 'KUBERNETES', pos: new THREE.Vector3(2.85, 0.65, 0), size: 0.34 },
  { id: 'security', label: 'SECURITY', pos: new THREE.Vector3(0.55, -1.15, 0), size: 0.31 },
  { id: 'observe', label: 'OBSERVABILITY', pos: new THREE.Vector3(3.95, -1.45, 0), size: 0.34 }
];

const pointMap = new Map();

points.forEach((point, index) => {
  const outer = new THREE.Mesh(
    new THREE.SphereGeometry(point.size * 1.55, 20, 20),
    nodeGlowMaterial(nodePalette[index])
  );
  outer.position.copy(point.pos);

  const inner = new THREE.Mesh(
    new THREE.SphereGeometry(point.size, 20, 20),
    nodeMaterial(nodePalette[index])
  );
  inner.position.copy(point.pos);

  outer.userData.baseScale = 1;
  inner.userData.baseScale = 1;

  network.add(outer, inner);
  pointMap.set(point.id, point.pos);
  nodes.push({ point, outer, inner, index });
});

const edges = [
  ['github', 'cicd'],
  ['cicd', 'aws'],
  ['aws', 'eks'],
  ['cicd', 'security'],
  ['security', 'eks'],
  ['eks', 'observe'],
  ['security', 'observe']
];

function addLink(from, to) {
  const a = pointMap.get(from);
  const b = pointMap.get(to);
  const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);
  const material = new THREE.LineBasicMaterial({
    color: 0x5c77c9,
    transparent: true,
    opacity: 0.35
  });
  const line = new THREE.Line(geometry, material);
  network.add(line);
  links.push({ from, to, a, b, line });
}

edges.forEach(([from, to]) => addLink(from, to));

const particleGeometry = new THREE.SphereGeometry(0.075, 10, 10);
const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x76e6ff });

links.forEach((link, index) => {
  const particle = new THREE.Mesh(particleGeometry, particleMaterial);
  network.add(particle);
  particles.push({
    mesh: particle,
    link,
    offset: (index * 0.17) % 1,
    speed: 0.12 + (index % 3) * 0.035
  });
});

const ring = new THREE.Mesh(
  new THREE.TorusGeometry(4.65, 0.008, 8, 180),
  new THREE.MeshBasicMaterial({ color: 0x4f6cff, transparent: true, opacity: 0.22 })
);
ring.rotation.x = Math.PI * 0.14;
network.add(ring);

const grid = new THREE.GridHelper(11, 18, 0x263c70, 0x13203a);
grid.position.y = -2.65;
grid.rotation.x = 0;
grid.material.transparent = true;
grid.material.opacity = 0.19;
network.add(grid);

const pointer = { x: 0, y: 0 };
let targetRotationX = 0;
let targetRotationY = 0;

if (!reduceMotion) {
  root.addEventListener('pointermove', (event) => {
    const rect = root.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  }, { passive: true });

  root.addEventListener('pointerleave', () => {
    pointer.x = 0;
    pointer.y = 0;
  });
}

function resize() {
  const rect = root.getBoundingClientRect();
  const width = Math.max(rect.width, 280);
  const height = Math.max(rect.height, 360);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();

  targetRotationY = pointer.x * 0.13;
  targetRotationX = pointer.y * -0.07;

  if (!reduceMotion) {
    stage.rotation.y += (targetRotationY - stage.rotation.y) * 0.035;
    stage.rotation.x += (targetRotationX - stage.rotation.x) * 0.035;
    stage.rotation.z = Math.sin(elapsed * 0.22) * 0.014;
    network.rotation.y = Math.sin(elapsed * 0.18) * 0.035;
    ring.rotation.z += 0.0014;

    particles.forEach((particle) => {
      const progress = (elapsed * particle.speed + particle.offset) % 1;
      particle.mesh.position.lerpVectors(particle.link.a, particle.link.b, progress);
    });

    nodes.forEach((node, index) => {
      const pulse = 1 + Math.sin(elapsed * 1.35 + index * 0.7) * 0.06;
      node.outer.scale.setScalar(pulse);
    });
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

root.classList.add('architecture-ready');
animate();
