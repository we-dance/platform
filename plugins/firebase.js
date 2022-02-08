import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'

if (!process.env.firebase.config?.apiKey) {
  throw new Error('Missing Firebase Configuration')
}

// eslint-disable-next-line import/no-mutable-exports
let track = function(...params) {
  if (process.env.firebase.analyticsDebug) {
    console.log('[track]', ...params)
  }
}

// eslint-disable-next-line import/no-mutable-exports
let analytics

// eslint-disable-next-line import/no-mutable-exports
let googleApiKey

if (!firebase.apps.length) {
  const config = process.env.firebase.config
  googleApiKey = config.apiKey
  firebase.initializeApp(config)

  if (process.env.firebase.analytics) {
    analytics = firebase.analytics()

    track = analytics.logEvent
  }
}

const db = firebase.firestore()

export { db, track, analytics, googleApiKey }
