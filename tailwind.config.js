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
        obsidian: {
          bg: '#09090B',
          card: '#141418',
          border: '#27272A',
        },
        violet: {
          brand: '#8B5CF6',
          indigo: '#6366F1',
          glow: 'rgba(139, 92, 246, 0.25)',
          light: '#C4B5FD',
        },
        scope: {
          safe: '#22C55E',
          safeBg: 'rgba(34, 197, 94, 0.15)',
          safeBorder: 'rgba(34, 197, 94, 0.4)',
          caution: '#F59E0B',
          cautionBg: 'rgba(245, 158, 11, 0.15)',
          cautionBorder: 'rgba(245, 158, 11, 0.4)',
          critical: '#FB7185',
          criticalBg: 'rgba(251, 113, 133, 0.15)',
          criticalBorder: 'rgba(251, 113, 133, 0.4)',
        },
        text: {
          primary: '#FAFAFA',
          secondary: '#A1A1AA',
        }
      },
      backgroundImage: {
        'gradient-cta': 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
        'gradient-cta-hover': 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
        'gradient-brand': 'linear-gradient(90deg, #8B5CF6 0%, #6366F1 100%)',
        'gradient-safe': 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
      },
      boxShadow: {
        'violet-glow': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'violet-glow-lg': '0 0 35px -5px rgba(139, 92, 246, 0.45)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
