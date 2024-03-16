<template>
  <div>
    <div class="p-4">
      <TField v-model="date" component="TInputDate" label-position="top" />
      <pre>{{ date }}</pre>
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
