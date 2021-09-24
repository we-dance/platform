<template>
  <div class="border p-4 rounded text-center">
    <div class="text-xs">{{ title }}</div>
    <TButton :to="url" class="mt-4">{{ action }}</TButton>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
  },
}
</script>
