<template>
  <div class="mx-auto max-w-md bg-real-white px-4">
    <TProfileOrganiser v-if="profile.type === 'Organiser'" :profile="profile" />
    <TProfileDancer v-else :profile="profile" />

    <div
      v-if="!profile.socialCover"
      class="flex justify-center items-center border h-64 p-4 mt-4"
    >
      <div v-if="!generating">
        <TButton @click="generate()">Generate Social Media Post</TButton>
      </div>
      <div v-else class="text-xs text-gray-700">
        Generating image...
      </div>
    </div>
    <div v-else class="pb-4">
      <img :src="profile.socialCover" class="cursor-pointer" @click="share()" />
      <TButton type="link" @click="cleanup()" class="mt-4">Delete Post</TButton>
    </div>
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
    generating: false,
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
    async cleanup() {
      await this.$fire.firestore
        .collection('profiles')
        .doc(this.profile.id)
        .update({ socialCover: '' })

      this.profile.socialCover = ''
    },
    share() {
      if (!this.profile.socialCover) {
        return
      }

      if (navigator.share) {
        navigator.share({
          title: `${this.profile.username} is looking for dance partner at WeDance`,
          url: this.profile.socialCover
        })
      } else {
        saveAs(this.profile.socialCover, `${this.profile.username}.png`)
      }
    },
    async generate() {
      this.generating = true

      try {
        const result = await axios.get(
          `https://us-central1-wedance-4abe3.cloudfunctions.net/hooks/share/${this.profile.id}/${this.profile.username}`
        )

        if (!result.data.success) {
          throw new Error(result.data.error)
        }

        this.profile.socialCover = result.data.socialCover
      } catch (e) {
        console.error(e)
      }

      this.generating = false
    }
  }
}
</script>
