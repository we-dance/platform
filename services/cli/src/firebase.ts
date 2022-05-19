import * as admin from 'firebase-admin'

admin.initializeApp({
  projectId: 'wedance-4abe3',
  storageBucket: 'wedance-4abe3.appspot.com',
})

const db = admin.firestore()

export { db, admin }
