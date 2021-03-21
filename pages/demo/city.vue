<template>
  <div class="space-y-4">
    <pre class="p-4 bg-gray-100">city: {{ city }}</pre>
    <TField v-model="city" type="city" label="City 1" />
    <TField v-model="city" type="city2" label="City 2" />
  </div>
</template>

<script>
export default {
  data: () => ({
    city: ''
  })
}
</script>
