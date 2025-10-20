import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    fs: {
      // Allow serving files from the project root and parent directories
      allow: ['..', '../..']
    }
  },
  // Build optimization
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: []
    }
  },
  optimizeDeps: {
    disabled: false
  }
})