<template>
  <div>
    <h4>
      {{ node.name }}<span v-if="node.room"> • {{ node.room }}</span>
    </h4>
    <div v-if="showAddress" class="text-gray-700 text-xs">
      {{ node.formatted_address }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    node: {
      type: [Object, String],
      default: '',
    },
    showAddress: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
