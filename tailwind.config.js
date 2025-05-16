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
        'secondary-light': '#7DD3FC', // Added lighter shade for secondary
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
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.primary'),
            '--tw-prose-headings': theme('colors.primary'),
            '--tw-prose-lead': theme('colors.primary'),
            '--tw-prose-links': theme('colors.secondary'), // Liens en couleur secondaire pour se démarquer
            '--tw-prose-bold': theme('colors.primary'),
            '--tw-prose-counters': theme('colors.primary'),
            '--tw-prose-bullets': theme('colors.primary'),
            '--tw-prose-hr': theme('colors.gray[300]'),
            '--tw-prose-quotes': theme('colors.primary'),
            '--tw-prose-quote-borders': theme('colors.gray[300]'),
            '--tw-prose-captions': theme('colors.gray[500]'),
            '--tw-prose-code': theme('colors.secondary'),
            '--tw-prose-pre-code': theme('colors.gray[200]'), // Code dans les blocs pre plus clair
            '--tw-prose-pre-bg': theme('colors.gray[800]'), // Fond des blocs pre
            '--tw-prose-th-borders': theme('colors.gray[400]'),
            '--tw-prose-td-borders': theme('colors.gray[300]'),
            // Couleurs pour le mode sombre (prose-invert)
            '--tw-prose-invert-body': theme('colors.gray[300]'),
            '--tw-prose-invert-headings': theme('colors.secondary-light', theme('colors.white')), // Utilise secondary-light si défini, sinon blanc
            '--tw-prose-invert-lead': theme('colors.gray[400]'),
            '--tw-prose-invert-links': theme('colors.secondary-light', theme('colors.secondary')),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.gray[400]'),
            '--tw-prose-invert-bullets': theme('colors.gray[600]'),
            '--tw-prose-invert-hr': theme('colors.gray[700]'),
            '--tw-prose-invert-quotes': theme('colors.gray[100]'),
            '--tw-prose-invert-quote-borders': theme('colors.gray[700]'),
            '--tw-prose-invert-captions': theme('colors.gray[400]'),
            '--tw-prose-invert-code': theme('colors.white'),
            '--tw-prose-invert-pre-code': theme('colors.gray[300]'),
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': theme('colors.gray[600]'),
            '--tw-prose-invert-td-borders': theme('colors.gray[700]'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 