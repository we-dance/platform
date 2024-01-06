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
      <div v-if="duplicates.length">
        <div class="text-red-500 text-sm p-4">
          The following event already exists
        </div>
        <div v-for="item in duplicates" :key="item.id">
          <TEventText2 :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pickBy } from 'lodash'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { ref } from '@nuxtjs/composition-api'
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
    'item.place'() {
      this.updateHash()
    },
    'item.startDate'() {
      this.updateHash()
    },
    'item.facebook'(facebook) {
      const parts = facebook.replace(/\?.*/, '').split('/')
      this.item.facebookId = parts.pop() || parts.pop()
    },
    loading(loading) {
      if (!loading && this.item) {
        if (!this.can('edit', 'posts', this.item)) {
          this.$nuxt.error({ statusCode: 405 })
        }

        if (typeof this.item.startDate === 'string') {
          this.item.startDate = +new Date(this.item.startDate)
        }

        if (typeof this.item.endDate === 'string') {
          this.item.endDate = +new Date(this.item.endDate)
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
    updateHash() {
      if (!this.item.startDate || !this.item.place) {
        return
      }

      this.item.hash = this.item.startDate + '+' + this.item.place

      const firestore = firebase.firestore()

      firestore
        .collection('posts')
        .where('hash', '==', this.item.hash)
        .get()
        .then((querySnapshot) => {
          const duplicates = []
          querySnapshot.forEach((doc) => {
            duplicates.push({ ...doc.data(), id: doc.id })
          })
          this.duplicates = duplicates.filter(
            (item) => item.id !== this.item.id
          )
        })
    },
    view(id) {
      if (id && id !== '-') {
        this.$router.push(this.localePath(`/events/${id}`))
      } else {
        this.$router.push(this.localePath(`/${this.profile?.username}`))
      }
    },
    async copyItem(data) {
      if (!data.name) {
        return
      }

      track('copy_event')
      const doc = await this.create(data)

      this.$router.push(this.localePath(`/events/${doc.id}`))
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

    const duplicates = ref([])

    const { doc: item, load, update, remove, create, loading } = useDoc(
      collection
    )

    if (params.id !== '-') {
      load(params.id)
    }

    return {
      duplicates,
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
