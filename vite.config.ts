import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: './build',
  },
  server: {
    https: true,
    host: '0.0.0.0',
    port: 3000,
  },
});
