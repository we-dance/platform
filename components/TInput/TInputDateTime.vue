<template>
  <Datetime
    v-model="input"
    type="datetime"
    :minute-step="15"
    input-class="w-full block bg-gray-200 appearance-none font-mono border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
  />
</template>

<script>
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'

export default {
  components: {
    Datetime
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    input: '',
    mounted: false
  }),
  watch: {
    input(val) {
      if (!this.mounted) {
        return
      }

      this.$emit('input', val)
    },
    value(val, oldVal) {
      if (this.input === val) {
        return
      }

      this.input = val
    }
  },
  mounted() {
    this.input = this.value
    this.mounted = true
  }
}
</script>
