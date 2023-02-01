import * as admin from 'firebase-admin'
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
}); 

const firestore = admin.firestore()

export { firestore, admin }
