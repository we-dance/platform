<template>
  <div class="p-4 md:-mx-4 md:-mb-4 bg-gray-100">
    <TProfileCard3
      :label="`Published on ${publishedAt} by`"
      :profile="creator"
    />
  </div>
</template>

<script>
import { getDateTime } from '~/utils'
import useProfiles from '~/use/profiles'

export default {
  name: 'TItemFooter',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    publishedAt() {
      return getDateTime(this.item?.createdAt)
    },
    creator() {
      return this.getProfile(this.item?.createdBy)
    }
  },
  setup() {
    const { getProfile } = useProfiles()

    return {
      getProfile
    }
  }
}
</script>
