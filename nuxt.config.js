const isProd = process.env.NODE_ENV === 'production'

const app = {
  name: 'WeDance',
  description: 'We bring dancers together',
  social: {
    twitter: 'WeDanceVIP'
  },
  url: process.env.URL,
  author: 'WeDance',
  cover: '/cover/wide.png'
}

const firebase = {
  config: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  },
  services: {
    auth: true,
    firestore: true,
    analytics: isProd
  }
}

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: app.name,
    bodyAttrs: {
      class: 'bg-white'
    }
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#2a1b3c' },
  components: true,
  /*
   ** Global CSS
   */
  css: [
    '@/assets/css/typography.css',
    '@/assets/css/vendors.scss',
    '@/assets/css/animation.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/firebase', '~/plugins/router', '~/plugins/directives'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    // Doc: https://composition-api.nuxtjs.org/
    '@nuxtjs/composition-api'
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
    'portal-vue/nuxt',
    '@nuxtjs/device',
    'nuxt-i18n',
    '@nuxtjs/amp',
    '@nuxt/content',
    '@nuxtjs/firebase'
  ],
  purgeCSS: {
    enabled: false
  },
  pwa: {
    workbox: {
      offline: true,
      dev: false,
      pagesURLPattern: '/.*'
    },
    meta: {
      name: app.name,
      description: app.description,
      ogHost: app.url,
      ogImage: app.cover,
      nativeUI: true,
      twitterSite: '@' + app.social.twitter
    },
    manifest: {
      name: app.name,
      short_name: app.name,
      start_url: '/?standalone=true',
      background_color: '#3C3348',
      lang: 'en'
    }
  },
  /*
   ** Build configuration
   */
  build: {
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
              minimize: true
            }
          }
        ]
      })

      config.module.rules.push({
        test: /\.yml$/,
        use: 'js-yaml-loader'
      })
    }
  },
  env: {
    app,
    firebase
  },
  firebase,
  sentry: {
    dsn: process.env.SENTRY_DSN
  },
  robots: [
    {
      UserAgent: '*',
      Allow: '/'
    },
    {
      UserAgent: '*',
      Disallow: '/settings'
    },
    {
      UserAgent: '*',
      Disallow: '/admin'
    },
    {
      UserAgent: '*',
      Disallow: '/signin'
    }
  ],
  sitemap: {
    hostname: app.url,
    routes: ['/']
  },
  watchers: {
    webpack: {
      poll: 5000,
      ignored: ['node_modules']
    }
  },
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.yml' },
      { code: 'de', name: 'Deutsch', file: 'de.yml' },
      { code: 'ru', name: 'Русский', file: 'ru.yml' },
      { code: 'es', name: 'Español', file: 'es.yml' }
    ],
    defaultLocale: 'en',
    langDir: 'langs/',
    lazy: true,
    vueI18n: {
      fallbackLocale: 'en'
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      fallbackLocale: 'en',
      alwaysRedirect: true
    }
  },
  generate: {
    interval: 2000
  }
}
