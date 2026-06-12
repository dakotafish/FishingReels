/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_TARGET || 'http://localhost:8000'
  const streamsTarget = env.VITE_STREAMS_TARGET || 'http://localhost:8888'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
        // Only HLS *files* are proxied (keys starting with ^ are RegExp).
        // Extension-less /streams and /streams/:id are SPA page routes and
        // must fall through to index.html.
        '^/streams/.*\\.(m3u8|m4s|mp4|ts)$': {
          target: streamsTarget,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/streams/, ''),
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      globals: false,
    },
  }
})
