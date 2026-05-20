import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1600px',
      },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F0F0F',
          soft: '#262626',
          muted: '#525252',
          dim: '#8E8E93',
        },
        paper: {
          DEFAULT: '#FFFFFF',
          warm: '#FAFAFA',
          cool: '#F5F5F5',
          dark: '#EDEDED',
        },
        accent: {
          DEFAULT: '#FF3B5C',
          dim: '#E0264A',
          soft: '#FF6B85',
        },
        line: '#E5E5E5',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(2.5rem, 7vw, 5.5rem)', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-xl': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-lg': ['clamp(1.5rem, 3.5vw, 2.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      letterSpacing: {
        widest: '0.15em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
