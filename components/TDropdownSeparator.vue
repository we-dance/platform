<template>
  <div class="border-b p-2 text-xs font-bold text-gray-700">{{ label }}</div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
  },
}
</script>
