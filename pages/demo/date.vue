<template>
  <div>
    <THeader show-logo class="md:hidden" />
    <div class="p-4">
      <TField v-model="date" component="TInputDate" label-position="top" />
      <pre v-if="date">{{ getYmdHms(date) }} - {{ date }}</pre>
    </div>
    <div class="p-4">
      <TField v-model="today" component="TInputDate" label-position="top" />
      <pre v-if="today">{{ getYmdHms(today) }} - {{ today }}</pre>
    </div>
  </div>
</template>

<script>
import { getYmdHms } from '~/utils'

export default {
  data: () => ({
    date: '',
    today: +new Date(),
  }),
  methods: {
    getYmdHms,
  },
}
</script>
