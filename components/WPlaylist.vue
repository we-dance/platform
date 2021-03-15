<template>
  <div>
    <div v-if="!loading" class="flex justify-between items-center">
      <div>
        <button
          class="font-bold cursor-pointer text-blue-700 underline hover:no-underline"
          @click="isOpen = !isOpen"
        >
          {{ playlist.name }}
        </button>
      </div>
    </div>
    <div v-if="isOpen" class="mt-4">
      <figure class="aspect-ratio">
        <iframe
          :src="getSpotifyEmbedUrl(playlist.url)"
          frameborder="0"
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe>
      </figure>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import useDoc from '~/use/doc'
import useProfiles from '~/use/profiles'

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    isOpen: false
  }),
  methods: {
    getSpotifyEmbedUrl(url) {
      const playlistId = url.replace('https://open.spotify.com/playlist/', '')
      return `https://open.spotify.com/embed/playlist/${playlistId}`
    }
  },
  setup(params) {
    const collection = 'playlists'

    const { doc: playlist, load, loading } = useDoc(collection)

    const { getProfile } = useProfiles()
    const author = computed(() => getProfile(playlist.value?.createdBy))

    if (params.id !== '-') {
      load(params.id)
    }

    return {
      loading,
      playlist,
      collection,
      author
    }
  }
}
</script>
