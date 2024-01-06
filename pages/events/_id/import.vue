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
        submit-label="Import"
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
      <div class="p-4">
        <div class="divider">or</div>
        <TButton
          type="secondary"
          label="Create new event"
          to="/events/-/edit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { pickBy } from 'lodash'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useI18n } from '~/use/i18n'
import { track } from '~/plugins/firebase'

export default {
  name: 'EventImport',
  layout: 'empty',
  middleware: ['auth'],
  data: () => ({
    duplicates: [],
  }),
  watch: {
    'item.facebook'(facebook) {
      this.duplicates = []

      if (!facebook) {
        return
      }

      if (facebook.includes('fb.me/') || facebook.includes('/share/')) {
        const url = `https://us-central1-wedance-4abe3.cloudfunctions.net/hooks/redirect?url=${facebook}`
        axios.get(url).then((response) => {
          this.item.facebook = response.data.url
        })
        return
      }

      if (!facebook.includes('/events/')) {
        return
      }

      const parts = facebook.replace(/\?.*/, '').split('/')
      const facebookId = parts.pop() || parts.pop()

      if (!facebookId) {
        return
      }

      const firestore = firebase.firestore()

      firestore
        .collection('posts')
        .where('facebookId', '==', facebookId)
        .get()
        .then((querySnapshot) => {
          const duplicates = []
          querySnapshot.forEach((doc) => {
            duplicates.push({ ...doc.data(), id: doc.id })
          })
          this.duplicates = duplicates
        })
    },
  },
  mounted() {
    if (this.$route.params.id === '-') {
      this.item = {
        type: 'import_event',
        place: this.profile?.place || '',
        username: this.profile?.username,
      }
    }
  },
  methods: {
    view(id) {
      if (id && id !== '-') {
        this.$router.push(this.localePath(`/events/${id}`))
      } else {
        this.$router.push(this.localePath(`/${this.profile?.username}`))
      }
    },
    async saveItem(data) {
      data = pickBy(data, (v) => v !== undefined)

      track('import_event')
      const result = await this.create(data)
      this.view(result.id)
    },
  },
  setup() {
    const { t } = useI18n()

    const eventFields = [
      {
        name: 'facebook',
        labelPosition: 'top',
        description: t('import.event.facebook.description'),
        label: t('import.event.facebook.label'),
        placeholder: 'https://www.facebook.com/events/...',
      },
    ]

    const { can, profile, isAdmin, uid } = useAuth()

    const collection = 'posts'

    const { doc: item, create } = useDoc(collection)

    return {
      item,
      can,
      collection,
      create,
      profile,
      isAdmin,
      uid,
      eventFields,
    }
  },
}
</script>
