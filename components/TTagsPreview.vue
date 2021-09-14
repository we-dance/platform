<template>
  <div class="flex">
    <div
      v-for="tag in tags"
      :key="tag.key"
      class="font-bold text-xs text-blue-500 mr-2"
    >
      #{{ tag.label }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    tags() {
      return Object.keys(this.value).map((key) => ({ key, label: key }))
    },
  },
}
</script>
