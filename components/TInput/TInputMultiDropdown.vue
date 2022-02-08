<template>
  <div>
    <div class="relative inline-block">
      <div
        class="focus:shadow-outline block w-full cursor-pointer rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight text-black shadow hover:border-gray-500 focus:outline-none"
        @click="editing = true"
      >
        <div class="flex text-sm">
          <div>{{ label }}</div>
          <div
            v-if="count"
            class="ml-1 h-4 w-4 rounded-full bg-primary text-center text-xs text-white"
          >
            {{ count }}
          </div>
        </div>
      </div>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 mb-2 flex items-end px-2 text-gray-700"
      >
        <svg
          class="h-4 w-4 fill-current"
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
      <div class="mx-auto h-64 max-w-md overflow-y-scroll">
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
