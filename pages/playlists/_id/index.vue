<template>
  <main class="space-y-4">
    <TButton label="← Playlists" to="/playlists" type="link" />
    <TPlaylist :playlist="doc" class="border rounded space-y-2" />
  </main>
</template>

<script>
import { loadDoc } from '~/utils'

export default {
  name: 'PagePlaylistView',
  async asyncData(ctx) {
    return await loadDoc(ctx, 'playlists')
  }
}
</script>
