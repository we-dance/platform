<template>
  <component v-if="component" :is="component" :url="url" />
  <div v-else class="p-4 text-xs text-center">
    <a
      :href="url"
      target="_blank"
      class="underline text-blue-500 hover:no-underline "
      >{{ url }}</a
    >
  </div>
</template>
<script>
import { getYoutubeId } from '~/utils'

export default {
  props: {
    url: {
      type: String,
      default: '',
    },
  },
  computed: {
    component() {
      const videoId = getYoutubeId(this.url)

      if (videoId) {
        return 'WYoutube'
      }

      return ''
    },
  },
}
</script>
