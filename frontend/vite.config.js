import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://intranet.logistock", // Adresse de votre backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
