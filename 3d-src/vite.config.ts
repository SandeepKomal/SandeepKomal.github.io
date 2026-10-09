import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds into ../3d so the ready-to-serve page is committed and GitHub Pages
// shows it at /3d/ whether Pages deploys from the branch or from Actions.
// Relative base keeps asset links working under that sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: '../3d',
    emptyOutDir: true,
  },
});
