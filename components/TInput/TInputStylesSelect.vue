<template>
  <div>
    <div
      v-for="style in getStyles(value)"
      :key="style.id"
      class="flex mb-2 items-center"
    >
      <div class="w-1/2">
        {{ style.name }}
      </div>
      <TInputSelect
        :options="levels"
        :value.sync="style.level"
        @input="(val) => setLevel(style.id, val)"
      />
    </div>
    <TButton @click="showPopup = true">Change styles</TButton>
    <TPopup v-if="showPopup" title="Select styles" @close="showPopup = false">
      <TInputStyles
        class="max-w-md mx-auto h-64 overflow-y-scroll"
        :value.sync="value"
        @input="(val) => $emit('input', val)"
      />
    </TPopup>
  </div>
</template>

<script>
import useStyles from '~/use/styles'

export default {
  name: 'TInputStylesSelect',
  setup(props) {
    const { getStyles, levels } = useStyles()

    return {
      levels,
      getStyles
    }
  },
  props: {
    value: {
      type: [Object, String],
      default: () => ({})
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    showPopup: false
  }),
  methods: {
    setLevel(styleId, level) {
      if (!level) {
        return
      }

      const val = this.value

      val[styleId].level = level

      this.$emit('input', val)
    }
  }
}
</script>
