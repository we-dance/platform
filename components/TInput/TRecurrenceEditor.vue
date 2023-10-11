<template>
  <div>
    <TInputButtons v-model="freq" :options="['never', 'weekly']" />
    <div v-if="freq === 'weekly'">
      <div class="font-bold">Repeat on</div>
      <TInputMulti v-model="days" :options="daysOptions" />
      <div class="font-bold">Until</div>
      <DatePicker v-model="untilDate" />
    </div>
  </div>
</template>

<script>
import { RRule } from 'rrule'
import { getDateObect } from '~/utils'

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
    value: {
      handler(newValue) {
        if (this.freq !== newValue.freq) {
          this.freq = newValue.freq || 'never'
        }

        if (JSON.stringify(this.days) !== JSON.stringify(newValue.days)) {
          this.days = newValue.days || {}
        }

        if (this.untilDate !== newValue.untilDate) {
          this.untilDate = newValue.untilDate
            ? getDateObect(newValue.untilDate)
            : ''
        }
      },
      immediate: true,
    },
    freq: 'updateModel',
    days: 'updateModel',
    untilDate: 'updateModel',
  },
  methods: {
    updateModel() {
      this.$emit('input', {
        freq: this.freq,
        days: this.days,
        untilDate: this.untilDate,
        dates: this.dates,
      })
    },
  },
}
</script>
