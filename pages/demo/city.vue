<template>
  <div class="space-y-4">
    <TField v-model="place" type="place" clearable label="Place" />
    <pre class="p-4 bg-gray-100">place: {{ place }}</pre>

    <TField v-model="zipcode" type="zipcode" clearable label="Zipcode" />
    <pre class="p-4 bg-gray-100">zipcode: {{ zipcode }}</pre>
  </div>
</template>

<script>
export default {
  data: () => ({
    city: 'Munich',
    place: 'ChIJE9on3F3HwoAR9AhGJW_fL-I',
    zipcode: '81543'
  })
}
</script>
