import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), // This should come first
    react()
  ],
  server: {
    fs: {
      // Allow serving files from the project root and parent directories
      allow: ['..', '../..']
    }
  },
  // Optional: Build optimization
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})