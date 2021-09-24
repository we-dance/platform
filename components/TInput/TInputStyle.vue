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
  name: 'TInputStylesSelect2',
  setup(props) {
    const { getStyles, levels, getAllStyles, getStylesDropdown } = useStyles()
    const { profile } = useAuth()

    const findStyles = (q) => {
      if (props.mineOnly) {
        return {
          results: getStylesDropdown(profile.value?.styles).filter((i) =>
            search(i.label, q)
          ),
        }
      }

      return getAllStyles(q)
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
    placeholder: {
      type: String,
      default: '',
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
