<template>
  <div class="space-y-2">
    <div
      v-for="style in getStyles(value)"
      :key="style.id"
      class="flex items-center"
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
    <t-rich-select
      v-model="newStyleName"
      placeholder="Add dance style"
      :options="getAllStyles()"
      @change="add()"
    />
  </div>
</template>

<script>
import useStyles from '~/use/styles'

export default {
  name: 'TInputStylesSelect2',
  setup(props) {
    const { getStyles, levels, getAllStyles } = useStyles()

    return {
      levels,
      getStyles,
      getAllStyles
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
    newStyleName: ''
  }),
  methods: {
    add() {
      const val = this.value

      val[this.newStyleName] = {
        selected: true,
        level: 'Interested'
      }

      this.$emit('input', val)

      this.newStyleName = ''
    },
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
