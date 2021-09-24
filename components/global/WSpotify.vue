<template>
  <figure :class="wrapperClass">
    <iframe
      :src="getSpotifyEmbedUrl(url)"
      :class="iframeClass"
      frameborder="0"
      allowtransparency="true"
      allow="encrypted-media"
    ></iframe>
  </figure>
</template>

<script>
export default {
  name: 'WSpotify',
  props: {
    url: {
      type: String,
      default: '',
    },
    wrapperClass: {
      type: String,
      default: 'aspect-ratio',
    },
    iframeClass: {
      type: String,
      default: '',
    },
  },
  methods: {
    getSpotifyEmbedUrl(url) {
      if (!url) {
        return ''
      }
      const playlistId = url.replace('https://open.spotify.com/playlist/', '')
      return `https://open.spotify.com/embed/playlist/${playlistId}`
    },
  },
}
</script>
