<template>
  <div class="space-y-2">
    <div
      v-for="style in styles"
      :key="style.id"
      class="flex items-center justify-between space-x-2 p-2 border rounded"
    >
      <TButton
        v-if="!hideHighlight"
        icon="favorite"
        type="icon"
        :class="style.highlighted ? 'text-primary' : 'text-gray-500'"
        @click="setLevel(style.id, !style.highlighted, style.level)"
      />
      <div class="flex-grow">
        {{ style.name }}
      </div>
      <TInputSelect
        :options="levels"
        :value.sync="style.level"
        @input="(val) => setLevel(style.id, !!style.highlighted, val)"
      />
      <TButton
        icon="delete"
        type="icon"
        class="pr-2"
        @click="remove(style.id)"
      />
    </div>
    <t-rich-select
      v-model="newStyleName"
      placeholder="Add dance style"
      :fetch-options="findStyles"
      @change="add(newStyleName)"
    />
  </div>
</template>

<script>
import Vue from 'vue'
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
    hideHighlight: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    newStyleName: '',
  }),
  computed: {
    styles() {
      return this.getStyles(this.value)
    },
  },
  methods: {
    remove(styleId) {
      const val = this.value

      Vue.delete(val, styleId)

      this.$emit('input', val)
    },
    add(styleId) {
      if (
        this.mineOnly &&
        this.profile?.styles &&
        this.profile.styles[styleId]
      ) {
        this.setLevel(styleId, false, this.profile.styles[styleId].level)
        return
      }

      this.setLevel(styleId, false, 'Interested')
    },
    setLevel(styleId, highlighted, level) {
      if (!styleId || !level) {
        return
      }

      const val = this.value || {}

      Vue.set(val, styleId, {
        selected: true,
        highlighted,
        level,
      })

      this.$emit('input', val)

      this.newStyleName = ''
    },
  },
}
</script>
