<template>
  <div
    class="flex min-h-screen flex-grow flex-col items-center justify-center bg-white"
  >
    <h1 class="mb-2 text-4xl font-bold leading-tight">
      {{ statusCode }}
    </h1>
    <h1 class="mb-2 text-2xl font-bold leading-tight">
      {{ message }}
    </h1>
    <TIcon name="undraw_compose_music" class="mt-8 w-64" />
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
