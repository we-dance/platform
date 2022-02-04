<template>
  <div class="p-4 bg-gray-100">
    <TProfileCard3
      :label="`Published on ${publishedAt} by`"
      :profile="creator"
    />
    <TPreview
      v-if="full && creator.story"
      :content="creator.story"
      class="mt-4"
    />
    <TProfileContacts
      v-if="full"
      :profile="creator"
      class="mt-4 p-2 bg-gray-100"
    />
  </div>
</template>

<script>
import { getDateTime } from '~/utils'
import { useProfiles } from '~/use/profiles'

export default {
  name: 'TItemFooter',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    full: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    publishedAt() {
      return getDateTime(this.item?.createdAt)
    },
    creator() {
      return this.getFullProfile(this.item?.createdBy)
    },
  },
  setup() {
    const { getFullProfile } = useProfiles()

    return {
      getFullProfile,
    }
  },
}
</script>
