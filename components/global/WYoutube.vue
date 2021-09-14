<template>
  <figure class="aspect-ratio">
    <iframe :src="src" frameborder="0" allowfullscreen></iframe>
  </figure>
</template>

<script>
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

      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
      const match = this.url.match(regExp)
      const videoId = match && match[7].length === 11 ? match[7] : ''

      return `https://www.youtube.com/embed/${videoId}`
    },
  },
}
</script>
