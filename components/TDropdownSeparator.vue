<template>
  <div class="font-bold p-2 text-xs text-gray-700 border-b">{{ label }}</div>
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
