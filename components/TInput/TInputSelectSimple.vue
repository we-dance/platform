<template>
  <div class="flex-shrink-0 relative">
    <select
      :value="value"
      v-bind="$attrs"
      class="block text-indigo-700 bg-indigo-100 rounded-full px-2"
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
  </div>
</template>

<script>
import { camelcase } from '~/utils'
import { ChevronDownIcon } from '@vue-hero-icons/outline'

export default {
  name: 'TInputSelect',
  inheritAttrs: false,
  components: {
    ChevronDownIcon,
  },
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
