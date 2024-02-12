<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <div class="p-4">
      <h1 class="text-2xl font-bold">Feed from Everywhere</h1>
      <div class="text-sm">
        Explore our community feed for real-time recommendations and dance event
        insights from dancers worldwide.
      </div>
    </div>

    <TStories />
  </div>
</template>

<script>

export default {
  name: 'Feed',
}
</script>
