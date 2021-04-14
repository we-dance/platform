import * as admin from 'firebase-admin'

const serviceAccount = require('../var/serviceAccountKey.json')

// initializeApp(config().firebase);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wedance-4abe3.firebaseio.com'
})

const firestore = admin.firestore()

export { firestore, admin }
