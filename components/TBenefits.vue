<template>
  <section class="px-3 m-auto pb-2">
    <h2 class="text-3xl text-center font-extrabold mb-4">{{title}}</h2>
    <div class="flex gap-2" v-for="(benefit, index) in benefits" :key="index">
      <TIcon :name=icon class="grid content-center" />
      <p class="text-lg my-1" v-html="benefit"></p>
      <!-- v-html allow passing html entity like &rsquo; -->
    </div>
  </section>
</template>

<script>
export default {
  props: {
    title: String,
    icon: String,
    benefits: Array
  }
}
</script>
