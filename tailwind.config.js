/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: '#F1023D',
        secondary: '#FA9169',
        light: '#F4F1F1',
        dark: '#210309',
        black: '#000000',
        white: '#FFFFFF',
      },
      fontFamily: {
        lato: 'Lato',
        noto: 'Noto Sans',
        montserrat: 'Montserrat',
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms')
  ],
}
