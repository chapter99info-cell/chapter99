import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#D4AF37', light: '#E8C96B', dark: '#A8892A', muted: '#D4AF3740' },
        jet: '#0a0a0a',
        charcoal: { DEFAULT: '#1a1a1a', light: '#222222', border: '#2a2a2a' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'gold-pulse': 'goldPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(16px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        goldPulse: { '0%,100%': { boxShadow: '0 0 0 0 #D4AF3730' }, '50%': { boxShadow: '0 0 20px 4px #D4AF3750' } },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37, #A8892A)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a0a, #1a1a1a)',
      },
    },
  },
  plugins: [],
} satisfies Config;
