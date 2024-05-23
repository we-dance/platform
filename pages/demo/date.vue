<template>
  <div>
    <THeader show-logo class="md:hidden" />
    <div class="p-4">
      <TField v-model="date" component="TInputDate" label-position="top" />
      <pre>{{ date }}</pre>
      <pre>{{ new Date(date) }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    date: '',
  }),
}
</script>
