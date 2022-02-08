<template>
  <div>
    <pre>Selected date is - {{ date }}</pre>
    <div class="mt-4">
      <TField v-model="date" type="datetime-local" label="Select date" />
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
