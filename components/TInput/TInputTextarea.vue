<template>
  <textarea
    v-bind="$attrs"
    :value.sync="value"
    class="w-full block bg-gray-200 appearance-none font-mono border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
    @input="(val) => $emit('input', val)"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  }
}
</script>
