/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        nordic: {
          bg: '#fafafa',
          paper: '#ffffff',
          slate: '#f1f5f9',
          border: '#e2e8f0',
          'border-dark': '#cbd5e1',
          text: '#0f172a',
          muted: '#475569',
          accent: '#4ade80',
          'accent-hover': '#22c55e',
          'accent-blue': '#2563eb',
          emerald: '#059669',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'scroll-vertical': 'scrollVertical 20s linear infinite',
        'marquee-horizontal': 'marqueeHorizontal 30s linear infinite',
      },
      keyframes: {
        scrollVertical: {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-30%)' },
          '100%': { transform: 'translateY(0%)' },
        },
        marqueeHorizontal: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
