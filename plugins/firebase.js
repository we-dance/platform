import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'

if (!process.env.firebase.config?.apiKey) {
  throw new Error('Missing Firebase Configuration')
}

const track = function(...params) {
  console.log('[old track]', ...params)
}

// eslint-disable-next-line import/no-mutable-exports
let analytics

// eslint-disable-next-line import/no-mutable-exports
let googleApiKey

if (!firebase.apps.some((app) => app.name === '[DEFAULT]')) {
  const config = process.env.firebase.config
  googleApiKey = config.apiKey
  firebase.initializeApp(config)

  if (process.client && process.env.firebase.analytics) {
    analytics = firebase.analytics()
  }
}

const db = firebase.firestore()

export { db, track, analytics, googleApiKey, firebase }
