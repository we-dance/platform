<template>
  <TResizable>
    <template v-slot:default="{ resize }">
      <div>
        <textarea
          v-model="input"
          v-bind="$attrs"
          class="w-full block bg-gray-200 appearance-none font-mono border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          @input="resize"
        />
        <div
          v-if="max > 0"
          class="text-gray-500 text-sm text-right"
          :class="{ 'text-red-500': value.length > max }"
        >
          {{ value.length }} / {{ max }}
        </div>
      </div>
    </template>
  </TResizable>
</template>

<script>
export default {
  name: 'TInputTextarea',
  props: {
    value: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    max: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    input: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
}
</script>
