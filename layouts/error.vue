<template>
  <div
    class="flex-grow flex flex-col justify-center items-center bg-real-white min-h-screen"
  >
    <h1
      v-if="error.statusCode === 404"
      class="font-bold text-2xl mb-2 leading-tight"
    >
      Page not found
    </h1>
    <h1 v-else class="font-bold text-2xl mb-2 leading-tight">
      An error occurred
    </h1>
    <TIcon name="undraw_compose_music" class="w-64 mt-8" />
  </div>
</template>

<script>
import TIcon from '~/components/TIcon.vue'
export default {
  components: { TIcon },
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  },
  layout: 'minimal'
}
</script>
