<template>
  <div class="flex flex-col items-center p-2 gap-2 overflow-x-hidden border-b">
    <div class="flex flex-row items-center gap-2 w-full h-fit ">
      <TAvatar photo size="md" :uid="item.createdBy" />
      <div class="flex flex-col items-start w-full">
        <TAvatar name size="md" :uid="item.createdBy" />
        <div class="text-gray-600 text-xs">
          {{ dateDiff(item.createdAt) }}
        </div>
      </div>
    </div>
    <div class="flex justify-left w-full h-fit items-center gap-2">
      <TRatingItem :value="item.stars" />
      <div v-if="item.sourceFacebook">
        <a
          :href="item.sourceFacebook"
          target="_blank"
          class="text-primary text-xs"
        >
          Review on Facebook
        </a>
      </div>
      <div v-if="item.sourceGoogle">
        <a
          :href="item.sourceGoogle"
          target="_blank"
          class="text-primary text-xs"
        >
          Review on Google
        </a>
      </div>
    </div>
    <div v-if="item.description" class="w-full text-sm">
      {{ item.description }}
    </div>
  </div>
</template>

<script>
import { dateDiff } from '~/utils'

export default {
  name: 'TReview',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return {
      dateDiff,
    }
  },
}
</script>
