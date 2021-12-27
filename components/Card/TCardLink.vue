<template>
  <component v-if="component" :is="component" :url="url" />
  <a
    v-else
    :href="url"
    class="underline text-blue-500 hover:no-underline p-4"
    >{{ url }}</a
  >
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
