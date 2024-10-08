<template>
  <TButton
    v-if="!sharing"
    allow-guests
    :icon="icon"
    :type="type"
    :label="label"
    @click="share()"
  />
  <TPopup v-else title="Share" @close="sharing = false">
    <div class="w-64 space-y-2 py-4">
      <TButton allow-guests type="nav" @click="copyToClipboard">
        Copy Link
      </TButton>
      <TButton
        v-if="downloadUrl"
        allow-guests
        type="nav"
        download
        :to="downloadUrl"
        @click="download"
      >
        Download Poster
      </TButton>
      <TButton
        v-for="(_, platform) in platforms"
        :key="platform"
        allow-guests
        type="nav"
        @click="shareTo(platform)"
      >
        {{ platform }}
      </TButton>
      <TButton
        v-if="nativeShareSupported"
        allow-guests
        type="nav"
        @click="nativeShare()"
      >
        More
      </TButton>
      <TButton
        :disabled="generating"
        allow-guests
        type="nav"
        @click="refresh()"
      >
        {{ generating ? 'Generating...' : 'Create New Poster' }}
      </TButton>
    </div>
  </TPopup>
</template>

<script>
import axios from 'axios'
import { openURL } from '~/utils'
import { useCities } from '~/use/cities'
import { useAuth } from '~/use/auth'
import { db } from '~/plugins/firebase'

export default {
  setup() {
    const { currentCity } = useCities()
    const { uid, account } = useAuth()

    return {
      currentCity,
      uid,
      account,
    }
  },
  props: {
    collection: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    place: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    file: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'share',
    },
    type: {
      type: String,
      default: 'icon',
    },
    doc: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    sharing: false,
    generating: false,
    downloadUrl: '',
    nativeShareSupported: false,
  }),
  computed: {
    platforms() {
      const text = this.text

      const result = {
        Telegram: `https://t.me/share/url?url=${this.getReferralLink(
          'telegram',
          true
        )}&text=${text}`,
        Whatsapp: `whatsapp://send?text=${text} ${this.getReferralLink(
          'whatsapp',
          true
        )}`,
        Facebook: `https://www.facebook.com/share.php?display=page&u=${this.getReferralLink(
          'facebook',
          true
        )}&t=${text}`,
        Twitter: `https://twitter.com/intent/tweet?text=${text} ${this.getReferralLink(
          'twitter',
          true
        )}`,
      }

      if (this.doc?.instagram?.messageUrl) {
        result.Instagram = this.doc?.instagram?.messageUrl
      }

      if (this.doc?.telegram?.messageUrl) {
        result.Telegram = this.doc?.telegram?.messageUrl
      }

      return result
    },
  },
  mounted() {
    this.downloadUrl = this.file
  },
  methods: {
    getReferralLink(utm, encode = false) {
      const link = `${this.url}?r=${this.uid}&utm_source=${utm}&utm_medium=share`

      if (encode) {
        return encodeURIComponent(link)
      }

      return link
    },
    shareTo(platform) {
      if (!this.platforms[platform]) {
        return
      }

      this.$track('share', {
        method: platform,
        content_type: this.collection,
        content_id: this.id,
      })

      openURL(this.platforms[platform])
    },
    async refresh() {
      await this.generate()
      await this.share()
    },
    download() {
      this.$track('share', {
        method: 'Download',
        content_type: this.collection,
        content_id: this.id,
      })
    },
    async copyToClipboard() {
      this.$track('share', {
        method: 'Link',
        content_type: this.collection,
        content_id: this.id,
      })

      await navigator.clipboard.writeText(this.getReferralLink('link'))
      this.sharing = false
      this.$toast.success('Link copied to clipboard')
    },
    async generate() {
      if (this.generating) {
        return
      }

      this.$track('create_poster', {
        collection: this.collection,
      })

      this.generating = true
      this.$nuxt.$loading.start()

      try {
        const result = await axios.get(
          `https://us-central1-wedance-4abe3.cloudfunctions.net/hooks/share${this.$route.path}?timezone=${this.account?.zone}`
        )

        if (!result.data.success) {
          this.$toast.error('Failed to generate a poster')
        }

        this.downloadUrl = result.data.url

        const collection = this.collection === 'profiles' ? 'profiles' : 'posts'

        await db
          .collection(collection)
          .doc(this.id)
          .update({ socialCover: this.downloadUrl })
      } catch (e) {
        this.$toast.error(e.message)
      }

      this.generating = false
      this.$nuxt.$loading.finish()
    },
    share() {
      this.$track('popup_share')
      this.sharing = true

      if (navigator.share && navigator.canShare) {
        this.nativeShareSupported = true
      } else {
        this.nativeShareSupported = false
      }
    },
    async nativeShare() {
      const response = await fetch(this.downloadUrl)
      const blob = await response.blob()
      const file = new File([blob], `${this.fileName}.png`, {
        type: 'image/png',
      })

      const filesArray = [file]

      if (!navigator.canShare({ files: filesArray })) {
        this.nativeShareSupported = false
        return false
      }

      this.$track('share', {
        method: 'Native',
        content_type: this.collection,
        content_id: this.id,
      })

      try {
        await navigator.share({
          title: this.text,
          url: this.url,
          files: filesArray,
        })
      } catch (e) {}
    },
  },
}
</script>
