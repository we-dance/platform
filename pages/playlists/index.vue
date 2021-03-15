<template>
  <TCardList
    :collection="collection"
    title="Playlists"
    add="Add"
    :fields="playlistFields"
    :filters="filters"
    :map="map"
  >
    <template v-slot:default="{ item }">
      <div class="rounded border space-y-2 overflow-hidden">
        <div class="flex justify-between p-4">
          <div>
            <h2 class="font-bold text-lg">{{ item.name }}</h2>
            <div class="flex items-center space-x-1">
              <TIcon name="icon" class="w-4 h-4" />
              <TAvatar name :uid="item.createdBy" />
            </div>
          </div>
          <div>{{ getDateTime(item.createdAt) }}</div>
        </div>

        <figure class="aspect-ratio">
          <iframe
            :src="getSpotifyEmbedUrl(item.url)"
            frameborder="0"
            allowtransparency="true"
            allow="encrypted-media"
          ></iframe>
        </figure>
      </div>
    </template>
  </TCardList>
</template>

<script>
import { getDateTime } from '~/utils'
import { playlistFields } from '~/use/playlists'
import useAuth from '~/use/auth'
import useProfiles from '~/use/profiles'

export default {
  setup() {
    const collection = 'playlists'

    const { uid } = useAuth()
    const { getProfile } = useProfiles()

    const filters = [
      {
        name: 'all',
        label: 'All',
        default: true
      },
      {
        name: 'mine',
        label: 'Mine',
        filter: (item) => item.createdBy === uid.value
      }
    ]

    return {
      collection,
      playlistFields,
      getDateTime,
      filters,
      uid,
      getProfile
    }
  },
  methods: {
    getSpotifyEmbedUrl(url) {
      const playlistId = url.replace('https://open.spotify.com/playlist/', '')
      return `https://open.spotify.com/embed/playlist/${playlistId}`
    }
  }
}
</script>
