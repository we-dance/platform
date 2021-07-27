import * as admin from 'firebase-admin'

require('dotenv').config()

if (process.env.LOCAL) {
  const serviceAccount = require('../var/serviceAccountKey.json')

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://wedance-4abe3.firebaseio.com'
  })
} else {
  admin.initializeApp()
}

const firestore = admin.firestore()

export { firestore, admin }
