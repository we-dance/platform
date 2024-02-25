<template>
  <div class="bg-dark md:py-4 min-h-screen">
    <div
      class="mx-auto w-full max-w-lg md:rounded md:border md:shadow bg-white"
    >
      <TReviewForm :story-id="$route.params.storyId" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoryEdit',
  layout: 'empty',
  middleware: ['auth'],
}
</script>
