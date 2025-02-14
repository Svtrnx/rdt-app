import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    allowedHosts: ['rdt-app-production.up.railway.app'],
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  }
})
