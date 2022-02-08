<template>
  <component :is="component" v-if="component" :url="url" />
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
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    component() {
      const videoId = getYoutubeId(this.url)

      if (videoId) {
        return 'WYoutube'
      }

      if (this.url.includes('https://wedance.vip/lists/')) {
        return this.show ? 'WList' : 'div'
      }

      return ''
    },
  },
}
</script>
