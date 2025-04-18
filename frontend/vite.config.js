import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Adresse de votre backend via Caddy
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: "http://localhost:8080",
        ws: true,
      },
    },
  },
})
