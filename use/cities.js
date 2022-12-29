import Vue from 'vue'
import { watch, toRefs, computed } from '@nuxtjs/composition-api'
import ls from 'local-storage'
import { useDoc } from '~/use/doc'
import { slugify } from '~/utils'
import { getLocality } from '~/use/google'

const state = Vue.observable({
  currentCity: ls('city'),
})

export const useCities = () => {
  const { doc: city, id: cityId, exists, find, create, softUpdate } = useDoc(
    'profiles'
  )

  const currentCity = computed(() => state.currentCity || ls('city'))

  const cityName = computed(() => {
    return city.value?.name
  })

  find('cityPlaceId', currentCity.value)

  watch(currentCity, (currentCity) => {
    ls('city', currentCity || '')

    if (currentCity) {
      find('cityPlaceId', currentCity)
    } else {
      city.value = {}
    }
  })

  async function switchCity(placeId) {
    await find('cityPlaceId', placeId)

    if (!exists.value) {
      const location = await getLocality({ placeId })

      const cityProfile = {
        username: slugify(location.country + '-' + location.locality),
        name: location.locality + ', ' + location.country,
        type: 'City',
        place: placeId,
        cityPlaceId: placeId,
        location,
      }

      await create(cityProfile)
    }

    if (!city.value.location?.latitude) {
      const location = await getLocality({ placeId })
      await softUpdate(cityId.value, {
        location,
      })
    }

    state.currentCity = placeId
  }

  return {
    ...toRefs(state),
    city,
    cityName,
    switchCity,
  }
}
