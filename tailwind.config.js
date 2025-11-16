/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9E7FFF',
        secondary: '#38bdf8',
        accent: '#f472b6',
        background: '#171717',
        surface: '#262626',
        text: '#FFFFFF',
        textSecondary: '#A3A3A3',
        border: '#2F2F2F',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(158, 127, 255, 0.6)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: { // Nueva animación para la sección de categorías
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out forwards',
        fadeInDown: 'fadeInDown 0.8s ease-out forwards',
        fadeInUp: 'fadeInUp 0.8s ease-out forwards', // Nueva animación
      },
    },
  },
  plugins: [
    // Plugin para retrasos de animación
    function ({ addUtilities, theme }) {
      const delays = {
        'animation-delay-100': '100ms',
        'animation-delay-200': '200ms',
        'animation-delay-300': '300ms',
        'animation-delay-500': '500ms',
        'animation-delay-700': '700ms',
        'animation-delay-1000': '1000ms', // Retraso para la sección de categorías
      };
      addUtilities({
        '.animation-delay-100': { 'animation-delay': delays['animation-delay-100'] },
        '.animation-delay-200': { 'animation-delay': delays['animation-delay-200'] },
        '.animation-delay-300': { 'animation-delay': delays['animation-delay-300'] },
        '.animation-delay-500': { 'animation-delay': delays['animation-delay-500'] },
        '.animation-delay-700': { 'animation-delay': delays['animation-delay-700'] },
        '.animation-delay-1000': { 'animation-delay': delays['animation-delay-1000'] },
      }, ['responsive', 'hover']);
    },
  ],
}
