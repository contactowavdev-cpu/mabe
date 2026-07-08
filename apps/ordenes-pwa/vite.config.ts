import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const appDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: resolve(appDir, 'node_modules/react'),
      'react-dom': resolve(appDir, 'node_modules/react-dom'),
      'react-dom/client': resolve(appDir, 'node_modules/react-dom/client.js'),
    },
  },
  optimizeDeps: {
    force: true,
    include: ['react', 'react-dom', 'react-dom/client', 'react-router-dom', '@tanstack/react-query'],
  },
  server: {
    port: 5173,
  },
})
