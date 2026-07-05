/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        crimson: '#8B1A1A',
        'crimson-dark': '#6B1010',
        'crimson-light': '#B22222',
        gold: '#C9A84C',
        'gold-light': '#D4B96A',
        obsidian: '#0A0A0A',
        surface: '#111111',
        'surface-2': '#1A1A1A',
        'warm-white': '#F5F0E8',
        'warm-gray': '#9A9590',
        'deep-gray': '#5A5550',
        forest: '#2D6A4F',
        'dark-red': '#9B2226'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
