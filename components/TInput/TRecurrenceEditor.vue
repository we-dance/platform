<template>
  <div>
    <TInputButtons v-model="freq" :options="['never', 'weekly']" />
    <div v-if="freq === 'weekly'">
      <div class="font-bold">Repeat on</div>
      <TInputMulti v-model="days" :options="daysOptions" />
      <div class="font-bold">Until</div>
      <DatePicker v-model="untilDate" />
    </div>
    <pre>{{ ruleOptions }}</pre>
    <pre>{{ dates }}</pre>
  </div>
</template>

<script>
import { datetime, RRule } from 'rrule'
import { getObjectKeysFromArray } from '~/utils'

export default {
  name: 'TRecurrenceEditor',
  inheritAttrs: false,
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: [Object, String],
      default: () => ({}),
    },
  },
  data: () => ({
    freq: 'never',
    days: {},
    untilDate: '',
    daysOptions: [
      { label: 'Monday', value: 'MO' },
      { label: 'Tuesday', value: 'TU' },
      { label: 'Wednesday', value: 'WE' },
      { label: 'Thursday', value: 'TH' },
      { label: 'Friday', value: 'FR' },
      { label: 'Saturday', value: 'SA' },
      { label: 'Sunday', value: 'SU' },
    ],
  }),
  computed: {
    ruleOptions() {
      if (this.freq !== 'weekly' || !this.item.startDate || !this.untilDate) {
        return null
      }

      const options = {
        freq: RRule.WEEKLY,
        byweekday: Object.keys(this.days),
        dtstart: new Date(this.item.startDate),
        until: new Date(this.untilDate),
      }

      return options
    },
    dates() {
      if (!this.ruleOptions) {
        return []
      }

      const rule = new RRule(this.ruleOptions)

      return rule.all()
    },
  },
  watch: {
    dates() {
      this.$emit('value', {
        options: this.ruleOptions,
        dates: this.dates,
      })
    },
  },
  mounted() {
    if (!this.value.ruleOptions) {
      return
    }

    this.freq = this.value.ruleOptions === 2 ? 'weekly' : 'never'
    this.days = getObjectKeysFromArray(this.value.ruleOptions.byweekday)
    this.untilDate = this.value.until
  },
}
</script>
