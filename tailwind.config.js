/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#003366', // Bleu IAGE
        'primary-dark': '#002244',
        secondary: '#00A0E9',
        'secondary-dark': '#0080C9',
        accent: '#FF6B00',
      },
      fontFamily: {
        sans: ['DINRoundPro', 'Inter', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
} 