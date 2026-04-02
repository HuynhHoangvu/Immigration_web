/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow:  '#fdd52f',
          gold:    '#e4a808',
          orange:  '#e4a808',
          dark:    '#0d1117',
          card:    '#161b22',
          border:  '#21262d',
          muted:   '#8b949e',
          surface: '#1c2128',
        },
      },
    },
  },
  plugins: [],
}
