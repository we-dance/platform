<template>
  <div>
    <div>Selected date is - {{ date }}</div>
    <div class="mt-4">
      <TField v-model="date" v-bind="field" />
      <TField v-model="date" type="datetime-local" />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    date: '',
    field: {
      component: 'DatePicker',
      labelPosition: 'top',
      type: 'datetime',
      format: 'YYYY-MM-DDTHH:mm',
      'time-picker-options': {
        start: '00:00',
        step: '00:30',
        end: '23:30',
        format: 'HH:mm',
      },
      'value-type': 'format',
    },
  }),
}
</script>
