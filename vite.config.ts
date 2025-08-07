import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/set-game/',
  build: {
    outDir: 'dist'
  },
  root: '.',
  publicDir: 'public'
});