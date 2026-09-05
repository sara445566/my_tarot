import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.join(projectRoot, 'github-pages'),
  base: '/my_tarot/',
  publicDir: path.join(projectRoot, 'public'),
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss()] } },
  resolve: {
    alias: {
      'next/image': path.join(projectRoot, 'github-pages/static-image.tsx'),
    },
  },
  define: {
    'process.env.NEXT_PUBLIC_BASE_PATH': JSON.stringify('/my_tarot'),
  },
  build: {
    outDir: path.join(projectRoot, 'dist-pages'),
    emptyOutDir: true,
  },
});
