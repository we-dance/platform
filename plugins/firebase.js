import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'

export default ({ env: { firebase } }) => {
  if (Firebase.apps.length > 0) {
    return
  }

  Firebase.initializeApp(firebase.config)
  Firebase.analytics()
}
