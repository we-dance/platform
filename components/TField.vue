<template>
  <div v-if="hidden"></div>
  <div v-else :class="wrapperClasses" class="w-full grid">
    <div v-if="!hideLabel" :class="labelClasses">
      <label :for="elementId">
        <div v-if="tips" class="float-right">
          <TButton
            icon="help"
            type="icon"
            class="text-blue-500"
            @click="showTips = true"
          />
        </div>
        <div class="text-gray-700 font-bold">{{ label }}</div>
      </label>
    </div>
    <div :class="inputWrapperClasses">
      <slot name="top" />
      <TPreview
        v-if="before"
        :content="before"
        no-typo
        class="text-gray-500 text-sm mb-2"
      />
      <slot>
        <component
          :is="component"
          :id="elementId"
          v-bind="$attrs"
          :item="item"
          :value.sync="computedValue"
          :label="label"
          :name="name"
          :class="{ 'border-red-500': error }"
          v-on="$attrs.listeners"
          @input="onInput"
        />
      </slot>
      <div v-if="error" class="field-error text-red-500 text-sm mt-2">
        {{ error }}
      </div>
      <TPreview
        v-if="description"
        :content="description"
        no-typo
        class="text-gray-500 text-sm mt-2"
      />
      <slot name="bottom" />
    </div>
    <TPopup v-if="showTips" :title="label" @close="showTips = false">
      <TPreview :content="tips" class="my-4 max-w-sm" />
    </TPopup>
  </div>
</template>

<script>
import { camelize } from '~/utils'

export default {
  name: 'TField',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Object, Array, Number, Date, Boolean],
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    label: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    before: {
      type: String,
      default: '',
    },
    tips: {
      type: String,
      default: '',
    },
    labelPosition: {
      type: String,
      default: 'left',
    },
    component: {
      type: String,
      default: 'TInput',
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    default: {
      type: String,
      default: '',
    },
    hideLabel: {
      type: Boolean,
      default: false,
    },
    get: {
      type: Function,
      default: (val) => val,
    },
    set: {
      type: Function,
      default: (val) => val,
    },
    error: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    elementId: '',
    showTips: false,
  }),
  computed: {
    computedValue() {
      return this.get(this.value)
    },
    hidden() {
      return this.type === 'hidden'
    },
    wrapperClasses() {
      const map = {
        top: 'grid-cols-1',
        left: 'grid-cols-12 gap-2',
      }

      return map[this.labelPosition]
    },
    labelClasses() {
      const map = {
        top: 'col-span-12',
        left: 'col-span-12 text-left lg:text-right lg:col-span-4',
      }

      return map[this.labelPosition]
    },
    inputWrapperClasses() {
      const map = {
        top: 'col-span-12',
        left: 'col-span-12 lg:col-span-8',
      }

      const labelPosition = this.hideLabel ? 'top' : this.labelPosition

      return map[labelPosition]
    },
  },
  mounted() {
    this.elementId = this.name || camelize(this.label)

    if (!this.value && this.default) {
      this.$emit('input', this.default)
    }
  },
  methods: {
    onInput(val) {
      this.$emit('input', this.set(val))
    },
  },
}
</script>
