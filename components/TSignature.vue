<template>
  <div class="text-sm flex items-center">
    <img
      class="rounded-full mr-2"
      :class="small ? 'w-4 h-4' : 'w-10 h-10'"
      :src="getProfile(item.createdBy).photo"
    />
    <div :class="small ? 'flex justify-between w-full' : ''">
      <router-link
        class="hover:underline"
        :to="`/u/${getProfile(item.createdBy).username}`"
        >{{ getProfile(item.createdBy).name }}</router-link
      >
      <div class="text-gray-600">{{ getDateTime(item.createdAt) }}</div>
    </div>
  </div>
</template>

<script>
import useProfiles from '~/use/profiles'
import { getDateTime } from '~/utils'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { getProfile } = useProfiles()

    return {
      getProfile,
      getDateTime
    }
  }
}
</script>
