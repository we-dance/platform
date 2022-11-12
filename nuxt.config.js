export const app = {
  name: 'WeDance',
  description: 'We bring dancers together',
  social: {
    twitter: 'WeDancePlatform',
  },
  url: 'https://wedance.vip/',
  author: 'WeDance',
  cover: '/cover/wide.png',
}

const locales = [
  { code: 'en', name: 'English', file: 'en.yml' },
  { code: 'es', name: 'Español', file: 'es.yml' },
  { code: 'de', name: 'Deutsch', file: 'de.yml' },
  { code: 'fr', name: 'Français', file: 'fr.yml' },
  { code: 'it', name: 'Italiano', file: 'it.yml' },
  { code: 'pl', name: 'Polski', file: 'pl.yml' },
  { code: 'pt', name: 'Português', file: 'pt.yml' },
  { code: 'ro', name: 'Română', file: 'ro.yml' },
  { code: 'tr', name: 'Türkçe', file: 'tr.yml' },
  { code: 'ru', name: 'Русский', file: 'ru.yml' },
  { code: 'sr', name: 'Српски', file: 'sr.yml' },
]

if (process.env.DEBUG_I18N) {
  locales.push({ code: 'debug', name: 'DEBUG', file: 'debug.yml' })
}

export default {
  target: 'static',
  ssr: false,
  generate: {
    fallback: true,
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'Calendar',
        path: '/events/:city/:dance?',
        component: resolve(__dirname, 'pages/events/index'),
      })

      return routes
    },
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#210309' },
  components: [
    '~/components',
    '~/components/global',
    '~/components/Actions',
    '~/components/Card',
    '~/components/Formatters',
    '~/components/TInput',
  ],
  /*
   ** Global CSS
   */
  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/typography.css',
    '@/assets/css/vendors.scss',
    '@/assets/css/animation.css',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/firebase',
    '~/plugins/router',
    '~/plugins/directives',
    '~/plugins/vue-tailwind',
    '~/plugins/vue-datepicker',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // Doc: https://composition-api.nuxtjs.org/
    '@nuxtjs/composition-api',
    '@nuxtjs/google-fonts',
    '@nuxt/postcss8',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/sentry',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxtjs/device',
    'nuxt-i18n',
    '@nuxt/content',
    '@nuxtjs/toast',
  ],
  googleFonts: {
    display: 'swap',
    families: {
      Lato: true,
      Montserrat: true,
      'Noto Sans': true,
    },
  },
  toast: {
    position: 'top-center',
    duration: 2000,
  },
  purgeCSS: {
    enabled: false,
  },
  pwa: {
    workbox: {
      offline: true,
      dev: false,
      pagesURLPattern: '/.*',
    },
    meta: {
      name: app.name,
      description: app.description,
      ogHost: app.url,
      ogImage: app.cover,
      nativeUI: true,
      twitterSite: '@' + app.social.twitter,
    },
    manifest: {
      name: app.name,
      short_name: app.name,
      start_url: '/?standalone=true',
      background_color: '#3C3348',
      lang: 'en',
    },
  },
  /*
   ** Build configuration
   */
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    loaders: {
      vue: {
        prettify: false,
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common'

      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))

      svgRule.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      })

      config.module.rules.push({
        test: /\.yml$/,
        use: 'js-yaml-loader',
      })
    },
  },
  env: {
    app,
    firebase: {
      config: JSON.parse(process.env.FIREBASE_CONFIG || {}),
      analytics: process.env.FIREBASE_ANALYTICS,
      analyticsDebug: process.env.FIREBASE_ANALYTICS_DEBUG,
    },
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  robots: [
    {
      UserAgent: '*',
      Allow: '/',
    },
    {
      UserAgent: '*',
      Disallow: '/settings',
    },
    {
      UserAgent: '*',
      Disallow: '/admin',
    },
    {
      UserAgent: '*',
      Disallow: '/signin',
    },
  ],
  sitemap: {
    hostname: app.url,
    routes: ['/'],
  },
  i18n: {
    locales,
    defaultLocale: 'en',
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'locales/',
    vueI18n: {
      fallbackLocale: process.env.DEBUG_I18N ? 'debug' : 'en',
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      fallbackLocale: 'en',
      alwaysRedirect: true,
    },
  },
  image: {
    provider: 'static',
  },
  watchers: {
    webpack: {
      ignored: /(node_modules)|(.git)/,
    },
  },
}
