<template>
  <div class="flex flex-row ">
    <vt-input ref="input" v-model="amount" v-bind="$attrs" />
    <TInputSelect v-model="currency" :options="options" class="border-2" />
  </div>
</template>

<script>
export default {
  name: 'TInputPrice',
  props: {
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
    amount() {
      const price = this.amount + this.currency
      this.$emit('input', price)
    },
    currency() {
      const price = this.amount + this.currency
      this.$emit('input', price)
    },
  },
  mounted() {
    this.amount = this.defaultPrice.amount
    this.currency = this.defaultPrice.currency
  },
}
</script>
