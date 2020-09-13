<template>
  <main>
    <TTitle>
      Events
    </TTitle>

    <div>
      <TLoader v-if="loading" />
      <div v-else-if="!filteredItems.length">
        No events found
      </div>
      <div>
        <h2 class="font-bold">Monday, 14 September</h2>
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="bg-white px-4 mt-4 flex"
        >
          <div class="mr-2">
            {{ getTime(item.startDate) }}
          </div>
          <div class="mr-2">
            🎉
          </div>
          <div>
            <router-link
              :to="`/events/${item.id}`"
              class="font-bold leading-tight underline hover:no-underline"
            >
              {{ item.name }}
            </router-link>
            <TTagsPreview :value="item.tags" />
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
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import { dateDiff, sortBy, getTime } from '~/utils'

export default {
  name: 'EventsIndex',
  setup() {
    const {
      getCount,
      getRsvpResponse,
      updateRsvp,
      loading: loadingLikes
    } = useRSVP()
    const { getCommentsCount, loading: loadingComments } = useComments()
    const { docs, loading: loadingPosts, getById } = useCollection('events')
    const { uid } = useAuth()

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

    const { doc: city, find: findCity } = useDoc('cities')

    findCity('name', ls('city'))

    return {
      city,
      items,
      getRsvpResponse,
      updateRsvp,
      dateDiff,
      getAccount,
      loading,
      getById,
      uid,
      getTime
    }
  },
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
  }
}
</script>
