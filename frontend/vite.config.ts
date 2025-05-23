import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss"

export default defineConfig({
    plugins: [
        react(),
    ],
  server: {
    port: 3359,
    proxy: {
      '/api': 'http://localhost:4000',
    },
    },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    }
  }
})
