import firebase from 'firebase/app'
import 'firebase/analytics'
import posthog from 'posthog-js'

export default function({ app: { router } }, inject) {
  if (process.env.ANALYTICS_ENABLED) {
    posthog.init('phc_vL8Ex5Ph5yi1aoEALtthrjI0yC3w9vdyo05Acbdstqg', {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: false,
    })
  }

  const track = function(...params) {
    if (!process.client) {
      return
    }

    if (process.env.ANALYTICS_DEBUG) {
      console.log('[track]', ...params)
    }

    if (!process.env.ANALYTICS_ENABLED) {
      if (process.env.ANALYTICS_DEBUG) {
        console.log('[track:disabled]')
      }
      return
    }

    const analytics = firebase.analytics()
    analytics.logEvent(...params)

    if (params[0] === 'page_view') {
      posthog.capture('$pageview')
    } else {
      posthog.capture(...params)
    }
  }

  inject('posthog', posthog)
  inject('track', track)
}
