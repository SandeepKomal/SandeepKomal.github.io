# Sandeep -- 3D Creator

React + TypeScript + Tailwind CSS + Framer Motion landing page.

```bash
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # production build into ../3d/
```

The build writes the finished page to `../3d/`, which is committed so GitHub Pages can serve it.
After changing anything here, run `npm run build` and commit the updated `3d/` folder too.

Deployed for free to
on every push to `main`.

Sections live in `src/sections/`, reusable pieces (FadeIn, Magnet, AnimatedText, buttons) in `src/components/`.

## Licences -- free to use, nothing borrowed

- **Artwork**: every visual (hero orb, marquee tiles, 3D icons, project renders) is original SVG drawn in
  `src/art/` for this site. No third-party images are loaded.
- **Text**: all copy is original. Replace the projects and the email with your own details.
- **Font**: [Kanit](https://fonts.google.com/specimen/Kanit) -- SIL Open Font License, free for personal and commercial use.
- **Libraries**: React, Framer Motion, Tailwind CSS and Vite (MIT) and Lucide icons (ISC) -- all free for commercial use.
- **Hosting**: GitHub Pages, free for public repositories.

To use your own renders later, drop image files into `public/` and swap the `<Scene />` components for `<img>` tags.
