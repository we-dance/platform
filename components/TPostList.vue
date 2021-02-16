<template>
  <div>
    <TLoader v-if="loading" />
    <div v-else-if="!count && showEmpty">
      {{ emptyLabel }}
    </div>
    <h2 v-if="title" class="font-bold text-lg">{{ title }}</h2>
    <div v-if="items.length" class="space-y-4 mt-4">
      <TPost v-for="item in items" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import useRSVP from '~/use/rsvp'
import useCollection from '~/use/collection'
import useComments from '~/use/comments'
import { sortBy } from '~/utils'

export default {
  name: 'TPostList',
  props: {
    filter: {
      type: Object,
      default: null
    },
    sorting: {
      type: String,
      default: '-createdAt'
    },
    title: {
      type: String,
      default: ''
    },
    emptyLabel: {
      type: String,
      default: 'No post found'
    },
    showEmpty: {
      type: Boolean,
      default: false
    }
  },
  setup(params) {
    const { getCount, getRsvpResponse, loading: loadingRsvps } = useRSVP()
    const { getCommentsCount, loading: loadingComments } = useComments()
    const { docs, loading: loadingPosts } = useCollection(
      'posts',
      params.filter
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
        upVotes,
        downVotes,
        votes,
        response,
        order,
        commentsCount
      }
    }

    const count = computed(() => items.value.length)
    const loading = computed(
      () => loadingRsvps.value || loadingPosts.value || loadingComments.value
    )
    // const isPublic = (item) => item.visibility !== 'Unlisted'

    const items = computed(() => {
      const result = docs.value.map(map)

      return result.sort(sortBy(params.sorting))
    })

    return {
      count,
      items,
      loading
    }
  }
}
</script>
