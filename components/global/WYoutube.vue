<template>
  <figure class="aspect-ratio">
    <iframe :src="src" frameborder="0" allowfullscreen></iframe>
  </figure>
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
    src() {
      if (!this.url) {
        return ''
      }

      const videoId = getYoutubeId(this.url)

      return `https://www.youtube.com/embed/${videoId}`
    },
  },
}
</script>
