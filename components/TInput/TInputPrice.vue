<template>
  <div class="flex flex-row ">
    <TInputNumber
      ref="input"
      v-model="amount"
      v-bind="$attrs"
      class="text-black placeholder-gray-400 bg-white border-gray-300 focus:border-blue-500  block text-sm w-full px-3 py-2 transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <TInputSelect v-model="currency" :options="options" class="border-2" />
  </div>
</template>

<script>
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
    options: {
      type: Array,
      default: () => [],
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    amount: 0,
    currency: 'EUR',
  }),
  watch: {
    amount() {
      const price = { amount: this.amount, currency: this.currency }
      this.$emit('input', price)
    },
    currency() {
      const price = { amount: this.amount, currency: this.currency }
      this.$emit('input', price)
    },
    value() {
      this.amount = this.value.amount
      this.currency = this.value.currency
    },
  },
  mounted() {
    if (typeof this.value === 'object') {
      this.amount = this.value.amount
      this.currency = this.value.currency
    } else {
      this.amount = this.value
    }
  },
}
</script>
