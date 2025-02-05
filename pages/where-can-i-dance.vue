<template>
  <div>
    <div class="p-4 border-b">
      <h1 class="text-2xl font-bold">Where can I dance?</h1>
      <div class="text-sm">
        Share your insights and connect with dancers seeking guidance! Need
        advice?
        <router-link :to="localePath('/explore')" class="underline text-primary"
          >Find your city</router-link
        >
        and ask locals.
      </div>
    </div>

    <TStories type="ask-for-recommendations" />
  </div>
</template>

<script>
export default {
  name: 'Reviews',
}
</script>
