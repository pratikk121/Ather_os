/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          base: 'var(--aether-surface-base)',
          primary: 'var(--aether-surface-primary)',
          secondary: 'var(--aether-surface-secondary)',
          elevated: 'var(--aether-surface-elevated)',
          overlay: 'var(--aether-surface-overlay)',
          interactive: 'var(--aether-surface-interactive)',
          selected: 'var(--aether-surface-selected)',
        },
        content: {
          primary: 'var(--aether-text-primary)',
          secondary: 'var(--aether-text-secondary)',
          muted: 'var(--aether-text-muted)',
          disabled: 'var(--aether-text-disabled)',
          inverse: 'var(--aether-text-inverse)',
        },
        border: {
          subtle: 'var(--aether-border-subtle)',
          DEFAULT: 'var(--aether-border-default)',
          strong: 'var(--aether-border-strong)',
        },
        accent: {
          primary: 'var(--aether-accent-primary)',
          secondary: 'var(--aether-accent-secondary)',
          soft: 'var(--aether-accent-soft)',
          contrast: 'var(--aether-accent-contrast)',
        },
        status: {
          success: 'var(--aether-status-success)',
          warning: 'var(--aether-status-warning)',
          error: 'var(--aether-status-error)',
          info: 'var(--aether-status-info)',
        },
        glass: {
          surface: 'var(--aether-glass-bg)',
          border: 'var(--aether-glass-border)',
          highlight: 'var(--aether-glass-highlight)',
          shadow: 'var(--aether-glass-shadow)',
          dark: 'rgba(10, 15, 29, 0.7)',
        },
        aether: {
          cyan: '#0EA5E9',
          indigo: '#6366F1',
          violet: '#8B5CF6',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '24px',
        '3xl': '40px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
