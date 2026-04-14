/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ────────────────────────────────────────────────────────────────
        // BRAND COLORS (Static - Logo Based)
        // ────────────────────────────────────────────────────────────────
        brand: {
          gold: {
            primary: '#e4a808',      // Main brand
            bright: '#f5b500',       // Hover
            soft: '#fdd52f',         // Light accent
            lighter: '#f2ee8c',      // Disabled/bg
          },
          orange: {
            primary: '#ff9500',      // Secondary CTA
            light: '#ffb84d',        // Hover
            lighter: '#ffe5cc',      // Background
          },
          cream: '#fffbf0',          // Warm white
          gray: {
            50: '#fafaf9',
            100: '#f5f5f3',
            200: '#e5e5e4',
            300: '#d4d4d2',
            400: '#b8b8b6',
            500: '#a0a09f',
            600: '#626262',
            700: '#3d3d3d',
            800: '#2a2a2a',
            900: '#1a1a1a',
          },
          // Semantic alias for backward compatibility
          border: 'var(--border-default)',
          card: '#1a1a19',           // Dark card background
          dark: '#0f0f0e',           // Deep black background
          muted: '#7a7a78',          // Muted text color
          yellow: '#f5b500',         // Hover gold
        },

        // ────────────────────────────────────────────────────────────────
        // THEME COLORS (Dynamic - CSS Variables)
        // ────────────────────────────────────────────────────────────────
        theme: {
          background: 'var(--background)',
          surface: 'var(--surface)',
          surfaceSecondary: 'var(--surface-secondary)',
          
          text: {
            base: 'var(--text-base)',
            secondary: 'var(--text-secondary)',
            tertiary: 'var(--text-tertiary)',
          },
          
          border: {
            default: 'var(--border-default)',
            subtle: 'var(--border-subtle)',
            strong: 'var(--border-strong)',
          },
          
          accent: {
            primary: 'var(--accent-primary)',
            secondary: 'var(--accent-secondary)',
          },
        },
      },
      fontFamily: {
        display: ['"Montserrat"', 'sans-serif'],
        body:    ['"Nunito Sans"', 'sans-serif'],
        mono:    ['"Courier New"', 'monospace'],
      },
      animation: {
        'slide-in':   'slideIn 0.5s ease forwards',
        'fade-up':    'fadeUp 0.6s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ticker':     'ticker 40s linear infinite',
        'float':      'float 3s ease-in-out infinite',
        'glow':       'glow 2.5s ease-in-out infinite',
        'ken-burns':         'kenBurns 12s ease-in-out infinite alternate',
        'ken-burns-reverse': 'kenBurnsReverse 12s ease-in-out infinite alternate',
        'shine':      'shine 0.6s ease forwards',
      },
      keyframes: {
        slideIn:  { from: { opacity: '0', transform: 'translateX(-24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        fadeUp:   { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        ticker:   { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float:    { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        glow: {
          '0%,100%': { boxShadow: '0 0 18px rgba(228,168,8,0.15)' },
          '50%':      { boxShadow: '0 0 36px rgba(228,168,8,0.35)' },
        },
        shine: {
          '0%':   { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
        kenBurns: {
          '0%':   { transform: 'scale(1) translate(0%, 0%)' },
          '100%': { transform: 'scale(1.18) translate(-2.5%, -1.5%)' },
        },
        kenBurnsReverse: {
          '0%':   { transform: 'scale(1.18) translate(-2.5%, -1.5%)' },
          '100%': { transform: 'scale(1) translate(0%, 0%)' },
        },
      },
      backgroundImage: {
        'hero-gradient':   'linear-gradient(135deg, #0C0C0C 0%, #181200 55%, #0C0C0C 100%)',
        'gold-gradient':   'linear-gradient(135deg, #e4a808 0%, #fdd52f 100%)',
        'gold-gradient-v': 'linear-gradient(180deg, #fdd52f 0%, #e4a808 100%)',
        'gold-soft':       'linear-gradient(135deg, #fdd52f 0%, #f2ee8c 100%)',
        'card-gradient':   'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
      },
      boxShadow: {
        'gold':    '0 4px 24px rgba(228,168,8,0.28)',
        'gold-sm': '0 2px 10px rgba(228,168,8,0.20)',
        'card':    '0 2px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
