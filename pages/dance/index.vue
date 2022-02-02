<template>
  <div>
    <div class="typo p-4">
      <h1>Dance Styles</h1>
      <div>
        <a
          href="https://docs.google.com/spreadsheets/d/1oCLW_c_Jr021AT6_gGngtFB94P_5ftSCJGp-XqdvRaM/edit#gid=0"
          target="_blank"
          >Edit this page</a
        >
      </div>
    </div>
    <div class="text-center">
      <div v-for="category in categories" :key="category" class="mb-4">
        <h4 class="font-bold text-lg">{{ category }}</h4>
        <div class="text-center">
          <NuxtLink
            v-for="style in subStyles(category)"
            :key="style.id"
            :class="{ 'bg-primary text-white': contains(style.id) }"
            class="rounded px-2 py-1 border m-1 inline-block cursor-pointer"
            :to="`/dance/${style.id}`"
          >
            <span>{{ style.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStyles } from '~/use/styles'

export default {
  name: 'TInputStyles',
  setup() {
    const { styles, categories } = useStyles()

    return {
      styles,
      categories,
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
  },
  data: () => ({
    showPopup: false,
  }),
  methods: {
    subStyles(category) {
      return this.styles.filter(
        (item) =>
          item && item.region && item.region === category && item.root === 'yes'
      )
    },
    children(parentName) {
      return this.styles.filter(
        (item) =>
          item &&
          item.family &&
          item.family === parentName &&
          parentName !== item.name
      )
    },
    contains(val) {
      if (!this.value) {
        return false
      }
      return this.value[val]
    },
    trigger(val) {
      const newValue = { ...this.value }

      if (newValue[val]?.selected) {
        for (const item of this.children(val)) {
          delete newValue[item.id]
        }

        delete newValue[val]
      } else {
        newValue[val] = {
          selected: true,
          level: 'Interested',
        }
      }

      this.$emit('input', newValue)
    },
  },
}
</script>
