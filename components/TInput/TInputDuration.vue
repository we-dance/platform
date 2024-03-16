<template>
  <div>
    <TRichSelect v-model="value" :options="options" hide-search-box />
  </div>
</template>

<script>
import { getTime } from '~/utils'

export default {
  props: {
    value: {
      type: [String, Number],
      default: 60,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    other() {
      return this.value === 'other'
    },
    options() {
      const startDate = this.item.startDate

      const options = []
      const values = [60, 120, 180, 240, 300]

      for (const value of values) {
        options.push({
          label: `${value / 60}h – ${getTime(
            new Date(startDate + value * 60 * 1000)
          )}`,
          value,
        })
      }

      return options
    },
  },
}
</script>
