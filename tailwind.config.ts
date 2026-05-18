import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modern luxury palette
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-light': 'var(--color-text-light)',
        'border': 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        'accent-primary': 'var(--color-accent-primary)',
        'accent-secondary': 'var(--color-accent-secondary)',
        'accent-light': 'var(--color-accent-light)',
        // Ink color system
        'ink': {
          '50': 'var(--color-ink-50)',
          '200': 'var(--color-ink-200)',
          '300': 'var(--color-ink-300)',
          '500': 'var(--color-ink-500)',
          '600': 'var(--color-ink-600)',
          '700': 'var(--color-ink-700)',
          '800': 'var(--color-ink-800)',
          '900': 'var(--color-ink-900)',
        },
        // Accent alias for 500
        'accent': {
          '500': 'var(--color-accent-primary)',
        },
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        serif: 'var(--font-serif)',
        display: 'var(--font-display)',
      },
    },
  },
  plugins: [],
}

export default config
