# Jack -- 3D Creator

React + TypeScript + Tailwind CSS + Framer Motion landing page.

```bash
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # production build into dist/
```

Deployed for free by `.github/workflows/pages.yml` to `https://sandeepkomal.github.io/jack/`
on every push to `main`.

Sections live in `src/sections/`, reusable pieces (FadeIn, Magnet, AnimatedText, buttons) in `src/components/`.

## Licences -- free to use, nothing borrowed

- **Artwork**: every visual (hero orb, marquee tiles, 3D icons, project renders) is original SVG drawn in
  `src/art/` for this site. No third-party images are loaded.
- **Text**: all copy is original. Replace "Jack", the projects and the email with your own details.
- **Font**: [Kanit](https://fonts.google.com/specimen/Kanit) -- SIL Open Font License, free for personal and commercial use.
- **Libraries**: React, Framer Motion, Tailwind CSS and Vite (MIT) and Lucide icons (ISC) -- all free for commercial use.
- **Hosting**: GitHub Pages, free for public repositories.

To use your own renders later, drop image files into `public/` and swap the `<Scene />` components for `<img>` tags.
