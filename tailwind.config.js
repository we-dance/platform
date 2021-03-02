/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
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
        lato: 'Lato'
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
