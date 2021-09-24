<template>
  <div>
    <w-spotify :url="playlist.url" />

    <div class="p-4">
      <div class="flex justify-between space-x-2 items-center">
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

      <TItemFooter
        collection="playlists"
        :item="playlist"
        :title="playlist.name"
      />
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { useProfiles } from '~/use/profiles'

export default {
  name: 'TPlaylist',
  props: {
    playlist: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { getProfile } = useProfiles()
    const author = computed(() => getProfile(props.playlist.value?.createdBy))

    return {
      author,
    }
  },
}
</script>
