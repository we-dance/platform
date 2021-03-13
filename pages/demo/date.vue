<template>
  <div>
    <pre>Selected date is - {{ date }}</pre>
    <div class="mt-4">
      <TInputDateTime v-model="date" />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    date: ''
  })
}
</script>
