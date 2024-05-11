<template>
  <div class="text-xs">
    <TAvatar photo name :uid="doc.createdBy">
      <span>•</span>
      <div>{{ dateDiff(doc.createdAt) }}</div>
    </TAvatar>
    <div v-if="doc.sourceUrl" class="mt-1 text-xs text-gray-700">
      imported the event from
      <strong class="font-bold">{{ doc.source || 'url' }}</strong
      ><template v-if="doc.provider"
        >, provided by
        <strong class="font-bold">{{ doc.provider }}</strong></template
      ><template v-if="doc.sourceUrl"
        >, see
        <a
          :href="doc.sourceUrl"
          target="_blank"
          class="text-primary underline hover:no-underline"
          >source</a
        ></template
      >.
    </div>
    <div v-else class="mt-1 text-xs text-gray-700">
      created the event
    </div>
  </div>
</template>

<script>
import { dateDiff } from '~/utils'

export default {
  props: {
    doc: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return { dateDiff }
  },
}
</script>
