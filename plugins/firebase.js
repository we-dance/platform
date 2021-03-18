import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'
import { onGlobalSetup, provide } from '@nuxtjs/composition-api'

export default ({ env: { firebase } }) => {
  onGlobalSetup(() => {
    provide('maker', 'Alex')
  })

  if (Firebase.apps.length > 0) {
    return
  }

  Firebase.initializeApp(firebase.config)

  if (firebase.services.analytics) {
    Firebase.analytics()
  }
}
