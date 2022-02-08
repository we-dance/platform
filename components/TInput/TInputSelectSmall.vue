<template>
  <div class="flex-shrink-0 relative">
    <select
      :value="value"
      v-bind="$attrs"
      class="block appearance-none text-xs text-gray-700 rounded px-1 pr-4"
      @change="change($event)"
    >
      <option
        v-for="option in options"
        :key="getValue(option)"
        :value="getValue(option)"
      >
        {{ getLabel(option) }}
      </option>
    </select>
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center mr-1 -mt-4 text-gray-700"
    >
      <ChevronDownIcon class="w-3 h-3" />
    </div>
  </div>
</template>

<script>
import { ChevronDownIcon } from '@vue-hero-icons/outline'
import { camelcase } from '~/utils'

export default {
  name: 'TInputSelect',
  components: {
    ChevronDownIcon,
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Number],
      default: '',
    },
    defaultValue: {
      type: [String, Number],
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    if (!this.value) {
      this.$emit('input', this.defaultValue)
    }
  },
  methods: {
    change(event) {
      this.$emit('input', event.target.value)
    },
    getValue(field) {
      if (typeof field === 'string') {
        return field
      }

      if (field.value) {
        return field.value
      }

      return field.name
    },
    getLabel(field) {
      if (typeof field === 'string') {
        return camelcase(field)
      }

      if (field.label) {
        return field.label
      }

      return camelcase(field.name)
    },
  },
}
</script>
