/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      animation: {
        'timer-shrink': 'timer-shrink linear forwards',
        'pop-in': 'pop-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'timer-shrink': {
          from: { width: '100%' },
          to: { width: '0%' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
