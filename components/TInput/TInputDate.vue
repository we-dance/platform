<template>
  <div>
    <div class="flex gap-2">
      <DatePicker
        v-model="internalValue.dateStart"
        type="date"
        :range="internalValue.multi"
        format="YYYY-MM-DD"
        :lang="{ formatLocale: { firstDayOfWeek: 1 } }"
        value-type="format"
        simple
        class="w-full"
      />
      <DatePicker
        v-model="internalValue.timeStart"
        type="time"
        format="HH:mm"
        value-type="format"
        simple
        class="w-36"
      />
      <TRichSelect
        v-model="internalValue.duration"
        :options="options"
        hide-search-box
      />
      <DatePicker
        v-model="autoEnd"
        disabled
        type="time"
        format="HH:mm"
        value-type="format"
        simple
        class="w-36"
      />
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
      multi: false,
    },
  }),
  computed: {
    autoEnd() {
      if (!this.internalValue.dateTimeStart) {
        return ''
      }

      return new Date(
        this.internalValue.dateTimeStart.getTime() +
          this.internalValue.duration * 60000
      )
        .toISOString()
        .split('T')[1]
        .split('.')[0]
    },
  },
  watch: {
    'internalValue.dateStart': 'update',
    'internalValue.timeStart': 'update',
    'internalValue.duration': 'update',
  },
  mounted() {
    const defaultStartDate = new Date(new Date().toDateString() + ' ' + '19:00')

    this.internalValue.dateTimeStart =
      // this.value.dateTimeStart ||
      defaultStartDate

    this.internalValue.dateStart = this.internalValue.dateTimeStart
      .toISOString()
      .split('T')[0]

    this.internalValue.timeStart = this.internalValue.dateTimeStart
      .toISOString()
      .split('T')[1]
      .split('.')[0]

    this.internalValue.timeEnd = new Date(
      this.internalValue.dateTimeStart.getTime() +
        this.internalValue.duration * 60000
    )
      .toISOString()
      .split('T')[1]
      .split('.')[0]
  },
  methods: {
    update() {
      // this.internalValue.dateTimeStart = new Date(
      //   this.internalValue.dateStart + ' ' + this.internalValue.timeStart
      // )
      // this.internalValue.dateTimeEnd = new Date(
      //   this.internalValue.dateStart + ' ' + this.internalValue.timeEnd
      // )
    },
  },
}
</script>
