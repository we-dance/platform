<template>
  <div v-if="hidden"></div>
  <div v-else :class="wrapperClasses" class="w-full grid gap-4">
    <div v-if="!hideLabel" :class="labelClasses">
      <label :for="elementId">
        <div class="text-gray-700 font-bold">{{ label }}</div>
      </label>
    </div>
    <div :class="inputWrapperClasses">
      <slot name="top" />
      <slot>
        <component
          :is="getComponent()"
          :id="elementId"
          v-bind="$attrs"
          :value.sync="value"
          :type="type"
          :auto-focus="autoFocus"
          :hide-label="hideLabel"
          @input="(val) => $emit('input', val)"
        />
      </slot>
      <div v-if="description" class="text-gray-500 text-sm mt-1">
        {{ description }}
      </div>
      <slot name="bottom" />
    </div>
  </div>
</template>

<script>
import { getId } from '~/utils'
import TInput from '~/components/TInput/TInput'
import TInputMarkdown from '~/components/TInput/TInputMarkdown'
import TInputSelect from '~/components/TInput/TInputSelect'
import TInputTags from '~/components/TInput/TInputTags'
import TInputTextarea from '~/components/TInput/TInputTextarea'

export default {
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Object, Array, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    labelPosition: {
      type: String,
      default: 'left'
    },
    type: {
      type: String,
      default: 'text'
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    default: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => ({})
    },
    hideLabel: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    elementId: ''
  }),
  computed: {
    hidden() {
      return this.type === 'hidden'
    },
    wrapperClasses() {
      const map = {
        top: 'grid-cols-1',
        left: 'grid-cols-12'
      }

      return map[this.labelPosition]
    },
    labelClasses() {
      const map = {
        top: 'col-span-12',
        left: 'col-span-12 text-left lg:text-right lg:col-span-4'
      }

      return map[this.labelPosition]
    },
    inputWrapperClasses() {
      const map = {
        top: 'col-span-12',
        left: 'col-span-12 lg:col-span-8'
      }

      const labelPosition = this.hideLabel ? 'top' : this.labelPosition

      return map[labelPosition]
    }
  },
  mounted() {
    this.elementId = getId(this.label)

    if (!this.value && this.default) {
      this.$emit('input', this.default)
    }
  },
  methods: {
    getComponent() {
      const map = {
        tags: TInputTags,
        select: TInputSelect,
        markdown: TInputMarkdown,
        textarea: TInputTextarea
      }

      return map[this.type] || TInput
    }
  }
}
</script>
