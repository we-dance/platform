<template>
  <div>
    <TButton allow-guests :label="label" type="nav" @click="showPopup = true">
      <QrcodeIcon class="w-6 h-6" />
    </TButton>
    <TPopup v-if="showPopup" title="Scan QR code" @close="showPopup = false">
      <div class="p-4">
        <qrcode-vue :value="value" :size="300" level="H" />
      </div>
    </TPopup>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import QrcodeVue from 'qrcode.vue'
import { QrcodeIcon } from '@vue-hero-icons/outline'

export default {
  components: {
    QrcodeIcon,
    QrcodeVue,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  computed: {
    value() {
      return window.location.href
    },
  },
  setup() {
    const showPopup = ref(false)

    return {
      showPopup,
    }
  },
}
</script>
