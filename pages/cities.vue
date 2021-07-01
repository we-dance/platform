<template>
  <div>
    <div class="p-2 border-b">
      <t-input v-model="query" placeholder="Search city" />
    </div>

    <div
      v-for="city in results"
      :key="city.value"
      class="border-b p-4 text-lg cursor-pointer hover:bg-red-100"
      @click="changeCity(city.value)"
    >
      {{ city.label }}
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue-demi'
import { useCities } from '~/use/cities'
import { useRouter } from '~/use/router'
import { useApp } from '~/use/app'
import { getPlacePredictions } from '~/use/google'
import { searchByStart, sortBy } from '~/utils'

export default {
  setup() {
    const { currentCity } = useCities()
    const { router } = useRouter()
    const { getCityHistory, cities } = useApp()

    function changeCity(placeId) {
      currentCity.value = placeId
      router.push('/feed')
    }

    const query = ref('')

    const fetchOptions = async (q) => {
      let results = []

      if (!q) {
        const cityHistory = await getCityHistory()

        if (cityHistory) {
          results.push(...cityHistory)
        }
      } else {
        results = cities.value
          .filter(searchByStart('name', q))
          .sort(sortBy('name'))
      }

      results = results.map((c) => ({
        label: `${c.location.locality}, ${c.location.country}`,
        value: c.location.place_id
      }))

      if (q && results.length < 3) {
        const places = await getPlacePredictions(q)

        if (places.length) {
          results.push(
            ...places
              .map((i) => ({
                label: `${i.description} *`,
                value: i.place_id
              }))
              .filter((n) => !results.find((o) => n.value === o.value))
          )
        }
      }

      return { results }
    }

    const results = ref([])

    watch(query, async () => {
      const res = await fetchOptions(query.value)

      results.value = res.results
    })

    onMounted(async () => {
      const res = await fetchOptions(query.value)

      results.value = res.results
    })

    return { currentCity, cities, changeCity, query, results }
  }
}
</script>
