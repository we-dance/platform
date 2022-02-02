<template>
  <div>
    <pre>Selected date is - {{ date }}</pre>
    <div class="mt-4">
      <TField type="datetime-local" v-model="date" label="Select date" />
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
