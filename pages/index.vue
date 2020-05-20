<template>
  <main class="flex-grow max-w-lg">
    <TPresentation v-if="showIntro" name="intro" @close="showIntro = false" />
    <div class="p-4">
      <div v-if="false" class="rounded bg-orange-200 p-4 mb-4">
        <div class="uppercase font-bold">New Challenge</div>
        <div>
          Share your favourite music of your favourite dance
          <span class="text-blue-500">#FavouriteMusic</span>
        </div>
        <div class="flex justify-end mt-4">
          <TButton to="/posts/-/edit?tag=FavouriteMusic"
            >Accept Challenge</TButton
          >
        </div>
      </div>
      <TLoader v-if="loading" />
      <div v-else-if="!filteredItems.length">
        No posts found
      </div>
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="rounded bg-white mb-4 shadow border"
      >
        <div class="p-4">
          <div>
            <div class="flex justify-between">
              <router-link
                :to="`/posts/${item.id}`"
                class="font-bold leading-tight"
              >
                {{ item.title }}
              </router-link>
              <router-link
                :to="`/posts/${item.id}`"
                class="text-xs text-gray-600 hover:underline text-right"
              >
                {{ dateDiff(item.createdAt) }} ago
              </router-link>
            </div>

            <div class="text-xs my-1 flex items-center">
              <img
                class="rounded-full mr-1 w-4 h-4"
                :src="getAccount(item.createdBy).photo"
              />
              <router-link
                class="hover:underline"
                :to="`/u/${getAccount(item.createdBy).username}`"
                >{{ getAccount(item.createdBy).name }}</router-link
              >
            </div>

            <TPreview
              v-if="!item.link"
              class="mt-2"
              :content="item.description"
              :excerpt="true"
            />

            <Microlink v-if="item.link" class="mt-2" :url="item.link" />
          </div>
        </div>
        <div class="px-4 pb-4 flex items-center justify-between">
          <TTagsPreview :value="item.tags" />

          <div class="flex">
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
            <div class="text-red-500 flex ml-2 justify-center">
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
            <div class="text-gray-700 flex ml-4 justify-center">
              <router-link :to="`/posts/${item.id}`" class="flex">
                <TIcon name="chat" class="h-6 w-6 hover:text-primary" />
                <span>{{ item.commentsCount }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { computed } from '@vue/composition-api'
import ls from 'local-storage'
import { Microlink } from '@microlink/vue'
import TPreview from '~/components/TPreview'
import TButton from '~/components/TButton'
import TPresentation from '~/components/TPresentation'
import TIcon from '~/components/TIcon'
import TLoader from '~/components/TLoader'
import TTagsPreview from '~/components/TTagsPreview'
import useRSVP from '~/use/rsvp'
import useComments from '~/use/comments'
import useCollection from '~/use/collection'
import useAccounts from '~/use/accounts'
import { dateDiff, sortBy } from '~/utils'

export default {
  name: 'PostsIndex',
  components: {
    TButton,
    TPreview,
    TLoader,
    TIcon,
    Microlink,
    TTagsPreview,
    TPresentation
  },
  data: () => ({
    showIntro: false
  }),
  computed: {
    filteredItems() {
      return this.items
        .filter((item) =>
          this.$route.query.tag
            ? item.tags && item.tags[this.$route.query.tag]
            : true
        )
        .sort(sortBy('-createdAt'))
    }
  },
  watch: {
    $route() {
      this.showIntro = !!this.$route.query.tour
    }
  },
  mounted() {
    this.showIntro = !!this.$route.query.tour || !ls('sawIntro')
  },
  setup() {
    const {
      getCount,
      getRsvpResponse,
      updateRsvp,
      loading: loadingLikes
    } = useRSVP()
    const { getCommentsCount, loading: loadingComments } = useComments()
    const { docs, loading: loadingPosts } = useCollection('posts')

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
    const loading = computed(
      () => loadingLikes.value && loadingComments.value && loadingPosts.value
    )

    const { getAccount } = useAccounts()

    return {
      items,
      getRsvpResponse,
      updateRsvp,
      dateDiff,
      getAccount,
      loading
    }
  }
}
</script>
