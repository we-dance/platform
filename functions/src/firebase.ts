import * as admin from 'firebase-admin'

var serviceAccount = require('../var/serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wedance-4abe3.firebaseio.com'
})

const firestore = admin.firestore()

export { firestore, admin }
