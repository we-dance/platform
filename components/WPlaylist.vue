<template>
  <div>
    <div v-if="!loading && playlist" class="flex justify-between items-center">
      <div class="flex space-x-2">
        <button
          class="font-bold cursor-pointer text-blue-700 underline hover:no-underline"
          @click="isOpen = !isOpen"
        >
          {{ playlist.name }}
        </button>
        <TButton icon="edit" type="icon" :to="`/playlists/${id}/edit`" />
      </div>
    </div>
    <div v-if="isOpen && playlist" class="mt-4">
      <w-spotify :url="playlist.url" />
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import useDoc from '~/use/doc'
import useProfiles from '~/use/profiles'

export default {
  name: 'WPlaylist',
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
