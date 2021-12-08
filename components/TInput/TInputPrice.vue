<template>
  <div class="flex flex-row  ">
    <vt-input ref="input" v-model="amount" v-bind="$attrs" />
    <TInputSelect v-model="currency" :options="options" />
  </div>
</template>

<script>
import { sanitize } from '~/utils'

export default {
  name: 'TInputPrice',
  props: {
    trim: {
      type: String,
      default: '',
    },
    defaultPrice: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    amount: 0,
    currency: '',
  }),
  watch: {
    amount(val, oldVal) {
      if (val !== oldVal) {
        this.sanitize()
      }
      const price = this.amount + this.currency
      this.$emit('input', price)
    },
  },
  mounted() {
    this.amount = this.defaultPrice.amount
    this.currency = this.defaultPrice.currency
  },

  methods: {
    sanitize() {
      if (this.trim) {
        this.amount = sanitize(this.amount, this.trim)
      }
    },
  },
}
</script>
