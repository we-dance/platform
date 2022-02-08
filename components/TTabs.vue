<template>
  <div class="flex overflow-x-scroll">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="w-full rounded-t border border-gray-200 hover:bg-gray-100 focus:outline-none"
      @click="$emit('input', tab.value)"
    >
      <div class="p-2">
        {{ tab.label }}
      </div>
      <div v-if="value === tab.value" class="border-b-2 border-blue-500"></div>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
