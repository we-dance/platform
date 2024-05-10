<template>
  <div>
    <div class="space-y-2 bg-gray-100 rounded py-1 px-2">
      <div class="flex gap-2 items-baseline">
        <div class="flex-grow w-6 text-sm">Start</div>
        <DatePicker
          v-model="internalValue.dateStart"
          type="date"
          :range="internalValue.multi"
          format="YYYY-MM-DD"
          :lang="{ formatLocale: { firstDayOfWeek: 1 } }"
          value-type="format"
          simple
        />
        <DatePicker
          v-model="internalValue.timeStart"
          type="time"
          format="HH:mm"
          value-type="format"
          simple
          class="w-20"
        />
      </div>
      <div class="flex gap-2 items-baseline">
        <div class="flex-grow w-6 text-sm">End</div>
        <DatePicker
          v-model="internalValue.dateEnd"
          type="date"
          :range="internalValue.multi"
          format="YYYY-MM-DD"
          :lang="{ formatLocale: { firstDayOfWeek: 1 } }"
          value-type="format"
          simple
        />
        <DatePicker
          v-model="internalValue.timeEnd"
          type="time"
          format="HH:mm"
          value-type="format"
          simple
          class="w-20"
        />
      </div>
      <div class="flex gap-2">
        <TRichSelect
          v-model="internalValue.freq"
          :options="freqOptions"
          hide-search-box
        />
      </div>
    </div>
    <pre>{{ internalValue }}</pre>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Object, String],
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    freqOptions: [
      { label: 'Does not repeat', value: 'never' },
      { label: 'Weekly', value: 'weekly' },
    ],
    options: [
      { label: '1h', value: 60 },
      { label: '2h', value: 120 },
      { label: '3h', value: 180 },
      { label: '4h', value: 240 },
      { label: '5h', value: 300 },
    ],
    internalValue: {
      dateTimeStart: '',
      dateTimeEnd: '',
      dateStart: '',
      dateEnd: '',
      timeStart: '',
      timeEnd: '',
      duration: 60,
      freq: 'never',
    },
  }),
  watch: {
    'internalValue.dateStart': 'update',
    'internalValue.timeStart': 'update',
    'internalValue.dateEnd': 'update',
    'internalValue.timeEnd': 'update',
  },
  mounted() {
    const defaultStartDate = new Date(new Date().toDateString() + ' ' + '19:00')
    const defaultEndDate = new Date(new Date().toDateString() + ' ' + '20:00')

    this.internalValue.dateTimeStart =
      this.value.dateTimeStart || defaultStartDate

    this.internalValue.dateTimeEnd = this.value.dateTimeEnd || defaultEndDate

    this.internalValue.dateStart = this.internalValue.dateTimeStart
      .toISOString()
      .split('T')[0]

    this.internalValue.timeStart = this.internalValue.dateTimeStart
      .toISOString()
      .split('T')[1]
      .split('.')[0]
      .slice(0, 5)

    this.internalValue.dateEnd = this.internalValue.dateTimeEnd
      .toISOString()
      .split('T')[0]

    this.internalValue.timeEnd = this.internalValue.dateTimeEnd
      .toISOString()
      .split('T')[1]
      .split('.')[0]
      .slice(0, 5)
  },
  methods: {
    update() {
      this.internalValue.dateTimeStart = new Date(
        this.internalValue.dateStart + ' ' + this.internalValue.timeStart
      )
      this.internalValue.dateTimeEnd = new Date(
        this.internalValue.dateEnd + ' ' + this.internalValue.timeEnd
      )
      this.internalValue.duration = Math.round(
        (this.internalValue.dateTimeEnd - this.internalValue.dateTimeStart) /
          60000
      )
    },
  },
}
</script>
