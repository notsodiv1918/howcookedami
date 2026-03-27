import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      colors: {
        bg:      '#0a0800',
        wood:    '#2a1a08',
        gold:    '#c9a84c',
        'gold-light': '#e8c97a',
        cream:   '#f5f0e0',
        judge:   '#8b0000',
      },
      animation: {
        'gavel':      'gavel 0.4s ease-in-out',
        'fade-up':    'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':    'fade-in 0.4s ease both',
        'shake':      'shake 0.5s ease-in-out',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'flicker':    'flicker 0.15s ease-in-out infinite',
      },
      keyframes: {
        'gavel': {
          '0%':   { transform: 'rotate(-45deg)' },
          '50%':  { transform: 'rotate(15deg)' },
          '100%': { transform: 'rotate(-45deg)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'shake': {
          '0%,100%': { transform: 'translateX(0)' },
          '20%':     { transform: 'translateX(-8px)' },
          '40%':     { transform: 'translateX(8px)' },
          '60%':     { transform: 'translateX(-4px)' },
          '80%':     { transform: 'translateX(4px)' },
        },
        'pulse-gold': {
          '0%,100%': { boxShadow: '0 0 20px rgba(201,168,76,0.2)' },
          '50%':     { boxShadow: '0 0 40px rgba(201,168,76,0.5)' },
        },
        'flicker': {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
}
export default config
