<template>
  <div>
    <div class="flex">
      <TButton type="secondary" class="mr-2" @click="showPopup = true"
        >Select accounts ({{ count }})</TButton
      >
      <TButton type="secondary" @click="showImport = true">Import</TButton>
    </div>
    <template v-if="showImport">
      <TField v-model="csv" type="textarea" class="mb-2" />
      <TButton @click="startImport">Import</TButton>
    </template>
    <TPopup
      v-if="showPopup"
      :title="`Select accounts (${count})`"
      @close="save"
    >
      <TGridAccounts v-model="selected" vertical-scroll class="max-h-screen" />
    </TPopup>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  props: {
    value: {
      type: [Object, String],
      default: () => ({})
    }
  },
  data: () => ({
    showPopup: false,
    showImport: false,
    csv: ''
  }),
  setup() {
    const selected = ref({})

    return {
      selected
    }
  },
  computed: {
    count() {
      return Object.keys(this.selected).length
    }
  },
  watch: {
    value: 'load'
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
    sanitize(value) {
      return value.replace(/[^a-z0-9]/gim, '')
    },
    startImport() {
      this.showImport = false

      const lines = this.csv.split('\n').map((l) => {
        const [name, email] = l.split('\t')
        return {
          name,
          email
        }
      })

      const result = {}

      lines.forEach((line) => {
        result[this.sanitize(line.email)] = line
      })

      this.$emit('input', result)
    }
  }
}
</script>
