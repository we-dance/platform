<template>
  <input
    v-model="userValue"
    :pattern="pattern"
    v-bind="$attrs"
    type="tel"
    @focus="focus"
    @keydown="keyDown"
    @blur="update"
  />
</template>

<script>
export default {
  name: 'TInputNumber',
  props: {
    value: {
      type: [String, Number],
      default: 0,
    },
    decimalDelimiter: {
      type: String,
      default: ',',
    },
    thousandDelimiter: {
      type: String,
      default: '.',
    },
    pattern: {
      type: String,
      default: '^-?\\d{1,3}((?:\\.\\d{3})*|\\d*)(?:,\\d+)?$',
    },
    min: {
      type: [Number, Boolean],
      default: false,
    },
    max: {
      type: [Number, Boolean],
      default: false,
    },
    negative: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userValue: '',
    }
  },
  watch: {
    value(newValue) {
      this.load(newValue)
    },
    userValue(newValue, oldValue) {
      if (
        newValue &&
        oldValue &&
        newValue !== oldValue &&
        !RegExp('^[-0-9,.]+$').test(newValue)
      ) {
        this.$nextTick(() => {
          this.userValue = oldValue
        })
      }
    },
  },
  mounted() {
    this.load(this.value)
  },
  methods: {
    focus(e) {
      e.srcElement.select()
    },
    keyDown(e) {
      if (
        ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(
          e.key
        ) ||
        e.metaKey ||
        e.ctrlKey
      ) {
        return
      }
      if (e.key === '-') {
        e.preventDefault()
        if (this.negative) {
          if (this.userValue[0] === '-') {
            this.userValue = this.userValue.slice(1)
          } else {
            this.userValue = `-${this.userValue}`
          }
        }
        return
      }
      const isCommaKey = ['.', ','].includes(e.key) || e.code === 'Period'
      if (this.userValue.includes(',')) {
        if (isCommaKey) {
          e.preventDefault()
          return
        }
        if (e.srcElement.selectionStart === e.srcElement.selectionEnd) {
          const fromSelectionToEnd =
            this.userValue.length - e.srcElement.selectionStart
          const fromPointToEnd =
            this.userValue.length - this.userValue.lastIndexOf(',') - 1
          const fromPointToSelection = fromPointToEnd - fromSelectionToEnd
          if (
            fromPointToSelection >= 0 &&
            (fromPointToEnd >= 2 ||
              fromSelectionToEnd + fromPointToSelection >= 2)
          ) {
            e.preventDefault()
            return
          }
        }
      }
      if (!RegExp('[0-9]').test(e.key)) {
        e.preventDefault()
      }
      if (isCommaKey) {
        const position = e.srcElement.selectionStart
        this.userValue = [
          this.userValue.slice(0, position),
          ',',
          this.userValue.slice(position),
        ].join('')
      }
    },
    update() {
      let numberValue = this.formatStringToFloat(this.userValue)
      if (!numberValue) {
        numberValue = 0
      }
      if (this.min !== false && numberValue < this.min) {
        numberValue = this.min
      }
      if (this.max !== false && numberValue > this.max) {
        numberValue = this.max
      }
      this.load(numberValue)
      this.$emit('input', numberValue)
    },
    load(value) {
      this.userValue = this.formatNumber(
        value,
        2,
        this.thousandDelimiter,
        this.decimalDelimiter
      )
    },
    /**
     * Create number string from formatted currency string
     *
     * The method converts german formatted number string to strings in order to can parse this
     * string to float. The method only works for german numbers like 1.000,00 or 1000,00
     *
     * @param {string|number} input
     *
     * @return {number}
     */
    formatStringToFloat(input) {
      return parseFloat(
        +`${input}`.replace(/[^-0-9,]/g, '').replace(/,/g, '.'),
        2
      ).toFixed(2)
    },
    /**
     * Format string or number to special number format
     *
     * Solution found at:
     * http://www.josscrowcroft.com/2011/code/format-unformat-money-currency-javascript/
     *
     * @param {string|float} argNumber
     * @param {string|int} argPlaces
     * @param {string} argThousand
     * @param {string} argDecimal
     *
     * @return {string}
     */
    formatNumber(argNumber, argPlaces, argThousand, argDecimal) {
      let number = argNumber || 0
      const absPlace = Math.abs(argPlaces)
      const places = !Number.isNaN(absPlace) ? absPlace : 2
      const thousand = argThousand || this.decimalDelimiter
      const decimal = argDecimal || this.thousandDelimiter
      const negative = number < 0 ? '-' : ''
      const i = `${parseInt(
        (number = Math.abs(+number || 0).toFixed(places)),
        10
      )}`
      let j = i.length
      j = j > 3 ? j % 3 : 0
      return (
        negative +
        (j ? i.substr(0, j) + thousand : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousand}`) +
        (places
          ? decimal +
            Math.abs(number - i)
              .toFixed(places)
              .slice(2)
          : '')
      )
    },
  },
}
</script>
