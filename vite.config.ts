import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dev-challenge/',
  build: {
    outDir: './build',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
