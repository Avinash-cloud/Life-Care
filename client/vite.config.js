import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // allowedHosts: ['7c220a15acac.ngrok-free.app'],
    proxy: {
      '/api': {
        target: env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
    hmr: {
      overlay: true
    }
  }
}})