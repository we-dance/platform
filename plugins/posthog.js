import posthog from 'posthog-js'
import Vue from 'vue'

export default function({ app: { router } }, inject) {
  posthog.init('phc_vL8Ex5Ph5yi1aoEALtthrjI0yC3w9vdyo05Acbdstqg', {
    api_host: 'https://app.posthog.com',
    capture_pageview: false,
    loaded: () => posthog.identify('unique_id'),
  })

  inject('posthog', posthog)

  router.afterEach((to) => {
    Vue.nextTick(() => {
      posthog.capture('$pageview', {
        $current_url: to.fullPath,
      })
    })
  })
}
