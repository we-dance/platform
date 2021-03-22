<template>
  <div class="space-y-4">
    <TField v-model="city" type="city" label="City" />
    <pre class="p-4 bg-gray-100">city: {{ city }}</pre>

    <TField v-model="place" type="place" label="Place" />
    <pre class="p-4 bg-gray-100">place: {{ place }}</pre>

    <TField v-model="zipcode" type="zipcode" label="Zipcode" />
    <pre class="p-4 bg-gray-100">zipcode: {{ zipcode }}</pre>
  </div>
</template>

<script>
export default {
  data: () => ({
    city: '',
    place: '',
    zipcode: ''
  })
}
</script>
