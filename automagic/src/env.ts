require('dotenv').config()

export default {
  instagram: {
    username: process.env.INSTAGRAM_USERNAME as string,
    password: process.env.INSTAGRAM_PASSWORD as string,
  },

  sentry: {
    dsn: process.env.SENTRY_DSN as string,
    tracesSampleRate: 1.0,
    serverName: 'automagic',
  },
}
