import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds the finished page straight into the repository root (index.html + app/)
// so GitHub Pages serves it at https://sandeepkomal.github.io/ whether Pages
// deploys from the branch or from Actions. The build script clears ../app first.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: '..',
    emptyOutDir: false,
    assetsDir: 'app',
  },
});
