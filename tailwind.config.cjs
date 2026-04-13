/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: '#0047AB',
          cyan: '#00D2FF',
          success: '#14B86A',
          danger: '#E53935',
          warning: '#F59E0B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0, 71, 171, 0.25), 0 16px 40px rgba(0, 71, 171, 0.2)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        confetti: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translateY(180px) rotate(120deg)', opacity: '0' },
        },
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
        confetti: 'confetti 1.8s ease-in infinite',
      },
    },
  },
  plugins: [],
}
