module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundSize: {
        'coverImportant': 'cover !important'
      },
      // backgroundImage: {
      //   'hero-pattern': "url('/images/hero-pattern.svg')"
      // },
      // backgroundImage: {
      //   'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))'
      // },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)'
      },
      screens: {
        standalone: { raw: '(display-mode: standalone)' }
      },
      animation: {
        blob: 'blob 7s infinite',
        'fade-in': 'fade-in 0.5s linear forwards',
        marquee: 'marquee var(--marquee-duration) linear infinite',
        marquee2: 'marquee2 160s linear infinite',
        marquee3: 'marquee3 160s linear infinite',
        disco: 'disco 1.5s linear infinite',
        marqueeVertical:
          'marqueeVertical var(--marqueeVertical-duration) linear infinite',
        'spin-slow': 'spin 4s linear infinite',
        'spin-slower': 'spin 6s linear infinite',
        'spin-reverse': 'spin-reverse 1s linear infinite',
        'spin-reverse-slow': 'spin-reverse 4s linear infinite',
        'spin-reverse-slower': 'spin-reverse 6s linear infinite'
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)'
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)'
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)'
          },
          '100%': {
            transform: 'tranlate(0px, 0px) scale(1)'
          }
        },
        'fade-in': {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        },
        disco: {
          '0%': { transform: 'translateY(-50%) rotate(0deg)' },
          '100%': { transform: 'translateY(-50%) rotate(360deg)' }
        },
        marquee: {
          '100%': {
            transform: 'translateY(-50%)'
          }
        },
        marquee2: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        marquee3: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' }
        },
        marqueeVertical: {
          '100%': {
            transform: 'translateX(-50%)'
          }
        },
        'spin-reverse': {
          to: {
            transform: 'rotate(-360deg)'
          }
        }
      }
    }
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          primary: '#3AAEFB'
          // 'primary-focus': 'mediumblue'
        }
      }
    ]
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('daisyui'),
    require('@tailwindcss/typography')
    // require('@tailwindcss/forms')
  ]
};
