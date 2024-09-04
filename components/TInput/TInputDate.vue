<template>
  <div class="flex gap-2 items-baseline">
    <DatePicker
      v-model="date"
      type="date"
      format="YYYY-MM-DD"
      :lang="{ formatLocale: { firstDayOfWeek: 1 } }"
      value-type="format"
      simple
    />
    <DatePicker
      v-model="time"
      type="time"
      format="HH:mm"
      value-type="format"
      :minute-step="15"
      simple
      class="w-20"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Object, String, Number],
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    date: '',
    time: '',
    timestamp: '',
    updating: false,
  }),
  watch: {
    date: 'update',
    time: 'update',
    value: 'load',
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      if (this.value === this.timestamp) {
        return
      }

      this.timestamp = this.value
      const timezoneOffset = new Date().getTimezoneOffset() * 60000
      const date = new Date(this.value - timezoneOffset)

      if (isNaN(date)) {
        return
      }

      this.date = date.toISOString().split('T')[0]

      this.time = date
        .toISOString()
        .split('T')[1]
        .split('.')[0]
        .slice(0, 5)
    },
    update() {
      if (this.updating) {
        return false
      }

      this.updating = true

      if (!this.time) {
        this.time = '19:00'
      }

      const getTimeZoneOffset = () => {
        const offset = new Date().getTimezoneOffset()
        const sign = offset <= 0 ? '+' : '-'
        const hours = String(Math.abs(Math.round(offset / 60))).padStart(2, '0')
        const minutes = String(Math.abs(offset % 60)).padStart(2, '0')
        return `${sign}${hours}:${minutes}`
      }

      const timeZoneOffset = getTimeZoneOffset()
      const val = `${this.date}T${this.time}${timeZoneOffset}`

      const date = new Date(val)
      this.timestamp = +date

      if (this.value === this.timestamp) {
        this.updating = false
        return
      }

      this.$emit('input', this.timestamp)

      this.updating = false
    },
  },
}
</script>
