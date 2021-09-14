<template>
  <div v-if="!uid" class="mt-4 mx-auto max-w-md p-4 text-sm">
    <TIcon name="undraw_video_files" class="p-4" />
    <div>Dance videos directory</div>
    <div v-if="!uid" class="mt-8 bg-gray-400 p-4 rounded text-center">
      <div>Sign in to access</div>
      <TButton class="mt-2" to="/signin?target=/trips">Sign in</TButton>
    </div>
  </div>
  <div v-else>
    <TCardList
      :collection="collection"
      title="Videos"
      add="Add a video"
      :fields="fields"
      :filters="filters"
      :map="map"
    >
      <template v-slot:default="{ item }">
        <div class="mb-4 bg-white max-w-sm">
          <div class="aspect-ratio">
            <iframe
              :src="`https://www.youtube.com/embed/${item.videoId}`"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
          <div class="px-2 py-4 flex justify-between">
            <TTagsPreview :value="item.tags" />

            <div class="flex">
              <div class="text-green-500 flex justify-center">
                <button
                  class="text-center hover:text-green-500"
                  :class="{ 'text-green-700': item.response === 'up' }"
                  @click="updateRsvp(item.id, 'videos', 'up')"
                >
                  <TIcon name="up" class="h-6 w-6" />
                </button>
                <div>
                  {{ item.upVotes }}
                </div>
              </div>
              <div class="text-red-500 flex ml-2 justify-center">
                <button
                  class="text-center hover:text-primary"
                  :class="{ 'text-red-700': item.response === 'down' }"
                  @click="updateRsvp(item.id, 'videos', 'down')"
                >
                  <TIcon name="down" class="h-6 w-6 hover:text-primary" />
                </button>
                <div>
                  {{ item.downVotes }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </TCardList>
  </div>
</template>

<script>
import { getDateTime } from '~/utils'
import { useAuth } from '~/use/auth'
import { useRsvp } from '~/use/rsvp'

export default {
  setup() {
    const collection = 'videos'

    const fields = [
      {
        name: 'url',
        label: 'Url',
      },
      {
        name: 'tags',
        label: 'Tags',
        type: 'tags',
      },
    ]

    const { getCount, getRsvpResponse, updateRsvp } = useRsvp()

    const map = (item) => {
      const videoId = item.url.replace('https://www.youtube.com/watch?v=', '')
      const upVotes = getCount(item.id, 'up')
      const downVotes = getCount(item.id, 'down')
      const votes = upVotes - downVotes
      const response = getRsvpResponse(item.id)
      const multi = !response ? 3 : response === 'up' ? 2 : 1
      const order = multi * 100 + votes

      return {
        ...item,
        videoId,
        upVotes,
        downVotes,
        votes,
        response,
        order,
      }
    }

    const { uid } = useAuth()

    const filters = [
      {
        name: 'all',
        label: 'All',
        default: true,
      },
      {
        name: 'mine',
        label: 'Mine',
        filter: (item) => item.createdBy === uid.value,
      },
    ]

    return {
      collection,
      fields,
      getDateTime,
      filters,
      uid,
      map,
      updateRsvp,
    }
  },
}
</script>
