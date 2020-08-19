<template>
  <div class="p-4 pb-8 max-w-2xl mx-auto">
    <div class="my-6 text-3xl font-serif leading-tight text-center">
      Find dance community in your city
    </div>
    <div class="flex justify-center">
      <TInputCity @input="selectCity" />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'static',
  methods: {
    selectCity(val) {
      this.$router.push(`/${val.locality}`)
    }
  }
}
</script>
