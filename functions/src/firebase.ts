import * as admin from 'firebase-admin'

admin.initializeApp()

const firestore = admin.firestore()

export { firestore, admin }
