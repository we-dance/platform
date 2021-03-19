<template>
  <div v-if="!loading && playlist">
    <TButton
      icon="spotify"
      type="icon"
      :label="playlist.name"
      v-bind="$attrs"
      @click="isOpen = true"
    />
    <TPopup
      v-if="isOpen"
      :title="playlist.name"
      class="text-dark"
      @close="isOpen = false"
    >
      <div class="w-screen max-w-md h-64">
        <w-spotify
          :url="playlist.url"
          wrapper-class="w-full h-full"
          iframe-class="w-full h-full"
        />
      </div>
    </TPopup>
  </div>
  <div v-else>...</div>
</template>

<script>
import { computed } from '@vue/composition-api'
import useDoc from '~/use/doc'
import useProfiles from '~/use/profiles'

export default {
  name: 'WPlaylist',
  inheritAttrs: false,
  props: {
    id: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: false
    },
    opened: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isOpen: false
  }),
  mounted() {
    this.isOpen = this.opened
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
