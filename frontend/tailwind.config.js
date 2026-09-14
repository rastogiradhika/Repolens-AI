/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        dark: {
          900: '#050508',
          800: '#0a0a0f',
          700: '#0f0f18',
          600: '#14141f',
          500: '#1a1a2e',
          400: '#1e1e32',
          300: '#252540',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          cyan: 'rgba(6,182,212,0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6,182,212,0.15), transparent)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(6,182,212,0.25)',
        'cyan-glow-sm': '0 0 10px rgba(6,182,212,0.15)',
        'card': '0 1px 0 rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.02)',
      },
    },
  },
  plugins: [],
};
