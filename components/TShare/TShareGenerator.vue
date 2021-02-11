<template>
  <div v-if="$route.query.admin">
    <div
      v-if="!socialCover"
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
      <img :src="socialCover" class="cursor-pointer" @click="download()" />
      <TButton type="link" class="mt-4" @click="cleanup()">Delete Post</TButton>
    </div>
  </div>
  <div v-else></div>
</template>

<script>
import { saveAs } from 'file-saver'
import axios from 'axios'

export default {
  props: {
    collection: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    socialCover: '',
    generating: false
  }),
  mounted() {
    this.socialCover = this.value
  },
  methods: {
    async cleanup() {
      await this.$fire.firestore
        .collection(this.collection)
        .doc(this.id)
        .update({ socialCover: '' })

      this.socialCover = ''
    },
    download() {
      saveAs(this.socialCover, `${this.title}.png`)
    },
    async generate() {
      if (this.generating) {
        return
      }

      this.generating = true
      this.$nuxt.$loading.start()

      try {
        const result = await axios.get(
          `https://us-central1-wedance-4abe3.cloudfunctions.net/hooks/share${this.$route.path}`
        )

        if (!result.data.success) {
          throw new Error('Failed to make a screenshot')
        }

        this.socialCover = result.data.url

        await this.$fire.firestore
          .collection(this.collection)
          .doc(this.id)
          .update({ socialCover: result.data.url })
      } catch (e) {
        console.error(e)
      }

      this.generating = false
      this.$nuxt.$loading.finish()
    }
  }
}
</script>
