import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [mkcert()],
  server: {
    https: true,
    host: '0.0.0.0',
    port: 3000,
  },
});
