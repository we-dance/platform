<template>
  <main>
    <TButton label="Migrate" @click="migrate()" />
    <pre v-for="doc in docs" :key="doc.id" class="border p-4 mb-4">
      City: {{ doc.city }}
      Place: {{ doc.place }} - {{ getCity(doc.place) }}
    </pre>
  </main>
</template>

<script>
import { computed } from 'vue-demi'
import useCollection from '~/use/collection'
import useDoc from '~/use/doc'
import { useApp } from '~/use/app'

export default {
  name: 'PageAdminPlaces',
  setup() {
    const { docs: all } = useCollection('shares')
    const { update } = useDoc('shares')
    const { cache, cities } = useApp()

    const docs = computed(() => all.value.filter((d) => !!d.city))

    const getCity = (placeId) => {
      if (!placeId) {
        return ''
      }

      if (!cache.value) {
        return ''
      }

      return cache.value.cities[placeId]?.name
    }

    const getPlaceByCity = (city) => {
      if (!city) {
        return ''
      }

      const community = cities.value.find((c) => c.name === city)

      if (!community) {
        return ''
      }

      return community.location.place_id
    }

    // const getPlaceById = (placeId) => {
    //   if (!placeId) {
    //     return ''
    //   }

    //   if (!cache.value) {
    //     return ''
    //   }

    //   if (!cache.value.cities[placeId]) {
    //     return ''
    //   }

    //   return placeId
    // }

    const migrate = async () => {
      for (const doc of docs.value) {
        const place = getPlaceByCity(doc.city)

        if (place) {
          await update(doc.id, { place })
        }
      }
    }

    return {
      docs,
      cache,
      migrate,
      getCity
    }
  }
}
</script>
