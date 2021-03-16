<template>
  <div>
    <w-spotify :url="playlist.url" />

    <div class="flex justify-between space-x-2 items-center p-4">
      <TButton
        icon="favorite"
        type="icon"
        :class="isFavorite ? 'text-primary' : 'text-gray-500'"
        @click="addToFavorites()"
      />

      <div class="flex-grow">
        <router-link
          :to="`/playlists/${playlist.id}`"
          class="font-bold text-lg cursor-pointer leading-none"
        >
          {{ playlist.name }}
        </router-link>
        <div class="flex items-center space-x-1 text-sm">
          <TIcon name="icon" class="w-4 h-4" />
          <TAvatar name :uid.sync="playlist.createdBy" />
        </div>
      </div>

      <TStyles :value="playlist.dances" :max="2" />

      <TMenu>
        <template v-slot:button>
          <TButton icon="more_vert" type="icon" />
        </template>
        <template v-slot:menu>
          <div class="w-32 py-2 bg-white rounded-lg shadow-xl border">
            <TButton type="context" :to="`/playlists/${playlist.id}/edit`"
              >Edit</TButton
            >
          </div>
        </template>
      </TMenu>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useProfiles from '~/use/profiles'
import useFavorites from '~/use/favorites'

export default {
  name: 'TPlaylist',
  props: {
    playlist: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { uid } = useAuth()
    const { getProfile } = useProfiles()
    const author = computed(() => getProfile(props.playlist.value?.createdBy))
    const { isFavorite, addToFavorites } = useFavorites(
      uid.value,
      'playlists',
      props.playlist
    )

    return {
      author,
      isFavorite,
      addToFavorites
    }
  }
}
</script>
