/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pulse: {
          50: '#f0f4fd',
          100: '#e0ebfb',
          200: '#c7dbf8',
          300: '#9ec1f2',
          400: '#6ea0ea',
          500: '#487fe1',
          600: '#3463d4',
          700: '#2a4fb8',
          800: '#274395',
          900: '#253b77',
          950: '#172349'
        },
        slate: {
          850: '#151d2e',
          900: '#0f172a',
          950: '#070c18'
        }
      }
    }
  },
  plugins: []
};
