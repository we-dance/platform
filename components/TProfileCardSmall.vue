<template>
  <div>
    <div v-if="label" class="font-bold text-sm mb-4 leading-none text-gray-700">
      {{ label }}
    </div>
    <div class="flex items-center">
      <NuxtLink :to="`/${profile.username}`">
        <TProfilePhoto2 size="xs" :src="profile.photo" />
      </NuxtLink>
      <div class="ml-1">
        <NuxtLink class=" text-xs hover:underline" :to="`/${profile.username}`">
          {{ profile.username }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import { getLabels } from '~/utils'
import languages from '~/assets/languages'

export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    profile: {
      type: Object,
      default: () => ({}),
    },
    showDetails: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      getLabels,
      languages,
    }
  },
}
</script>
