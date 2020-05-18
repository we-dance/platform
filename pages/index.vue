<template>
  <div class="p-4">
    <div v-for="item in items" :key="item.id" class="card-item border">
      <div class="p-4">
        <router-link
          :to="`/posts/${item.id}`"
          class="font-bold text-2xl mt-2 leading-tight underline hover:no-underline"
        >
          {{ item.title }}
        </router-link>

        <TPreview class="mt-2" :content="item.description" :excerpt="true" />

        <Microlink v-if="item.link" class="mt-2" :url="item.link" />
      </div>
      <div
        class="bg-gray-200 border-t px-4 py-4 flex items-center justify-between"
      >
        <div class="md:flex">
          <div class="text-green-500 flex justify-center">
            <button
              class="text-center hover:text-green-500"
              :class="{ 'text-green-700': item.response === 'up' }"
              @click="updateRsvp(item.id, 'posts', 'up')"
            >
              <TIcon name="up" class="h-6 w-6" />
            </button>
            <div>
              {{ item.upVotes }}
            </div>
          </div>
          <div class="text-red-500 flex md:ml-2 justify-center">
            <button
              class="text-center hover:text-primary"
              :class="{ 'text-red-700': item.response === 'down' }"
              @click="updateRsvp(item.id, 'posts', 'down')"
            >
              <TIcon name="down" class="h-6 w-6 hover:text-primary" />
            </button>
            <div>
              {{ item.downVotes }}
            </div>
          </div>
          <div class="text-gray-700 flex md:ml-4 justify-center">
            <router-link :to="`/posts/${item.id}`" class="flex">
              <TIcon name="chat" class="h-6 w-6 hover:text-primary" />
              <span>{{ item.commentsCount }}</span>
            </router-link>
          </div>
        </div>
        <div class="flex-grow mt-4 md:mt-0 flex justify-center md:justify-end">
          <TSignature :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { Microlink } from '@microlink/vue'
import TPreview from '~/components/TPreview'
import TIcon from '~/components/TIcon'
import TSignature from '~/components/TSignature'
import useRSVP from '~/use/rsvp'
import useComments from '~/use/comments'
import useCollection from '~/use/collection'

export default {
  name: 'PostsIndex',
  components: {
    TPreview,
    TIcon,
    TSignature,
    Microlink
  },
  setup() {
    const { getCount, getRsvpResponse, updateRsvp } = useRSVP()
    const { getCommentsCount } = useComments()
    const { docs } = useCollection('posts')

    const map = (item) => {
      if (!item.id) {
        return {}
      }

      const upVotes = getCount(item.id, 'up')
      const downVotes = getCount(item.id, 'down')
      const votes = upVotes - downVotes
      const response = getRsvpResponse(item.id)
      const multi = !response ? 3 : response === 'up' ? 2 : 1
      const order = multi * 100 + votes
      const commentsCount = getCommentsCount(item.id)

      return {
        ...item,
        commentsCount,
        upVotes,
        downVotes,
        votes,
        response,
        order
      }
    }

    const items = computed(() => docs.value.map(map))

    return {
      items,
      getRsvpResponse,
      updateRsvp
    }
  }
}
</script>
