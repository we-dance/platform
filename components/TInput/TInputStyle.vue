<template>
  <t-rich-select
    v-model="internalValue"
    clearable
    :placeholder="placeholder"
    :fetch-options="findStyles"
  />
</template>

<script>
import { useStyles } from '~/use/styles'
import { useAuth } from '~/use/auth'
import { search } from '~/utils'

export default {
  name: 'TInputStyle',
  setup(props) {
    const { getStyles, levels, getAllStyles, getStylesDropdown } = useStyles()
    const { profile } = useAuth()

    const findStyles = (q) => {
      if (props.styles) {
        return {
          results: getStylesDropdown(props.styles).filter((i) =>
            search(i.label, q)
          ),
        }
      }

      if (props.mineOnly) {
        return {
          results: getStylesDropdown(profile.value?.styles).filter((i) =>
            search(i.label, q)
          ),
        }
      }

      let filter = null

      if (!q && props.popularOnly) {
        filter = { popular: true }
      }

      return getAllStyles(q, filter, 'popularity')
    }

    return {
      profile,
      levels,
      getStyles,
      findStyles,
    }
  },
  props: {
    value: {
      type: [Object, String],
      default: () => ({}),
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    mineOnly: {
      type: Boolean,
      default: false,
    },
    popularOnly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    styles: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    newStyleName: '',
  }),
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
}
</script>
