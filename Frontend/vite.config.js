import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  // Add history API fallback for SPA routing
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
    headers: {
      'Cache-Control': 'no-store'
    }
  }
})
