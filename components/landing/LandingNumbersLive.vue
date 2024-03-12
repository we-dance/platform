<template>
  <div ref="target" class="px-4">
    <h2 class="text-center text-xl font-bold">
      {{ $t('home.numbers.title') }}
    </h2>
    <div class="mt-4 grid grid-cols-3 gap-4 max-w-4xl mx-auto">
      <div class="p-4 space-y-1 bg-light rounded shadow">
        <h3 class="text-2xl font-extrabold text-center">
          {{ numbers ? numbers.cities : '...' }}
        </h3>
        <p class="text-center text-xs">
          {{ $t('home.numbers.cities') }} in
          {{ numbers ? numbers.countries : '...' }}
          {{ $t('home.numbers.countries') }}
        </p>
      </div>
      <div class="p-4 space-y-1 bg-light rounded shadow">
        <h3 class="text-2xl font-extrabold text-center">
          {{ numbers ? numbers.profiles : '...' }}
        </h3>
        <p class="text-center text-xs">
          {{ $t('home.numbers.profiles') }}
        </p>
      </div>
      <div class="p-4 space-y-1 bg-light rounded shadow">
        <h3 class="text-2xl font-extrabold text-center">
          {{ numbers ? numbers.events : '...' }}
        </h3>
        <p class="text-center text-xs">
          {{ $t('home.numbers.events') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useElementVisibility } from '@vueuse/core'
import { ref, watch } from '@nuxtjs/composition-api'
import { useAlgolia } from '~/use/algolia'
import { useAuth } from '~/use/auth'

export default {
  name: 'Index',
  layout: 'default',
  setup() {
    const target = ref(null)
    const targetIsVisible = useElementVisibility(target)

    const { uid, username } = useAuth()

    const { response: responseProfiles, search: searchProfiles } = useAlgolia(
      'profiles'
    )

    const { response: responseEvents, search: searchEvents } = useAlgolia(
      'events'
    )

    const numbers = ref(null)

    watch(targetIsVisible, (isVisible) => {
      if (isVisible) {
        load()
      }
    })

    async function load() {
      if (numbers.value) {
        return
      }

      await searchProfiles('', {
        filters: `lastLoginAt > 0`,
        facets: ['style', 'locality', 'country'],
        hitsPerPage: 0,
        maxValuesPerFacet: 1000,
        analytics: false,
      })

      await searchEvents('', {
        filters: ``,
        facets: ['style', 'locality', 'country'],
        hitsPerPage: 0,
        maxValuesPerFacet: 1000,
        analytics: false,
      })

      numbers.value = {
        profiles: responseProfiles.value.nbHits,
        events: responseEvents.value.nbHits,
        cities: Object.keys(responseProfiles.value.facets.locality).length,
        countries: Object.keys(responseProfiles.value.facets.country).length,
      }
    }

    return { target, uid, username, numbers }
  },
}
</script>
