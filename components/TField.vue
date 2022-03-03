<template>
  <div v-if="hidden"></div>
  <div v-else :class="wrapperClasses" class="grid w-full">
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
        <div class="font-bold text-gray-700">{{ label }}</div>
      </label>
    </div>
    <div :class="inputWrapperClasses">
      <slot name="top" />
      <TPreview
        v-if="before"
        :content="$t(before)"
        no-typo
        class="mb-2 text-sm text-gray-500"
      />
      <slot>
        <component
          :is="component"
          :id="elementId"
          v-bind="translatedAttrs"
          :value.sync="computedValue"
          v-on="$attrs.listeners"
          @input="(val) => $emit('input', set(val))"
        />
      </slot>
      <TPreview
        v-if="description"
        :content="$t(description)"
        no-typo
        class="mt-2 text-sm text-gray-500"
      />
      <slot name="bottom" />
    </div>
    <TPopup v-if="showTips" :title="label" @close="showTips = false">
      <TPreview :content="$t(tips)" class="my-4 max-w-sm" />
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
      type: [String, Object, Array, Number, Date],
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
  },
  data: () => ({
    elementId: '',
    showTips: false,
  }),
  computed: {
    translatedAttrs() {
      let translated = this.$attrs
      if (translated?.options) {
        const options = translated.options.map((option) => {
          if (typeof option === 'string') {
            return this.$te(option) ? this.$t(option) : option
          }
          const label = option.label
          return this.$t(label)
        })
        translated = { ...translated, options }
      }

      if (translated?.placeholder) {
        const placeholder = this.$t(translated.placeholder)
        translated = { ...translated, placeholder }
      }

      return translated
    },
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
    this.elementId = camelize(this.label)

    if (!this.value && this.default) {
      this.$emit('input', this.default)
    }
  },
}
</script>
