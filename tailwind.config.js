/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  future: {
    removeDeprecatedGapUtilities: true
  },
  theme: {
    extend: {
      colors: {
        primary: '#F1023D',
        secondary: '#FA9169',
        light: '#F4F1F1',
        dark: '#210309',
        black: '#000000',
        white: '#FFFFFF'
      },
      fontFamily: {
        lato: 'Lato',
        noto: 'Noto Sans',
        montserrat: 'Montserrat'
      }
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled']
    }
  },
  plugins: [
    // require('@tailwindcss/forms')
  ]
}
