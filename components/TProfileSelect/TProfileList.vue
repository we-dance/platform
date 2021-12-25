<template>
  <ul :class="[{ 'px-6': !showTools }]">
    <li v-for="p in list" :key="!showTools ? p.id + 'drop' : p.id + 'card'">
      <TBioCard
        :avatar="p.photo"
        :name="p.name"
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
      type: Array,
      default: () => ({}),
    },
    showTools: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
