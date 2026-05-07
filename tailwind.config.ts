/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Primary: Hijau Keislamian ──────────────────────
        primary: {
          50:  '#E8F8ED',
          100: '#C2EFCF',
          200: '#85D99F',
          300: '#4DC472',
          400: '#2EA653',
          500: '#228B44',
          600: '#1E7A3C',
          700: '#1A6B33',
          800: '#145228',
          900: '#0D3B1F',
        },
        // ── Accent: Kuning Emas Keilmuan ──────────────────
        accent: {
          50:  '#FEFAE8',
          100: '#FCF0C4',
          200: '#F9DC8C',
          300: '#F5C85A',
          400: '#F0B432',
          500: '#E8A215',
          600: '#D4900A',
          700: '#C08200',
          800: '#9C6A00',
          900: '#7A5200',
        },
        // ── Neutral ────────────────────────────────────────
        neutral: {
          50:  '#F8FAFB',
          100: '#F0F3F6',
          200: '#E2E7EC',
          300: '#C8D0D8',
          400: '#A8B3BF',
          500: '#8892A0',
          600: '#5C6575',
          700: '#444C58',
          800: '#2D3139',
          900: '#1A1D21',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', '"Noto Serif"', 'serif'],
        body: ['"DM Sans"', '"Source Sans 3"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,.07), 0 1px 2px -1px rgba(0,0,0,.06)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,.10), 0 2px 4px -1px rgba(0,0,0,.07)',
        'glow-primary': '0 0 20px rgba(34,139,68,0.25)',
        'glow-accent': '0 0 20px rgba(232,162,21,0.25)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
