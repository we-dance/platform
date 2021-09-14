<template>
  <div>
    <div class="flex">
      <TButton type="secondary" class="mr-2" @click="showPopup = true"
        >Select accounts ({{ count }})</TButton
      >
    </div>
    <TPopup
      v-if="showPopup"
      :title="`Select accounts (${count})`"
      @close="save"
    >
      <TGridAccounts
        v-model="selected"
        multi
        vertical-scroll
        class="max-h-screen"
      />
    </TPopup>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'

export default {
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
  computed: {
    count() {
      return Object.keys(this.selected).length
    },
  },
  watch: {
    value: 'load',
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      if (!this.value) {
        this.selected = {}
        return
      }

      this.selected = this.value
    },
    save() {
      this.showPopup = false
      this.$emit('input', this.selected)
    },
  },
}
</script>
