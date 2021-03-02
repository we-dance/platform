<template>
  <div class="space-y-2">
    <div v-for="style in styles" :key="style.id" class="flex items-center">
      <div class="w-1/2">
        {{ style.name }}
      </div>
      <TInputSelect
        :options="levels"
        :value.sync="style.level"
        @input="(val) => setLevel(style.id, val)"
      />
      <TButton
        icon="close"
        type="icon"
        class="ml-1"
        @click="remove(style.id)"
      />
    </div>
    <t-rich-select
      v-model="newStyleName"
      placeholder="Add dance style"
      :options="getAllStyles()"
      @change="setLevel(newStyleName, 'Interested')"
    />
  </div>
</template>

<script>
import Vue from 'vue'
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
  computed: {
    styles() {
      return this.getStyles(this.value)
    }
  },
  methods: {
    remove(styleId) {
      const val = this.value

      Vue.delete(val, styleId)

      this.$emit('input', val)
    },
    setLevel(styleId, level) {
      if (!styleId || !level) {
        return
      }

      const val = this.value

      Vue.set(val, styleId, {
        selected: true,
        level
      })

      this.$emit('input', val)

      this.newStyleName = ''
    }
  }
}
</script>
