<template>
  <div>
    <div class="inline-block relative">
      <div
        class="block cursor-pointer w-full bg-white text-black border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        @click="editing = true"
      >
        <div class="text-sm flex">
          <div>{{ label }}</div>
          <div
            v-if="count"
            class="ml-1 rounded-full bg-primary text-white w-4 h-4 text-center text-xs"
          >
            {{ count }}
          </div>
        </div>
      </div>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-end mb-2 px-2 text-gray-700"
      >
        <svg
          class="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
          />
        </svg>
      </div>
    </div>
    <TPopup v-if="editing" :title="label" @close="editing = false">
      <div class="max-w-md mx-auto h-64 overflow-y-scroll">
        <TInputMulti :value="value" :options="options" @input="onChange" />
      </div>
    </TPopup>
  </div>
</template>

<script>
export default {
  name: 'TInputMultiDropdown',
  inheritAttrs: false,
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => [],
    },
    label: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    editing: false,
  }),
  computed: {
    count() {
      return Object.keys(this.value).length
    },
  },
  methods: {
    onChange(val) {
      this.$emit('input', val)
    },
  },
}
</script>
