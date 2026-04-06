import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5239',
    },
  },
  test: {
    globals: true, //This helps you run tests from any folder.
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
})