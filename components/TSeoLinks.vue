<template>
  <div class="p-4 text-gray-600">
    <h3 class="text-xs font-extrabold text-center">
      Dance Events Near Me
    </h3>
    <ul class="text-xs text-center">
      <li v-for="style in styles" :key="style.value" class="inline-block p-1">
        <nuxt-link
          :to="localePath(`/explore/${profile.username}?style=${style.value}`)"
          >{{ style.label }} in {{ profile.name }}</nuxt-link
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
  data: () => ({
    styles: [
      {
        value: 'Salsa',
        label: 'Salsa',
      },
      {
        value: 'Bachata',
        label: 'Bachata',
      },
      {
        value: 'Kizomba',
        label: 'Kizomba',
      },
      {
        value: 'BrazilianZouk',
        label: 'Zouk',
      },
      {
        value: 'Afrobeats',
        label: 'Afrobeats',
      },
    ],
  }),
}
</script>
