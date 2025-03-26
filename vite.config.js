import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({

    plugins: [react(),
      nodePolyfills(),
    ],
    server: {
        proxy: {
          '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            secure: false,
          },
        },
      },
    
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

