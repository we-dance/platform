<template>
  <div>
    <div class="p-4">
      <TField
        v-model="item.startDate"
        :item="item"
        component="DatePicker"
        v-bind="{
          labelPosition: 'top',
          type: 'datetime',
          format: 'YYYY-MM-DDTHH:mm',
          'time-picker-options': {
            start: '00:00',
            step: '00:30',
            end: '23:30',
            format: 'HH:mm',
          },
          lang: { formatLocale: { firstDayOfWeek: 1 } },
          'value-type': 'timestamp',
        }"
      />
      <TField
        v-model="data"
        :item="item"
        component="TRecurrenceEditor"
        label-position="top"
      />
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    item: {
      startDate: Date.now(),
    },
    data: '',
  }),
}
</script>
