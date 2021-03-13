<template>
  <div class="space-y-2">
    <div
      v-for="style in styles"
      :key="style.id"
      class="flex items-center justify-between space-x-2 p-2 border rounded"
    >
      <TButton
        icon="favorite"
        type="icon"
        :class="style.highlighted ? 'text-primary' : 'text-gray-500'"
        @click="setLevel(style.id, !style.highlighted, style.level)"
      />
      <div class="flex-grow">
        {{ style.name }}
      </div>
      <TMenu>
        <template v-slot:button>
          <TButton icon="more_vert" type="icon" />
        </template>
        <template v-slot:menu="{ closeMenu }">
          <div class="w-32 bg-white rounded-lg shadow-xl border">
            <div class="bg-gray-200 p-2 font-bold">Your Level</div>
            <TButton
              v-for="level in levels"
              :key="level.value"
              type="context"
              :class="{
                'font-bold': style.level === level.value
              }"
              @click="
                setLevel(style.id, style.highlighted, level.value)
                closeMenu()
              "
              >{{ level.label }}</TButton
            >
            <div class="border-t"></div>
            <TButton
              type="context"
              @click="
                remove(style.id)
                closeMenu()
              "
              >Remove</TButton
            >
          </div>
        </template>
      </TMenu>
    </div>
    <t-rich-select
      v-model="newStyleName"
      placeholder="Add dance style"
      :fetch-options="getAllStyles"
      @change="setLevel(newStyleName, false, 'Interested')"
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
    setLevel(styleId, highlighted, level) {
      if (!styleId || !level) {
        return
      }

      const val = this.value || {}

      Vue.set(val, styleId, {
        selected: true,
        highlighted,
        level
      })

      this.$emit('input', val)

      this.newStyleName = ''
    }
  }
}
</script>
