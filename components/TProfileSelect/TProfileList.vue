<template>
  <ul
    :class="[{ 'px-6': !showTools }, 'overflow-y-scroll']"
    :style="{ maxHeight: '320px', height: 'fit-content' }"
  >
    <li v-for="p in list" :key="!showTools ? p.id + 'drop' : p.id + 'card'">
      <TBioCard
        :avatar="p.photo"
        :name="p.username"
        :bio="p.bio"
        :role="p.role"
        :show-tools="showTools"
        @edit="$emit('edit', p)"
        @remove="$emit('remove', p.id)"
        @select="$emit('select', p)"
      />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TProfileList',
  props: {
    list: {
      type: [Array, Object],
      default: () => ({}),
    },
    showTools: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
