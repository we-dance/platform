<template>
  <div>
    <slot />
    <NuxtLink
      v-for="style in getStyles(value, 0, false, max)"
      :key="style.id"
      :to="`/dance/${style.id}`"
      :class="getClasses(style)"
    >
      {{ style.name
      }}<span v-if="style.level && style.level !== 'Interested' && !hideLevel">
        – {{ style.level }}</span
      >
    </NuxtLink>
  </div>
</template>

<script>
import { useStyles } from '~/use/styles'

export default {
  setup() {
    const { getStyles } = useStyles()

    return {
      getStyles,
    }
  },
  props: {
    value: {
      type: [Object, String],
      default: () => ({}),
    },
    hideLevel: {
      type: Boolean,
      default: false,
    },
    noColor: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: 0,
    },
    wrapperClass: {
      type: String,
      default: 'inline-block rounded-full px-2 py-1 border m-1',
    },
  },
  data: () => ({
    levelClass: {
      Interested: '',
      Beginner: 'text-green-500',
      Intermediate: 'text-orange-500',
      Advanced: 'text-red-500',
    },
  }),
  methods: {
    getClasses(style) {
      let result = ''

      if (!this.noColor) {
        result = this.levelClass[style.level]

        if (style.highlighted) {
          result += ' font-bold'
        }
      }

      result += ' ' + this.wrapperClass

      return result
    },
  },
}
</script>
