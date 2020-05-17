<template>
  <div :class="wrapperClasses" class="w-full justify-start items-top">
    <div v-if="label" :class="labelClasses">
      <label :for="elementId">
        <div class="text-gray-700 font-bold">{{ label }}</div>
      </label>
    </div>
    <div :class="inputWrapperClasses">
      <slot name="top" />
      <slot>
        <textarea
          v-if="type === 'textarea'"
          :id="elementId"
          ref="input"
          v-bind="$attrs"
          autocomplete="off"
          :value.sync="value"
          :class="inputClasses"
          class="w-full block bg-gray-200 appearance-none font-mono border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          @input="input($event)"
        />
        <input
          v-else
          :id="elementId"
          ref="input"
          v-bind="$attrs"
          autocomplete="off"
          :type="type"
          :value.sync="value"
          :class="inputClasses"
          class="w-full block bg-gray-200 appearance-none font-mono border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          @input="input($event)"
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
const getId = (text) => {
  return text.replace(' ', '')
}

export default {
  inheritAttrs: false,
  props: {
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
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    autoFocus: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    elementId: ''
  }),
  computed: {
    wrapperClasses() {
      const map = {
        top: '',
        left: 'flex'
      }

      return map[this.labelPosition]
    },
    labelClasses() {
      const map = {
        top: 'w-full mb-2',
        left: 'w-1/3 pr-4 mb-0 text-right pt-2'
      }

      return map[this.labelPosition]
    },
    inputWrapperClasses() {
      const map = {
        top: '',
        left: 'w-2/3'
      }

      return map[this.labelPosition]
    },
    inputClasses() {
      return ''
    }
  },
  mounted() {
    this.elementId = getId(this.label)

    if (this.autoFocus) {
      this.$nextTick(() => {
        if (this.$refs.input) {
          this.$refs.input.focus()
        }
      })
    }
  },
  methods: {
    input(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>
