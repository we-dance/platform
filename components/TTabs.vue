<template>
  <div class="flex overflow-x-scroll">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="border border-gray-200 w-full rounded-t focus:outline-none hover:bg-gray-100"
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
