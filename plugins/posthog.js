import firebase from 'firebase/app'
import 'firebase/analytics'
import posthog from 'posthog-js'

export default function({ app: { router } }, inject) {
  if (process.env.analyticsEnabled) {
    posthog.init('phc_vL8Ex5Ph5yi1aoEALtthrjI0yC3w9vdyo05Acbdstqg', {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: false,
    })
  }

  if (process.env.analyticsDebug) {
    console.log('[track]', {
      analyticsEnabled: process.env.analyticsEnabled,
      analyticsDebug: process.env.analyticsDebug,
    })
  }

  const track = function(...params) {
    if (!process.client) {
      return
    }

    if (process.env.analyticsDebug) {
      console.log('[track]', ...params)
    }

    if (!process.env.analyticsEnabled) {
      return
    }

    const analytics = firebase.analytics()
    analytics.logEvent(...params)

    if (params[0] === 'page_view') {
    } else if (params[0] === 'screen_view') {
      posthog.capture('$pageview', params)
    } else {
      posthog.capture(...params)
    }
  }

  inject('posthog', posthog)
  inject('track', track)
}
