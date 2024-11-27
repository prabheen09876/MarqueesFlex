/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { 
            transform: 'translateY(100px)',
            opacity: '0'
          },
          '50%': {
            transform: 'translateY(50px)',
            opacity: '0.5'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        slideDown: {
          '0%': { 
            transform: 'translateY(-100px)',
            opacity: '0'
          },
          '50%': {
            transform: 'translateY(-50px)',
            opacity: '0.5'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        slideLeft: {
          '0%': { 
            transform: 'translateX(-100px)',
            opacity: '0'
          },
          '50%': {
            transform: 'translateX(-50px)',
            opacity: '0.5'
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        slideRight: {
          '0%': { 
            transform: 'translateX(100px)',
            opacity: '0'
          },
          '50%': {
            transform: 'translateX(50px)',
            opacity: '0.5'
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        scaleUp: {
          '0%': { 
            transform: 'scale(0.8)',
            opacity: '0'
          },
          '50%': {
            transform: 'scale(0.9)',
            opacity: '0.5'
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        },
        pulse: {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(0.95)'
          }
        },
        rotateIn: {
          '0%': { 
            transform: 'rotate(-180deg) scale(0)',
            opacity: '0'
          },
          '100%': { 
            transform: 'rotate(0) scale(1)',
            opacity: '1'
          }
        },
        blurIn: {
          '0%': { 
            filter: 'blur(20px)',
            opacity: '0'
          },
          '100%': { 
            filter: 'blur(0)',
            opacity: '1'
          }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        fadeIn: 'fadeIn 0.8s ease-in-out',
        slideUp: 'slideUp 0.8s ease-out forwards',
        slideDown: 'slideDown 0.8s ease-out forwards',
        slideLeft: 'slideLeft 0.8s ease-out forwards',
        slideRight: 'slideRight 0.8s ease-out forwards',
        scaleUp: 'scaleUp 0.8s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        rotateIn: 'rotateIn 0.8s ease-out forwards',
        blurIn: 'blurIn 0.8s ease-out forwards'
      }
    },
  },
  plugins: [],
};
