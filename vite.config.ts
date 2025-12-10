import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/tmdb-image': {
        target: 'https://image.tmdb.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/tmdb-image/, ''),
        headers: {
          'Referer': 'https://www.themoviedb.org/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      },
    },
  },
  plugins: [react()],
})
