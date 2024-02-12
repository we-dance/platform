<template>
  <div class="bg-dark md:py-4 min-h-screen">
    <div
      class="mx-auto w-full max-w-lg md:rounded md:border md:shadow bg-white"
    >
      <TReviewForm />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviewAdd',
  layout: 'empty',
  middleware: ['auth'],
}
</script>
