<template>
  <div>
    <div class="flex">
      <TButton
        v-if="!value"
        type="secondary"
        class="mr-2"
        @click="showPopup = true"
        >Select account</TButton
      >
      <div v-else class="flex">
        <TAvatar :uid.sync="value" name />
        <button class="px-2 hover:text-primary" @click="showPopup = true">
          <TIcon name="edit" />
        </button>
      </div>
    </div>
    <TPopup v-if="showPopup" title="Select account" @close="save">
      <TGridAccounts v-model="selected" vertical-scroll class="max-h-screen" />
    </TPopup>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import TAvatar from '~/components/TAvatar'

export default {
  name: 'TAccountSelector',
  components: {
    TAvatar,
  },
  props: {
    value: {
      type: [Object, String],
      default: () => ({}),
    },
  },
  data: () => ({
    showPopup: false,
    showImport: false,
    csv: '',
  }),
  setup() {
    const selected = ref({})

    return {
      selected,
    }
  },
  watch: {
    value: 'load',
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.selected = {}

      if (!this.value) {
        return
      }

      this.selected[this.value] = true
    },
    save() {
      this.showPopup = false
      const uid = Object.keys(this.selected)[0]
      this.$emit('input', uid)
    },
  },
}
</script>
