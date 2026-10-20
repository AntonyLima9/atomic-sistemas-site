/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#070707', 2: '#111111', 3: '#1A1A1A' },
        paper: '#F7F5EF',
        mute: '#9A978F',
        gold: '#E2B82C',
        sun: '#FFD23F',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // "mono" virou Inter com números tabulares: rótulos e números sem cara de código
        mono: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: { expo: 'cubic-bezier(.16,1,.3,1)' },
    },
  },
  plugins: [],
}
