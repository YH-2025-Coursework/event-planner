import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7263',
        secure: false,
      },
    },
  },
  test: {
    globals: true, //This helps you run tests from any folder.
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
})