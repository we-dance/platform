<template>
  <div v-if="list.length > 0" class="border-2 border-b">
    <ul :class="[{ 'max-h-screen overflow-y-scroll': !showTools }]">
      <li
        v-for="p in list"
        :key="!showTools ? p.id + 'drop' : p.id + 'card'"
        :class="[
          { 'cursor-not-allowed opacity-25': p.selected },
          { 'cursor-pointer': !showTools },
          'border-b-2',
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
  </div>
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
