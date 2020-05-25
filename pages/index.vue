<template>
  <main>
    <div class="md:flex items-baseline justify-between mb-4">
      <h1 class="text-xl font-bold">Newest</h1>
    </div>

    <TPresentation v-if="showIntro" name="intro" @close="showIntro = false" />

    <div>
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
      <TPopup v-if="reportId">
        <div class="font-bold mb-4">Report a post</div>
        <TSelect
          v-model="reportCategory"
          label="Category"
          type="select"
          :options="['other', 'spam']"
        />
        <TField v-model="reportReason" class="mt-2" label="Reason" />
        <div class="mt-4 flex justify-end">
          <TButton class="mr-2" @click="cancelReport">Cancel</TButton>
          <TButton type="danger" @click="report">Report</TButton>
        </div>
      </TPopup>
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="mb-4 flex items-center"
      >
        <img
          class="rounded-full w-6 h-6"
          :src="getAccount(item.createdBy).photo"
        />
        <div
          class="px-2 text-gray-500 flex justify-center text-center leading-none"
        >
          <div>
            <button
              class="text-center text-xs block hover:text-green-500"
              :class="{ 'text-green-700': item.response === 'up' }"
              @click="updateRsvp(item.id, 'posts', 'up')"
            >
              <TIcon name="arrow_drop_up" class="h-6 w-6 -mb-1" />
              <div>{{ item.upVotes }}</div>
            </button>
          </div>
        </div>
        <div>
          <div>
            <router-link :to="`/posts/${item.id}`" class="leading-none text-sm">
              {{ item.title }}
            </router-link>
          </div>
          <div class="text-xs flex text-gray-700">
            <div>{{ getAccount(item.createdBy).username }}</div>
            <div class="mx-1">•</div>
            <div>
              <router-link :to="`/posts/${item.id}`" class="hover:bg-gray-200">
                {{ item.commentsCount }} comments
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
import useRSVP from '~/use/rsvp'
import useComments from '~/use/comments'
import useCollection from '~/use/collection'
import useAccounts from '~/use/accounts'
import useDoc from '~/use/doc'
import { dateDiff, sortBy } from '~/utils'

export default {
  name: 'PostsIndex',
  data: () => ({
    showIntro: false,
    reportId: 0,
    reportReason: '',
    reportCategory: 'other'
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
  methods: {
    cancelReport() {
      this.reportId = 0
      this.reportReason = ''
      this.reportCategory = 'other'
    },
    report(item) {
      this.createReport({
        state: 'open',
        documentId: this.reportId,
        category: this.reportCategory,
        collection: 'posts',
        reason: this.reportReason,
        documentData: this.getById(this.reportId)
      })
      this.cancelReport()
    }
  },
  setup() {
    const {
      getCount,
      getRsvpResponse,
      updateRsvp,
      loading: loadingLikes
    } = useRSVP()
    const { getCommentsCount, loading: loadingComments } = useComments()
    const { docs, loading: loadingPosts, getById } = useCollection('posts')
    const { create: createReport } = useDoc('reports')

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
      loading,
      createReport,
      getById
    }
  }
}
</script>
