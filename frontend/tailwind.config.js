/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary palette
        'cf-bg': '#0F1117',
        'cf-sidebar': '#111318',
        'cf-surface': '#FAFAF8',
        'cf-card': '#FFFFFF',
        'cf-border': '#E5E7EB',

        // Green accent system
        'cf-green': {
          DEFAULT: '#22C55E',
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },

        // Text
        'cf-text': {
          primary: '#0F1117',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          sidebar: '#D1D5DB',
          'sidebar-active': '#FFFFFF',
        },

        // Status colors
        'cf-lost': '#EF4444',
        'cf-found': '#22C55E',
        'cf-pending': '#F59E0B',
        'cf-claimed': '#3B82F6',
        'cf-recovered': '#10B981',
        'cf-matched': '#8B5CF6',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.15', fontWeight: '700' }],
        'h1': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['0.9375rem', { lineHeight: '1.6' }],
        'meta': ['0.8125rem', { lineHeight: '1.5' }],
      },

      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.06)',
        'modal': '0 20px 60px -10px rgba(0,0,0,0.25)',
      },

      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'count-up': 'countUp 0.6s ease-out',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
