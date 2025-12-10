/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6',
        surface: '#1a1a2e',
        background: '#0f0f1e',
      },
    },
  },
  plugins: [],
}

