<template>
  <div class="flex flex-col sm:flex-row ">
    <p class="px-2 py-2">Min</p>
    <TInputNumber
      ref="input"
      v-model="min"
      v-bind="$attrs"
      class="text-black placeholder-gray-400 bg-white border-gray-300 focus:border-blue-500 block text-sm w-full px-3 py-2 transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <span class="px-2 py-2">Max</span>
    <TInputNumber
      ref="input"
      v-model="max"
      v-bind="$attrs"
      class="text-black placeholder-gray-400 bg-white border-gray-300 focus:border-blue-500 block text-sm w-full px-3 py-2 transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <TInputSelect
      v-model="currency"
      :options="useCurrencies"
      class="border-2 sm:px-1 border-white "
    />
  </div>
</template>

<script>
import { useCurrencies } from '~/use/currencies'

export default {
  name: 'TInputPrice',
  props: {
    value: {
      type: [String, Number, Object],
      default: () => ({}),
    },
    defaultPrice: {
      type: Object,
      default: () => ({}),
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return {
      useCurrencies,
    }
  },
  data: () => ({
    min: 0,
    max: 0,
    currency: '€',
  }),
  watch: {
    min() {
      const minPrice = {
        min: this.min,
        max: this.max,
        currency: this.currency,
      }
      this.$emit('input', minPrice)
    },
    max() {
      const maxPrice = {
        min: this.min,
        max: this.max,
        currency: this.currency,
      }

      this.$emit('input', maxPrice)
    },
    currency() {
      const price = {
        min: this.min,
        max: this.max,
        currency: this.currency,
      }
      this.$emit('input', price)
    },
    value() {
      if (typeof this.value === 'object') {
        this.min = this.value.min || this.value.amount
        this.max = this.value.max || this.value.amount
        this.currency = this.value.currency
      } else {
        this.min = this.value
        this.max = this.value
      }
    },
  },
  mounted() {
    if (typeof this.value === 'object') {
      this.min = this.value.min || this.value.amount
      this.max = this.value.max || this.value.amount
      this.currency = this.value.currency
    } else {
      this.min = this.value
      this.max = this.value
    }
  },
}
</script>
