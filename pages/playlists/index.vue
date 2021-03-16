<template>
  <TList
    title="Playlists"
    add="Add Playlist"
    add-url="/playlists/-/edit"
    collection="playlists"
  >
    <template v-slot:item="{ item }">
      <TPlaylist :playlist="item" class="border rounded space-y-2" />
    </template>
  </TList>
</template>

<script>
export default {
  name: 'PagePlaylistIndex'
}
</script>
