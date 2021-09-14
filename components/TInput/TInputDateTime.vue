<template>
  <FlatPickr v-model="input" :config="config" />
</template>

<script>
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default {
  components: {
    FlatPickr,
  },
  props: {
    value: {
      type: [String, Object, Date],
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    input: '',
    mounted: false,
    config: {
      inline: true,
      time_24hr: true,
      enableTime: true,
      altInput: true,
      altFormat: 'H:i D, j M Y',
      defaultHour: 19,
      minuteIncrement: 15,
      dateFormat: 'Z',
    },
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

      this.updateValue()
    },
  },
  mounted() {
    this.updateValue()
    this.mounted = true
  },
  methods: {
    updateValue() {
      let val = this.value

      if (val.toDate) {
        val = val.toDate()
      }

      this.input = val
    },
  },
}
</script>
