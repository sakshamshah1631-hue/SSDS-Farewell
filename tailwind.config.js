/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#030712',
          900: '#070b14',
          850: '#0b1120',
          800: '#0f172a',
          700: '#1e293b',
        },
        sapphire: {
          900: '#0c2340',
          800: '#102a54',
          700: '#153e75',
          600: '#1d4ed8',
          500: '#2563eb',
          400: '#38bdf8',
          300: '#7dd3fc',
        },
        champagne: {
          100: '#fefce8',
          200: '#fef9c3',
          300: '#fef08a',
          400: '#fde047',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['Cinzel', '"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'shimmer-gold': 'shimmerGold 3s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.4' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmerGold: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
