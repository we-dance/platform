import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'
import VueTour from 'vue-tour'
import WTelegram from '~/components/WTelegram'
import WInstagram from '~/components/WInstagram'
import WYoutube from '~/components/WYoutube'
import WProfile from '~/components/WProfile'
import WGumroad from '~/components/WGumroad'
import WTeaser from '~/components/WTeaser'

Vue.directive('focus', {
  inserted: (el) => {
    el.focus()
  }
})

Vue.use(Vue2TouchEvents)
Vue.use(VueTour)

Vue.component('WTelegram', WTelegram)
Vue.component('WInstagram', WInstagram)
Vue.component('WYoutube', WYoutube)
Vue.component('WProfile', WProfile)
Vue.component('WGumroad', WGumroad)
Vue.component('WTeaser', WTeaser)

// document.oncontextmenu = () => {
//   return false
// }
