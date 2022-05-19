import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.directive('focus', {
  inserted: (el) => {
    el.focus()
  },
})

Vue.use(Vue2TouchEvents)
