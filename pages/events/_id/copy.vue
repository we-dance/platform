<template>
  <div class="bg-dark md:py-4 min-h-screen">
    <div
      class="mx-auto w-full max-w-lg md:rounded md:border md:shadow bg-white"
    >
      <TForm
        v-model="item"
        :fields="fields"
        show-cancel
        vertical
        class="bg-white p-4 space-y-4"
        @save="saveItem"
        @cancel="view(item.id)"
      />
    </div>
  </div>
</template>

<script>
import { pickBy } from 'lodash'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useRouter } from '~/use/router'
import { useEvents } from '~/use/events'
import { track } from '~/plugins/firebase'

export default {
  name: 'CopyEdit',
  layout: 'empty',
  middleware: ['auth'],
  watch: {
    loading(loading) {
      if (!loading && this.item) {
        if (!this.can('edit', 'posts', this.item)) {
          this.$nuxt.error({ statusCode: 405 })
        }
      }
    },
  },
  methods: {
    view(id) {
      if (id && id !== '-') {
        this.$router.push(`/events/${id}`)
      } else {
        this.$router.push(`/events`)
      }
    },
    async saveItem(data) {
      data = pickBy(data, (v) => v !== undefined)

      data.artistsList = data.artists
        .map((a) => a.username)
        .filter((item) => item)

      data.socialCover = ''
      data.commentsCount = 0
      data.downVotes = 0
      data.upVotes = 0
      data.viewsCount = 0
      data.votes = 0
      data.watch = {
        count: 0,
        list: {},
      }
      data.star = {
        count: 0,
        list: {},
      }
      data.createdAt = +new Date()
      data.updatedAt = +new Date()
      data.createdBy = this.uid
      data.updatedBy = this.uid
      data.telegram = {}
      data.instagram = {}

      track('copy_event')
      const result = await this.create(data)
      this.view(result.id)
    },
  },
  setup() {
    const { eventFields } = useEvents()
    const { can, profile, isAdmin, uid } = useAuth()
    const { params } = useRouter()

    const fields = eventFields.filter((f) =>
      ['startDate', 'endDate'].includes(f.name)
    )

    const collection = 'posts'

    const { doc: item, load, update, remove, create, loading } = useDoc(
      collection
    )

    if (params.id !== '-') {
      load(params.id)
    }

    return {
      loading,
      item,
      can,
      collection,
      update,
      remove,
      create,
      profile,
      isAdmin,
      uid,
      fields,
    }
  },
}
</script>
