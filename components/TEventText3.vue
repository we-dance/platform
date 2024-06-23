<template>
  <NuxtLink
    :to="localePath(`/events/${item.id}`)"
    :target="isEmbed ? '_blank' : '_self'"
    class="flex border-b p-4 leading-none gap-2"
  >
    <div ref="target" class="text-center">
      <div class="text-xl font-bold leading-none">
        {{ formatDate(item.startDate, 'd') }}
      </div>
      <div class="w-12 text-sm">
        {{ formatDate(item.startDate, 'MMM') }}
      </div>
    </div>
    <div class="w-full">
      <div class="font-bold text-sm hover:underline hover:text-primary">
        {{ item.name }}
      </div>
      <div>
        <div class="text-xs text-gray-700">
          {{ item.price }}
          <template v-if="item.venue">
            <template
              >· {{ addressPart(item.venue, 'locality') }} ·
              {{ addressPart(item.venue, 'country') }}
            </template>
          </template>
        </div>
      </div>
      <div v-if="item.specialOffer" class="text-primary text-xs">
        {{ item.specialOffer }}
      </div>
    </div>
    <div>
      <img class="w-20 rounded" :src="item.cover" :alt="`${item.name} cover`" />
    </div>
  </NuxtLink>
</template>

<script>
import { ref, watch } from '@nuxtjs/composition-api'
import { formatDate } from '~/utils'
import { useApp } from '~/use/app'
import { useEvents } from '~/use/events'
import { useCities } from '~/use/cities'
import { addressPart } from '~/use/google'
import { useElementVisibility } from '@vueuse/core'

export default {
  name: 'TEventText',
  setup(props, { emit }) {
    const { getCity } = useApp()
    const { currentCity } = useCities()
    const { getEventIcon } = useEvents()
    const target = ref(null)
    const targetIsVisible = useElementVisibility(target)

    watch(targetIsVisible, (isVisible) => {
      if (isVisible) {
        emit('visible', isVisible)
      }
    })

    return {
      target,
      targetIsVisible,
      formatDate,
      getCity,
      currentCity,
      addressPart,
      getEventIcon,
    }
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    isEmbed: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
