import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|avif)$/i,
      includePublic: false,
      png: { quality: 80 },
      jpg: { quality: 75 },
      jpeg: { quality: 75 },
      webp: { quality: 75 },
      avif: { quality: 55 },
      cache: true,
    }),
  ],
});
