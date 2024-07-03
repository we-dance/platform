<template>
  <div>
    <TButton
      allow-guests
      :label="label"
      type="nav"
      @click="
        showPopup = true
        $track('share_qr')
      "
    >
      <QrcodeIcon class="w-6 h-6" />
    </TButton>
    <TPopup v-if="showPopup" title="Scan QR code" @close="showPopup = false">
      <div class="pb-4 pt-4 space-y-4">
        <div class="flex justify-center">
          <qrcode-vue :value="getReferralLink('qr')" :size="300" level="H" />
        </div>

        <div class="flex gap-2">
          <TInput :value="url" />
          <TButton allow-guests class="flex-grow" @click="copyToClipboard">
            Copy
          </TButton>
        </div>

        <div class="flex gap-1">
          <TButton
            v-if="nativeShareSupported"
            allow-guests
            type="primary"
            @click="nativeShare()"
          >
            Share
          </TButton>
          <TButton
            v-for="platform in platforms"
            :key="platform.name"
            allow-guests
            :icon="platform.icon"
            icon-size="6"
            type="void"
            class="cursor-pointer"
            @click="shareTo(platform.name)"
          />
        </div>
      </div>
    </TPopup>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import QrcodeVue from 'qrcode.vue'
import { QrcodeIcon } from '@vue-hero-icons/outline'
import { useAuth } from '~/use/auth'

export default {
  components: {
    QrcodeIcon,
    QrcodeVue,
  },
  data: () => ({
    nativeShareSupported: false,
  }),
  props: {
    label: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
  },
  computed: {
    url() {
      if (process.server) return ''

      return window.location.href
    },
    platforms() {
      const text = this.text
      const results = []
      results.push({
        name: 'Telegram',
        url:
          this.doc?.telegram?.messageUrl ||
          `https://t.me/share/url?url=${this.getReferralLink(
            'telegram',
            true
          )}&text=${text}`,
        icon: 'telegram',
      })
      results.push({
        name: 'Whatsapp',
        url: `whatsapp://send?text=${text} ${this.getReferralLink(
          'whatsapp',
          true
        )}`,
        icon: 'whatsapp',
      })
      results.push({
        name: 'Facebook',
        url: `https://www.facebook.com/share.php?display=page&u=${this.getReferralLink(
          'facebook',
          true
        )}&t=${text}`,
        icon: 'facebook',
      })
      results.push({
        name: 'Twitter',
        url: `https://twitter.com/intent/tweet?text=${text} ${this.getReferralLink(
          'twitter',
          true
        )}`,
        icon: 'twitter',
      })

      return results
    },
  },
  mounted() {
    if (navigator.share && navigator.canShare) {
      this.nativeShareSupported = true
    }
  },
  setup() {
    const showPopup = ref(false)
    const { uid } = useAuth()

    return {
      uid,
      showPopup,
    }
  },
  methods: {
    getReferralLink(source, encode = false) {
      const link = `${this.url}?utm_source=${source}&utm_medium=share&r=${this.uid}`

      if (encode) {
        return encodeURIComponent(link)
      }

      return link
    },
    async copyToClipboard() {
      this.$track('share', {
        method: 'Link',
      })

      await navigator.clipboard.writeText(this.getReferralLink('link'))
      this.$toast.success('Link copied to clipboard')
    },
    shareTo(platform) {
      if (!this.platforms[platform]) {
        return
      }

      this.$track('share', {
        method: platform,
      })

      openURL(this.platforms[platform])
    },
    async nativeShare() {
      this.$track('share', {
        method: 'Native',
      })

      try {
        await navigator.share({
          title: this.text,
          url: this.url,
        })
      } catch (e) {}
    },
  },
}
</script>
