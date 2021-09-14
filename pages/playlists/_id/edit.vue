<template>
  <TItemEdit
    title="Edit Playlist"
    save-label="Save"
    add-label="Add"
    collection="playlists"
    singular="playlists"
    index-url="/playlists"
    :fields="playlistFields"
    :edit-creator="isAdmin()"
  />
</template>

<script>
import { playlistFields } from '~/use/playlists'
import { useAuth } from '~/use/auth'

export default {
  name: 'PagePlaylistEdit',
  layout: 'dark',
  middleware: ['auth'],
  setup() {
    const { isAdmin } = useAuth()

    return {
      playlistFields,
      isAdmin,
    }
  },
}
</script>
