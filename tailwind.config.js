module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      keyframes: {
        slideTop: {
          '0%': { height: '0px' },
          '100%': { height: 'calc(100% - 75px)' },
        }
      },
      animation: {
        slideTop: 'slideTop 0.4s ease-in-out',
      },
      backgroundSize: {
        'coverImportant': 'cover !important'
      }
    }
  }
};
