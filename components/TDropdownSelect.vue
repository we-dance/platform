<template>
  <TMenu>
    <template v-slot:button>
      <TButton
        :icon="icon"
        :type="type"
        :label="getLabel(getSelectedOption())"
      />
    </template>
    <template v-slot:menu>
      <div class="w-40 py-2 bg-white rounded-lg shadow-xl border">
        <TButton
          v-for="option in options"
          :key="getValue(option)"
          :type="value === getValue(option) ? 'toggled' : 'context'"
          class="text-xs"
          @click="change(getValue(option))"
        >
          {{ getLabel(option) }}
        </TButton>
      </div>
    </template>
  </TMenu>
</template>

<script>
import { camelcase } from '~/utils'

export default {
  props: {
    icon: {
      type: String,
      default: 'more_vert',
    },
    type: {
      type: String,
      default: 'nav',
    },
    label: {
      type: [String, Number, Boolean],
      default: false,
    },
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
    change(value) {
      this.$emit('input', value)
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
    getSelectedOption() {
      return this.options.find((option) => this.value === this.getValue(option))
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
