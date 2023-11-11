import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'

if (!process.env.FIREBASE_CONFIG) {
  throw new Error('Missing Firebase Configuration')
}

// eslint-disable-next-line import/no-mutable-exports
let track = function(...params) {
  if (process.env.FIREBASE_ANALYTICS_DEBUG) {
    console.log('[track]', ...params)
  }
}

// eslint-disable-next-line import/no-mutable-exports
let analytics

// eslint-disable-next-line import/no-mutable-exports
let googleApiKey

if (!firebase.apps.length) {
  const config = JSON.parse(process.env.FIREBASE_CONFIG || {})
  googleApiKey = config.apiKey
  firebase.initializeApp(config)

  if (process.client && process.env.FIREBASE_ANALYTICS) {
    analytics = firebase.analytics()

    track = analytics.logEvent
  }
}

const db = firebase.firestore()

export { db, track, analytics, googleApiKey }
