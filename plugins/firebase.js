import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'

let track = function(...params) {
  console.log('[track]', ...params)
}

let analytics

let googleApiKey

if (!firebase.apps.length) {
  const configString = process.env.FIREBASE_CONFIG
  if (!configString) {
    throw new Error('FIREBASE_CONFIG is not defined')
  }

  const config = JSON.parse(configString)
  googleApiKey = config.apiKey
  firebase.initializeApp(config)

  if (process.env.FIREBASE_ANALYTICS_ENABLED === '1') {
    analytics = firebase.analytics()

    track = analytics.logEvent
  }
}

const db = firebase.firestore()

export { db, track, analytics, googleApiKey }
