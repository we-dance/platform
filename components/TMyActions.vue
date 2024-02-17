<template>
  <div
    class="border-b border-orange-200 grid grid-cols-3 divide-orange-200 divide-x divide-y bg-orange-100"
  >
    <router-link
      :to="localePath(`/reviews/add`)"
      class="flex flex-col items-center hover:bg-orange-200 p-4 gap-1"
    >
      <StarIcon class="w-8 h-8" />
      <div class="text-xs font-bold uppercase">Recommend</div>
    </router-link>
    <router-link
      :to="localePath(`/events/-/import`)"
      class="flex flex-col items-center hover:bg-orange-200 p-4 gap-1"
    >
      <PlusSmIcon class="w-8 h-8" />
      <div class="text-xs font-bold uppercase">Add Event</div>
    </router-link>
    <router-link
      :to="
        city.username
          ? localePath(`/explore/${city.username}`)
          : localePath('/explore')
      "
      class="flex flex-col items-center hover:bg-orange-200 p-4 gap-1"
    >
      <CalendarIcon class="w-8 h-8" />
      <div class="text-xs font-bold uppercase text-center">Explore</div>
    </router-link>
  </div>
</template>

<script>
import { CalendarIcon, StarIcon, PlusSmIcon } from '@vue-hero-icons/outline'
import { useCities } from '~/use/cities'

export default {
  name: 'TMyActions',
  components: {
    CalendarIcon,
    StarIcon,
    PlusSmIcon,
  },
  setup() {
    const { city } = useCities()

    return { city }
  },
}
</script>
