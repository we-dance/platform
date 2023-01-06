<template>
  <div class="bg-dark md:py-4 min-h-screen">
    <div
      class="mx-auto w-full max-w-lg md:rounded md:border md:shadow bg-white"
    >
      <TForm
        v-model="item"
        :edit-creator="isAdmin()"
        :fields="eventFields"
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
  name: 'EventEdit',
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
  mounted() {
    if (this.$route.params.id === '-') {
      this.item = {
        type: 'event',
        place: this.profile?.place || '',
        visibility: 'Public',
        form: 'No',
        online: 'No',
        international: 'No',
        claimed: 'No',
        eventType: 'Party',
        duration: 60,
        price: '0 EUR',
        styles: {},
        cover: '',
        artists: [],
        org: {},
        username: this.profile?.username,
        watch: {
          count: 1,
          list: {
            [this.profile?.username]: true,
          },
        },
        program: [],
      }
    }
  },
  methods: {
    view(id) {
      if (id && id !== '-') {
        this.$router.push(`/events/${id}`)
      } else {
        this.$router.push(`/${this.profile?.username}`)
      }
    },
    async copyItem(data) {
      if (!data.name) {
        return
      }

      track('copy_event')
      const doc = await this.create(data)

      this.$router.push(`/events/${doc.id}`)
    },
    async saveItem(data) {
      data = pickBy(data, (v) => v !== undefined)

      data.artists = (data.artists || []).filter((item) => item)

      data.artistsList = data.artists
        .map((a) => a.username)
        .filter((item) => item)

      if (data.id) {
        track('update_event')
        await this.update(data.id, data)
        this.view(data.id)
      } else {
        track('create_event')
        const result = await this.create(data)
        this.view(result.id)
      }
    },
    async removeItem(id) {
      track('delete_event')
      await this.remove(id)
      this.view()
    },
  },
  setup() {
    const { eventFields } = useEvents()
    const { can, profile, isAdmin, uid } = useAuth()
    const { params } = useRouter()

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
      eventFields,
    }
  },
}
</script>
