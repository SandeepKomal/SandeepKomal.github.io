import { useEffect, useRef, useState } from 'react';
import Scene, { PALETTES } from '../art/Scene';
import { MARQUEE_TOOLS } from '../content';

// Artwork per tool lives in src/assets/tiles/<tool>.webp (lowercase, spaces removed, e.g. "githubactions.webp").
// Tools without an image fall back to an original procedural scene with the name overlaid.
const tileImages = import.meta.glob<string>('../assets/tiles/*.webp', { eager: true, import: 'default' });
const imageFor = (name: string) => tileImages[`../assets/tiles/${name.toLowerCase().replace(/\s+/g, '')}.webp`];

const TILES = MARQUEE_TOOLS.map((name, i) => ({
  name,
  image: imageFor(name),
  palette: PALETTES[i % PALETTES.length],
  variant: i,
}));

const ROW_ONE = [...TILES.slice(0, 11), ...TILES.slice(0, 11), ...TILES.slice(0, 11)];
const ROW_TWO = [...TILES.slice(11), ...TILES.slice(11), ...TILES.slice(11)];

type Tile = (typeof TILES)[number];

function Row({ tiles, transform }: { tiles: Tile[]; transform: string }) {
  return (
    <div className="flex w-max gap-3" style={{ transform, willChange: 'transform' }}>
      {tiles.map((tile, i) => (
        <div key={i} className="relative h-[270px] w-[420px] shrink-0 overflow-hidden rounded-2xl">
          {tile.image ? (
            // The artwork already includes the tool's name
            <img src={tile.image} alt={tile.name} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <>
              <Scene palette={tile.palette} variant={tile.variant} className="h-full w-full" />
              <span className="absolute bottom-4 left-5 text-2xl font-semibold uppercase tracking-wider text-white/90">
                {tile.name}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section ref={ref} className="flex flex-col gap-3 bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40">
      <Row tiles={ROW_ONE} transform={`translateX(${offset - 200}px)`} />
      <Row tiles={ROW_TWO} transform={`translateX(${-(offset - 200)}px)`} />
    </section>
  );
}
