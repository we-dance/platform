<template>
  <div>
    <pre>Selected date is - {{ date }}</pre>
    <div class="mt-4">
      <TField type="datetime-local" v-model="date" />
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
