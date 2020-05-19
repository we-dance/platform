<template>
  <div class="md:flex">
    <nav class="p-4 md:w-64">
      <TButton v-if="!uid" class="mt-4 md:mt-0" to="/signin">Sign In</TButton>
      <router-link
        v-if="uid && account"
        class="flex hover:bg-gray-300 p-2"
        to="/account"
      >
        <img class="w-10 h-10 rounded-full" :src="account.photo" />
        <div class="ml-2">
          <div class="font-bold">{{ account.name }}</div>
          <div>@{{ account.username }}</div>
        </div>
      </router-link>

      <router-link
        to="/posts/hpHquGrQKthCaGBizAZB"
        class="block p-2 hover:bg-gray-300"
      >
        About
      </router-link>
      <h4 class="p-2 font-bold mt-4 border-b">Filter</h4>
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
    </nav>
    <main class="flex-grow max-w-lg">
      <div class="p-4">
        <div v-if="!filteredItems.length">
          No posts find
        </div>
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="card-item border"
        >
          <div class="p-4">
            <TTagsPreview :value="item.tags" />
            <router-link
              :to="`/posts/${item.id}`"
              class="font-bold text-2xl mt-2 leading-tight underline hover:no-underline"
            >
              {{ item.title }}
            </router-link>

            <TPreview
              class="mt-2"
              :content="item.description"
              :excerpt="true"
            />

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
            <div
              class="flex-grow mt-4 md:mt-0 flex justify-center md:justify-end"
            >
              <TSignature :item="item" />
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
import TSignature from '~/components/TSignature'
import TTagsPreview from '~/components/TTagsPreview'
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'
import useComments from '~/use/comments'
import useCollection from '~/use/collection'

export default {
  name: 'PostsIndex',
  components: {
    TButton,
    TPreview,
    TIcon,
    TSignature,
    Microlink,
    TTagsPreview
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

    return {
      items,
      getRsvpResponse,
      updateRsvp,
      account,
      uid,
      tags
    }
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) =>
        this.$route.query.tag
          ? item.tags && item.tags[this.$route.query.tag]
          : true
      )
    }
  }
}
</script>
