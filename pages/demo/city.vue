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
    place: 'ChIJAVkDPzdOqEcRcDteW0YgIQQ',
    zipcode: '81543'
  })
}
</script>
