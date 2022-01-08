<template>
  <ul :class="[{ 'px-6 max-h-screen overflow-y-scroll': !showTools }]">
    <li
      v-for="p in list"
      :key="!showTools ? p.id + 'drop' : p.id + 'card'"
      :class="[
        { 'cursor-not-allowed opacity-25': p.selected },
        { 'hover:bg-gray-200 cursor-pointer': !showTools },
      ]"
    >
      <TBioCard
        :photo="p.photo"
        :username="p.username"
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
