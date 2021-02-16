<template>
  <main>
    <TTitle>
      {{ $t('posts.title') }}
      <template slot="right">
        <TButton to="/posts/-/edit" type="primary">{{
          $t('posts.add')
        }}</TButton>
      </template>
    </TTitle>

    <div class="overflow-x-scroll my-4">
      <div class="flex flex-no-wrap space-x-2">
        <TInputCity v-model="currentCity" />
        <TInputSelect v-model="sorting" :options="sortingList" />
        <TInputSelect v-model="view" :options="viewOptions" />
        <TInputSelect
          v-model="dances"
          :options="dancesList"
          :label="$t('style.label')"
        />
      </div>
    </div>

    <div>
      <div v-if="!uid" class="md:flex space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <WTeaser
          :title="$t('teaser.partner.title')"
          :description="$t('teaser.partner.description')"
          :button="$t('teaser.partner.btn')"
          url="/community"
          class="flex-1"
        />
        <WTeaser
          :title="$t('teaser.events.title')"
          :description="$t('teaser.events.description')"
          :button="$t('teaser.events.btn')"
          url="/events"
          class="flex-1"
        />
      </div>
      <div v-if="uid" class="mb-4">
        <WTeaser
          v-if="city && city.telegram"
          :title="$t('teaser.chat.title')"
          :description="$t('teaser.chat.description')"
          :button="$t('teaser.chat.btn', { city: city.name })"
          :href="city.telegram"
        />
        <WTeaser
          v-else-if="currentCity"
          :title="$t('teaser.chat.title')"
          :description="$t('teaser.chat.description')"
          :button="$t('teaser.chat.btn', { city: currentCity })"
          href="https://t.me/joinchat/Iqif2X0FCXCpqHDj"
        />
      </div>

      <TLoader v-if="loading" />
      <div v-else-if="!filteredItems.length">No posts found</div>

      <div
        v-if="view === 'covers'"
        class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        <router-link
          v-for="post in filteredItems"
          :key="post.id"
          :to="`/posts/${post.id}`"
          class="hover:opacity-75"
        >
          <TSharePreviewPost
            :username="post.author"
            :title="post.title"
            :photo="post.cover"
            :styles="post.styles"
            align="center"
            size="sm"
            :likes="post.upVotes"
          />
        </router-link>
      </div>

      <div v-else>
        <TPost v-for="item in filteredItems" :key="item.id" :item="item" />
      </div>
    </div>
  </main>
</template>

<script>
import { ref, computed, watch } from '@nuxtjs/composition-api'
import useRSVP from '~/use/rsvp'
import useComments from '~/use/comments'
import useCollection from '~/use/collection'
import useAccounts from '~/use/accounts'
import useCities from '~/use/cities'
import useAuth from '~/use/auth'
import useProfiles from '~/use/profiles'
import { sortBy } from '~/utils'

export default {
  name: 'PostsIndex',
  setup() {
    const { getCount, getRsvpResponse, loading: loadingLikes } = useRSVP()
    const { getCommentsCount, loading: loadingComments } = useComments()
    const { currentCity, city } = useCities()
    const { docs, loading: loadingPosts, getById } = useCollection('posts')
    const { getProfile } = useProfiles()

    const { uid, profile: myProfile } = useAuth()
    const dances = ref('')
    const dancesList = computed(() => {
      const list = myProfile.value?.styles
        ? Object.keys(myProfile.value.styles)
        : []

      return [
        {
          label: 'Style',
          value: ''
        },
        ...list
      ]
    })

    const sorting = ref(uid.value ? '-createdAt' : '-upVotes')

    watch(uid, (uid) => {
      sorting.value = uid ? '-createdAt' : '-upVotes'
    })

    const view = ref('covers')
    const viewOptions = [
      {
        value: 'covers',
        label: 'Grid View'
      },
      {
        value: 'text',
        label: 'List View'
      }
    ]

    const sortingList = [
      {
        value: '-upVotes',
        label: 'Popular'
      },
      {
        value: '-createdAt',
        label: 'Newest'
      }
    ]

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
      const profile = getProfile(item.createdBy)
      const author = profile.username
      const cover = item.cover

      return {
        ...item,
        commentsCount,
        upVotes,
        downVotes,
        votes,
        response,
        order,
        author,
        cover
      }
    }

    const items = computed(() => {
      let result = docs.value.map(map)

      if (dances.value) {
        result = result.filter(
          (item) =>
            item.styles &&
            item.styles[dances.value] &&
            item.styles[dances.value].selected
        )
      }

      return result
    })
    const loading = computed(
      () => loadingLikes.value || loadingComments.value || loadingPosts.value
    )

    const { getAccount } = useAccounts()

    return {
      city,
      items,
      getRsvpResponse,
      getAccount,
      loading,
      getById,
      uid,
      currentCity,
      dances,
      dancesList,
      sorting,
      sortingList,
      view,
      viewOptions
    }
  },
  data: () => ({
    showAuthPopup: false
  }),
  computed: {
    filteredItems() {
      const result = this.items
        .filter((item) =>
          this.currentCity
            ? !item.community || item.community === this.currentCity
            : true
        )
        .filter((item) =>
          this.$route.query.tag
            ? item.tags && item.tags[this.$route.query.tag]
            : true
        )

      return result.sort(sortBy(this.sorting))
    }
  }
}
</script>
