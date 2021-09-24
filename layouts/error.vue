<template>
  <div
    class="flex-grow flex flex-col justify-center items-center bg-white min-h-screen"
  >
    <h1 class="font-bold text-4xl mb-2 leading-tight">
      {{ statusCode }}
    </h1>
    <h1 class="font-bold text-2xl mb-2 leading-tight">
      {{ message }}
    </h1>
    <TIcon name="undraw_compose_music" class="w-64 mt-8" />
  </div>
</template>

<script>
export default {
  layout: 'minimal',
  props: {
    error: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    statusCode: '',
    message: '',
  }),
  mounted() {
    const codes = {
      404: 'Page not found',
      405: 'Not allowed',
    }

    this.statusCode = this.error.statusCode
    this.message = codes[this.statusCode] || 'An error occured'
  },
}
</script>
