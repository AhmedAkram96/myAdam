// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias: {
        crypto: 'crypto-js'
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
});
