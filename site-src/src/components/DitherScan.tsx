import { useEffect, useRef } from 'react';

// Dithered scan-line shader gradient: a slow flowing gradient in the Contact button's
// purple → magenta → orange, quantised to chunky pixels with an 8×8 Bayer matrix, swept by a
// horizontal scan line. Glows around the cursor and ripples on click. Plain WebGL, no libraries.

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_hover;
uniform vec3 u_click;
uniform float u_pixel;

float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy / u_pixel);
  vec2 frag = (cell + 0.5) * u_pixel;
  vec2 uv = frag / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 q = vec2(uv.x * aspect, uv.y);
  float t = u_time;

  // domain-warped flowing field
  vec2 w = vec2(fbm(q * 1.6 + vec2(0.0, t * 0.05)), fbm(q * 1.6 + vec2(5.2, -t * 0.04)));
  float field = fbm(q * 2.2 + w * 1.8 + vec2(t * 0.03, 0.0));

  // brighter towards the bottom so the silver heading at the top stays readable
  float v = field * mix(1.05, 0.25, smoothstep(0.0, 1.0, uv.y));

  // scan line sweeping downward, with a dithered trail behind it
  float scanY = 1.0 - fract(t * 0.07);
  float d = uv.y - scanY;
  v += 0.55 * exp(-pow(d * 90.0, 2.0)) + 0.25 * exp(-max(d, 0.0) * 9.0) * step(0.0, d);

  // cursor glow
  vec2 m = u_mouse / u_res;
  float md = length((uv - m) * vec2(aspect, 1.0));
  v += u_hover * 0.6 * exp(-md * md * 18.0);

  // click ripple
  float age = t - u_click.z;
  if (age > 0.0 && age < 1.6) {
    vec2 c = u_click.xy / u_res;
    float cd = length((uv - c) * vec2(aspect, 1.0));
    v += 0.7 * exp(-pow((cd - age * 0.55) * 28.0, 2.0)) * (1.0 - age / 1.6);
  }

  v *= 0.5; // keep it subtle so the hero stays dark

  // ordered dithering into 5 levels
  float levels = 4.0;
  float lv = floor(clamp(v, 0.0, 1.0) * levels + bayer8(cell));
  lv = clamp(lv, 0.0, levels) / levels;

  // gradient hue across the screen, nudged by the flow field
  float h = clamp(uv.x + (w.x - 0.5) * 0.6, 0.0, 1.0);
  vec3 c1 = vec3(0.71, 0.0, 0.66);   // #B600A8
  vec3 c2 = vec3(0.46, 0.13, 0.69);  // #7621B0
  vec3 c3 = vec3(0.75, 0.30, 0.0);   // #BE4C00
  vec3 tint = h < 0.5 ? mix(c1, c2, h * 2.0) : mix(c2, c3, h * 2.0 - 1.0);
  vec3 bg = vec3(0.047);             // #0C0C0C
  vec3 col = mix(bg, tint, lv);
  col = mix(col, vec3(0.84, 0.89, 0.92), step(0.99, lv) * 0.35); // silver highlights at the peak level

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function DitherScan({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false });
    if (!canvas || !gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u('u_res'), uTime = u('u_time'), uMouse = u('u_mouse');
    const uHover = u('u_hover'), uClick = u('u_click'), uPixel = u('u_pixel');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };
    let hover = 0, hoverTarget = 0, clickT = -10, clickX = 0, clickY = 0;
    let frame = 0, onScreen = true;
    const start = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * dpr, y: (r.bottom - e.clientY) * dpr, inside: e.clientY >= r.top && e.clientY <= r.bottom };
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      mouse.tx = p.x;
      mouse.ty = p.y;
      if (hover < 0.01) { mouse.x = p.x; mouse.y = p.y; }
      hoverTarget = p.inside ? 1 : 0;
    };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e);
      if (!p.inside) return;
      clickX = p.x; clickY = p.y; clickT = (performance.now() - start) / 1000;
    };

    const draw = () => {
      const t = reduceMotion ? 8 : (performance.now() - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      hover += (hoverTarget - hover) * 0.06;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHover, hover);
      gl.uniform3f(uClick, clickX, clickY, clickT);
      gl.uniform1f(uPixel, 4 * dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (onScreen) draw();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
    io.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    if (reduceMotion) draw();
    else frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
