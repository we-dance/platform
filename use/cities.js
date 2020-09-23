import Vue from 'vue'
import { watch, toRefs, computed } from '@nuxtjs/composition-api'
import ls from 'local-storage'
import useDoc from '~/use/doc'

const state = Vue.observable({
  currentCity: ls('city')
})

export default () => {
  const { doc: city, find } = useDoc('cities')

  const currentCity = computed(() => state.currentCity)

  watch(currentCity, (currentCity) => {
    if (currentCity) {
      ls('city', currentCity)
      find('name', currentCity)
    }
  })

  return {
    ...toRefs(state),
    city
  }
}
