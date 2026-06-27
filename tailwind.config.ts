import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heebo: ['Heebo', 'sans-serif'],
      },
      colors: {
        liquid: '#16A34A',
        warning: '#F97316',
        'tank-body': '#9CA3AF',
        'tank-dark': '#6B7280',
        primary: '#0D99FF',
      },
    },
  },
  plugins: [],
}

export default config
