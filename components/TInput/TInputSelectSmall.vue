<template>
  <div class="relative flex-shrink-0">
    <select
      :value="value"
      v-bind="$attrs"
      class="block appearance-none rounded px-1 pr-4 text-xs text-gray-700"
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
      class="pointer-events-none absolute inset-y-0 right-0 mr-1 -mt-4 flex items-center text-gray-700"
    >
      <ChevronDownIcon class="h-3 w-3" />
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
