<template>
  <div>
    <TButton :icon="icon" :type="type" :label="label" @click="share()" />
    <TPopup v-if="generating" title="Generating poster">
      <div class="p-4">
        Generating image... Please wait...
      </div>
    </TPopup>
    <TPopup v-if="sharing" title="Share" @close="sharing = false">
      <div class="w-64 space-y-2 py-4">
        <TButton type="nav" @click="copyToClipboard">
          Copy Link
        </TButton>
        <TButton type="nav" @click="download">
          Download Image
        </TButton>
        <TButton
          :href="`whatsapp://send?text=${text} ${url}`"
          data-action="share/whatsapp/share"
          type="nav"
        >
          Whatsapp
        </TButton>
        <TButton
          :href="`https://t.me/share/url?url=${url}&text=${text}`"
          target="_blank"
          rel="nofollow noreferrer"
          type="nav"
        >
          Telegram
        </TButton>
        <TButton
          :href="
            `https://www.facebook.com/share.php?display=page&u=${url}&t=${text}`
          "
          target="_blank"
          rel="nofollow noreferrer"
          type="nav"
        >
          Facebook
        </TButton>
        <TButton
          :href="`https://twitter.com/intent/tweet?text=${text} ${url}`"
          target="_blank"
          rel="nofollow noreferrer"
          type="nav"
        >
          Twitter
        </TButton>
      </div>
    </TPopup>
  </div>
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
    text: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    file: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'share'
    },
    type: {
      type: String,
      default: 'icon'
    }
  },
  data: () => ({
    sharing: false,
    generating: false,
    downloadUrl: ''
  }),
  methods: {
    download() {
      saveAs(this.downloadUrl, `${this.fileName}.png`)
    },
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.url)
      this.sharing = false
      this.$toast.success('Link copied to clipboard')
    },
    async generate() {
      if (this.generating) {
        return
      }

      this.generating = true
      this.$nuxt.$loading.start()

      try {
        const result = await axios.get(
          `https://us-central1-wedance-4abe3.cloudfunctions.net/hooks/share${this.$route.path}?timezone=Europe/Berlin`
        )

        if (!result.data.success) {
          this.$toast.error('Failed to generate a poster')
        }

        this.downloadUrl = result.data.url

        await this.$fire.firestore
          .collection(this.collection)
          .doc(this.id)
          .update({ socialCover: this.downloadUrl })
      } catch (e) {
        this.$toast.error(e.message)
      }

      this.generating = false
      this.$nuxt.$loading.finish()
    },
    async share() {
      this.downloadUrl = this.file

      if (!this.downloadUrl) {
        await this.generate()
      }

      const response = await fetch(this.downloadUrl)
      const blob = await response.blob()
      const file = new File([blob], `${this.fileName}.png`, {
        type: 'image/png'
      })

      const filesArray = [file]

      if (
        !navigator.share ||
        !navigator.canShare ||
        !navigator.canShare({ files: filesArray })
      ) {
        this.sharing = true

        return
      }

      navigator.share({
        title: this.text,
        url: this.url,
        files: filesArray
      })
    }
  }
}
</script>
