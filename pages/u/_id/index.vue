<template>
  <div class="mx-auto max-w-md bg-real-white p-4">
    <TPopup v-if="downloading" title="Saving image" no-close>
      Wait a moment
    </TPopup>
    <div class="flex justify-end mb-4">
      <TButton icon="share" @click="download(false)" />
    </div>

    <TProfileOrganiser v-if="profile.type === 'Organiser'" :profile="profile" />
    <TProfileDancer v-else :profile="profile" />
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import axios from 'axios'
import useAuth from '~/use/auth'

export default {
  layout: 'public',
  async asyncData({ app, params, error }) {
    const collection = await app.$fire.firestore
      .collection('profiles')
      .where('username', '==', params.id)
      .get()

    if (!collection.docs.length) {
      error({ statusCode: 404 })
    }

    const doc = collection.docs[0]

    const profile = doc.data()
    profile.id = doc.id

    return {
      profile
    }
  },
  data: () => ({
    downloading: false,
    profile: {}
  }),
  setup() {
    const { uid } = useAuth()

    return {
      uid
    }
  },
  mounted() {
    if (this.uid) {
      this.$nuxt.setLayout('default')
    }
  },
  methods: {
    async download(force = false) {
      if (!force && this.profile.socialCover) {
        saveAs(this.profile.socialCover, `${this.profile.username}.png`)
        return
      }

      this.downloading = true

      try {
        if (force) {
          await this.$fire.firestore
            .collection('profiles')
            .doc(this.profile.id)
            .update({ socialCover: '' })
        }

        const result = await axios.get(
          `https://us-central1-wedance-4abe3.cloudfunctions.net/hooks/share/${this.profile.id}/${this.profile.username}`
        )

        if (!result.data.success) {
          throw new Error(result.data.error)
        }

        saveAs(result.data.socialCover, `${this.profile.username}.png`)
      } catch (e) {
        console.error(e)
      }

      this.downloading = false
    }
  }
}
</script>
