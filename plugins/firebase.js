import { initializeApp, getApps } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

export default ({ env: { firebase } }) => {
  if (getApps().length > 0) {
    return
  }

  initializeApp(firebase.config)

  if (firebase.services.analytics) {
    getAnalytics()
  }
}
