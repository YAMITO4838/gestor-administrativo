/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#101827',
        graphite: '#5e6673',
        champagne: '#b5965b',
        porcelain: '#f7f8fb',
      },
      boxShadow: {
        premium: '0 18px 55px rgba(16, 24, 39, 0.10)',
        soft: '0 10px 30px rgba(16, 24, 39, 0.08)',
      },
    },
  },
  plugins: [],
}