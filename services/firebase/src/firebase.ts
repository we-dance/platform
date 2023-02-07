import * as admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.applicationDefault()
}); 

const firestore = admin.firestore()

export { firestore, admin }
