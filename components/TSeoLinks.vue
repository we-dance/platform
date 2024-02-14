<template>
  <div class="p-4 text-gray-600">
    <h3 class="text-xs font-extrabold text-center">
      Dance Events Near Me
    </h3>
    <ul class="text-xs text-center">
      <li
        v-for="style in [
          'Salsa',
          'Bachata',
          'Kizomba',
          'BrazilianZouk',
          'Afrobeats',
        ]"
        :key="style"
        class="inline-block p-1"
      >
        <nuxt-link
          :to="localePath(`/explore/${profile.username}?style=${style}`)"
          >{{ style }} in {{ profile.name }}</nuxt-link
        >
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
