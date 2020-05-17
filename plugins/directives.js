import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'
import VueTour from 'vue-tour'

Vue.directive('focus', {
  inserted: (el) => {
    el.focus()
  }
})

Vue.use(Vue2TouchEvents)
Vue.use(VueTour)

document.oncontextmenu = () => {
  return false
}
