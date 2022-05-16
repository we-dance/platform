<template>
  <div
    class="border-t mt-4 p-4 bg-white flex justify-between posts-center sticky bottom-0"
  >
    <TButtonFav :collection="collection" :item="item" />
    <div class="flex space-x-2">
      <TCardActions :id="item.id" :collection="collection" :item="item" />
      <TButtonShare
        :id="item.id"
        :collection="collection"
        :place="item.place"
        :file="item.socialCover"
        :file-name="title"
        :url="`https://wedance.vip/events/${item.id}`"
        :text="title"
        type="base"
        label="Share"
      />
    </div>
  </div>
</template>

<script>
import { getDateTime } from '~/utils'
import { useProfiles } from '~/use/profiles'

export default {
  name: 'TItemFooter',
  props: {
    title: {
      type: String,
      default: '',
    },
    collection: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    url() {
      const appUrl = 'https://wedance.vip'

      const urls = {
        playlists: `${appUrl}/playlists/${this.item.id}`,
        posts: `${appUrl}/posts/${this.item.id}`,
        events: `${appUrl}/events/${this.item.id}`,
        profiles: `${appUrl}/${this.item.username}`,
      }

      return urls[this.collection]
    },
    publishedAt() {
      return getDateTime(this.item?.createdAt)
    },
    creator() {
      return this.getProfile(this.item?.createdBy)
    },
  },
  setup() {
    const { getProfile } = useProfiles()

    return {
      getProfile,
    }
  },
}
</script>
