<template>
  <div class="md:flex">
    <nav class="p-4 md:w-64">
      <TButton v-if="!uid" to="/signin">Sign In</TButton>
      <TButton v-if="!account || !account.username" to="/account?tab=settings"
        >Create Profile</TButton
      >
      <router-link
        v-else
        class="flex hover:bg-gray-300 p-2"
        :to="`/u/${account.username}`"
      >
        <img class="w-10 h-10 rounded-full" :src="account.photo" />
        <div class="ml-2">
          <div class="font-bold">{{ account.name }}</div>
          <div>@{{ account.username }}</div>
        </div>
      </router-link>

      <div class="mt-4 text-sm">
        <router-link to="/trips" class="block p-2 hover:bg-gray-300">
          <span class="w-2">🚕</span> Trips
        </router-link>
        <router-link to="/endorsements" class="block p-2 hover:bg-gray-300">
          <span class="w-2">🌶</span> Endorsements
        </router-link>
        <router-link
          to="/posts/hpHquGrQKthCaGBizAZB"
          class="block p-2 hover:bg-gray-300"
        >
          <span class="w-2">🍓</span> About
        </router-link>
      </div>

      <details>
        <summary class="p-2 font-bold mt-4 border-b">
          Tags
        </summary>
        <div>
          <router-link
            to="/"
            class="block p-2 hover:bg-gray-300"
            :class="!$route.query.tag ? 'font-bold' : ''"
          >
            All
          </router-link>
          <router-link
            v-for="tag in tags"
            :key="tag.key"
            :to="`?tag=${tag.key}`"
            class="block p-2 hover:bg-gray-300"
            :class="$route.query.tag === tag.key ? 'font-bold' : ''"
            >#{{ tag.label }}
          </router-link>
        </div>
      </details>

      <div class="p-4 text-xs text-gray-700">
        Content on this site is licensed under a
        <a
          rel="license"
          class="underline"
          href="http://creativecommons.org/licenses/by/4.0/"
          >Creative Commons Attribution 4.0 International license</a
        >.
      </div>
    </nav>
    <main class="flex-grow max-w-lg">
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
        <div v-if="!filteredItems.length">
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
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { Microlink } from '@microlink/vue'
import TPreview from '~/components/TPreview'
import TButton from '~/components/TButton'
import TIcon from '~/components/TIcon'
import TTagsPreview from '~/components/TTagsPreview'
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'
import useComments from '~/use/comments'
import useCollection from '~/use/collection'
import useAccounts from '~/use/accounts'
import { dateDiff } from '~/utils'

export default {
  name: 'PostsIndex',
  components: {
    TButton,
    TPreview,
    TIcon,
    Microlink,
    TTagsPreview
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) =>
        this.$route.query.tag
          ? item.tags && item.tags[this.$route.query.tag]
          : true
      )
    }
  },
  setup() {
    const { uid, account } = useAuth()
    const { getCount, getRsvpResponse, updateRsvp } = useRSVP()
    const { getCommentsCount } = useComments()
    const { docs } = useCollection('posts')
    const { docs: tagDocs } = useCollection('tags')

    const tags = computed(() =>
      tagDocs.value.map((doc) => ({ key: doc.id, label: doc.id }))
    )

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

    const { getAccount } = useAccounts()

    return {
      items,
      getRsvpResponse,
      updateRsvp,
      account,
      uid,
      tags,
      dateDiff,
      getAccount
    }
  }
}
</script>
