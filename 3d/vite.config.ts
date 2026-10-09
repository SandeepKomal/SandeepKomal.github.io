import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works from any sub-path (e.g. /3d/ on GitHub Pages)
export default defineConfig({
  base: './',
  plugins: [react()],
});
