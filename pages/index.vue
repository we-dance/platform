<template>
  <div
    v-if="!city"
    class="bg-dark-gradient text-real-white flex-grow flex items-center justify-center"
  >
    <div class="p-4 mx-auto max-w-2xl text-center">
      <h1 class="text-5xl font-bold leading-tight">
        Exclusive for
        <span class="text-light">Dancers.</span>
      </h1>
      <p class="mt-2 text-xl">
        Salsa, Bachata, Kizomba, Tango, Zouk and more.
      </p>
      <div class="text-black mt-4 flex justify-center text-xl">
        <div>
          <TInputCity v-model="currentCity" hide-global />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="p-4 mx-auto max-w-xl mb-16">
    <h1 class="font-bold text-4xl">Welcome to {{ city.name }}!</h1>

    <router-link
      to="/events"
      class="mt-4 flex items-center rounded-full border p-4 bg-real-white cursor-pointer hover:border-primary"
    >
      <TIcon name="calendar" class="h-8 w-8 mr-2" />
      <div>
        <h2 class="text-sm uppercase text-primary leading-tight">
          Find workshop or party
        </h2>
      </div>
    </router-link>

    <router-link
      to="/people"
      class="mt-4 flex items-center rounded-full border p-4 bg-real-white cursor-pointer hover:border-primary"
    >
      <TIcon name="friends" class="h-8 w-8 mr-2" />
      <div>
        <h2 class="text-sm uppercase text-primary leading-tight">
          Find a partner
        </h2>
        <h3 v-if="partnersCount > 0" class="font-bold text-xl">
          {{ partnersCount }} want to dance
        </h3>
      </div>
    </router-link>

    <router-link
      to="/feed"
      class="mt-4 flex items-center rounded-full border p-4 bg-real-white cursor-pointer hover:border-primary"
    >
      <TIcon name="news" class="h-8 w-8 mr-2" />
      <div>
        <h2 class="text-sm uppercase text-primary leading-tight">
          Read news
        </h2>
      </div>
    </router-link>
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import useCities from '~/use/cities'
import useCollection from '~/use/collection'
import { sortBy } from '~/utils'

export default {
  layout: 'minimal',
  setup() {
    const { currentCity, city } = useCities()

    const { docs: docsProfiles } = useCollection('profiles')

    const docs = computed(() => {
      return docsProfiles.value
        .filter((item) => item.community === currentCity.value)
        .sort(sortBy('-createdAt'))
    })

    const partnersCount = computed(() => {
      return docs.value.filter(
        (item) => item.username && item.partner === 'Yes'
      ).length
    })

    const partnersPublic = computed(() => {
      return docs.value.filter(
        (item) =>
          item.username &&
          item.partner === 'Yes' &&
          item.visibility === 'Public'
      )
    })

    return {
      currentCity,
      city,
      partnersCount,
      partnersPublic
    }
  }
}
</script>
