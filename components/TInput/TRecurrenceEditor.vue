<template>
  <div>
    <TInputButtons v-model="freq" :options="['never', 'weekly']" />
    <div v-if="freq === 'weekly'">
      <div class="font-bold">Until</div>
      <DatePicker v-model="untilDate" />
      <div class="flex flex-wrap gap-2 py-2 text-xs items-center">
        <div>{{ dates.length }} times</div>
        <div
          v-for="date in dates"
          :key="+date"
          class="rounded-full bg-gray-100 px-2 py-1"
        >
          {{ getDate(date, $i18n.locale) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RRule } from 'rrule'
import { getDateObect } from '~/utils'
import { getDate } from '~/utils'

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
  setup() {
    return { getDate }
  },
  data: () => ({
    freq: 'never',
    days: {},
    untilDate: '',
  }),
  computed: {
    ruleOptions() {
      if (this.freq !== 'weekly' || !this.item.startDate || !this.untilDate) {
        return null
      }

      const options = {
        freq: RRule.WEEKLY,
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
