import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv"
// https://vitejs.dev/config/
dotenv.config();
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        "/api": {
            target: "http://localhost:3000",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/,'')
        },
    }
  }
})
