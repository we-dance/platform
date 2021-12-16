<template>
  <div class="flex flex-col sm:flex-row ">
    <p class="px-2 py-2">Min</p>
    <TInputNumber
      ref="input"
      v-model="minAmount"
      v-bind="$attrs"
      class="text-black placeholder-gray-400 bg-white border-gray-300 focus:border-blue-500 block text-sm w-full px-3 py-2 transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <span class="px-2 py-2">Max</span>
    <TInputNumber
      ref="input"
      v-model="maxAmount"
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
    minAmount: 0,
    maxAmount: 0,
    currency: '€',
  }),
  watch: {
    minAmount() {
      const minPrice = {
        minAmount: this.minAmount,
        maxAmount: this.maxAmount,
        currency: this.currency,
      }
      this.$emit('input', minPrice)
    },
    maxAmount() {
      const maxPrice = {
        minAmount: this.minAmount,
        maxAmount: this.maxAmount,
        currency: this.currency,
      }

      this.$emit('input', maxPrice)
    },
    currency() {
      const price = {
        minAmount: this.minAmount,
        maxAmount: this.maxAmount,
        currency: this.currency,
      }
      this.$emit('input', price)
    },
    value() {
      if (typeof this.value === 'object') {
        this.minAmount = this.value.minAmount || this.value.amount
        this.maxAmount = this.value.maxAmount || this.value.amount
        this.currency = this.value.currency
      } else {
        this.minAmount = this.value
        this.maxAmount = this.value
      }
    },
  },
  mounted() {
    if (typeof this.value === 'object') {
      this.minAmount = this.value.minAmount || this.value.amount
      this.maxAmount = this.value.maxAmount || this.value.amount
      this.currency = this.value.currency
    } else {
      this.minAmount = this.value
      this.maxAmount = this.value
    }
  },
}
</script>
