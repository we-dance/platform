<template>
  <div>
    <THeader>
      <t-input v-model="query" placeholder="Search city" />
    </THeader>

    <div v-for="city in results" :key="city.value" class="border-b flex">
      <div
        class="flex-grow text-lg p-4 cursor-pointer hover:bg-red-100"
        @click="changeCity(city.value)"
      >
        {{ city.label }}
      </div>
      <TButton
        type="nav"
        icon="close"
        class="p-4"
        @click="removeCityHistory(city.value)"
      />
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
    const { getCityHistory, removeCityHistory: removeCity, cities } = useApp()

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
        results = cities.value.filter(searchByStart('name', q))
      }

      results = results.map((c) => ({
        label: `${c.location.locality}, ${c.location.country}`,
        value: c.location.place_id
      }))

      results = results.sort(sortBy('label'))

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

    async function render() {
      const res = await fetchOptions(query.value)

      results.value = res.results
    }

    async function removeCityHistory(placeId) {
      await removeCity(placeId)
      await render()
    }

    watch(query, render)

    onMounted(render)

    return {
      currentCity,
      cities,
      changeCity,
      query,
      results,
      removeCityHistory
    }
  },
  head() {
    return {
      title: 'WeDance Cities'
    }
  }
}
</script>
