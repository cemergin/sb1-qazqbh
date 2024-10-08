/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto Mono', 'monospace'],
      },
      colors: {
        'neon-green': '#39FF14',
        'neon-yellow': '#FFFF00',
      },
    },
  },
  plugins: [],
}