import posthog from 'posthog-js'

export default function({ app: { router } }, inject) {
  posthog.init('phc_vL8Ex5Ph5yi1aoEALtthrjI0yC3w9vdyo05Acbdstqg', {
    api_host: 'https://app.posthog.com',
  })

  inject('posthog', posthog)
}
