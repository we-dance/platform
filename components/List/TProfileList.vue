<template>
  <ul class="max-h-screen overflow-y-scroll">
    <li v-for="(item, index) in items" :key="`profile-${index}`">
      <div
        class="flex-row gap-2 flex justify-between items-center py-2 m-1 border-gray-200 px-2 h-full"
      >
        <div class="flex-shrink-0 w-12">
          <TProfilePhoto2 size="lg" :src="item.photo" />
        </div>
        <div class="flex flex-col w-full">
          <div v-if="item.name" class="font-bold">
            {{ item.name }}
          </div>
          <div v-if="item.role" class="text-xs">
            {{ item.role }}
          </div>
          <div v-if="item.bio" class="text-gray-700 text-xs">
            {{ item.bio }}
          </div>
        </div>
        <slot v-bind="{ item, index }" />
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TProfileList',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
