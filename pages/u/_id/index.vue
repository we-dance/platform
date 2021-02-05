<template>
  <div class="mx-auto max-w-md bg-real-white px-4">
    <div class="flex justify-end mb-4">
      <TButton icon="share" @click="share()" />
    </div>
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
      <img
        :src="profile.socialCover"
        class="cursor-pointer"
        @click="download()"
      />
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
    download() {
      saveAs(this.profile.socialCover, `${this.profile.username}.png`)
    },
    async share() {
      if (!this.profile.socialCover) {
        await this.generate()
      }

      const response = await fetch(this.profile.socialCover)
      const blob = response.blob()
      const file = new File([blob], `${this.profile.username}.png`, {
        type: 'image/png'
      })

      const filesArray = [file]

      if (
        !navigator.share ||
        !navigator.canShare ||
        !navigator.canShare({ files: filesArray })
      ) {
        return
      }

      navigator.share({
        title: `WeDance: ${this.profile.username} is looking for a dance partner`,
        url: `https://wedance.vip/u/${this.profile.username}`,
        files: filesArray
      })
    },
    async generate() {
      if (this.generating) {
        return
      }

      this.generating = true
      this.$nuxt.$loading.start()

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
      this.$nuxt.$loading.finish()
    }
  }
}
</script>
