<template>
  <div>
    <div id="canvas" class="relative leading-none font-lato">
      <img v-if="photo" :src="photo" :alt="title" class="w-full" />
      <div v-else class="square bg-indigo-500"></div>

      <div
        class="absolute h-full w-full top-0 p-4 text-white flex flex-col bg-gradient-to-t from-black to-transparent"
      >
        <div class="flex-grow-0 flex flex-col items-end">
          <div
            v-if="type"
            class="uppercase py-2 px-4 -mr-4 text-sm bg-green-500 font-bold"
          >
            {{ type }}
          </div>
          <div class="mt-2 text-shadow-md text-right space-y-2">
            <div
              v-for="dance in dances"
              :key="dance.id"
              class="uppercase text-xs"
            >
              {{ dance.name }}
            </div>
          </div>
        </div>
        <div class="flex-grow text-center flex items-center justify-center">
          <div v-if="align === 'center'" class="px-8">
            <div
              v-if="title"
              class="text-xl font-bold leading-tight"
              :class="size === 'lg' ? 'md:text-3xl' : ''"
            >
              {{ title }}
            </div>
            <div class="hidden md:block text-lg leading-tight mt-4">
              {{ description }}
            </div>
          </div>
        </div>
        <div class="flex-grow-0">
          <template v-if="align === 'bottom'">
            <div v-if="title" class="text-lg font-bold leading-tight">
              {{ title }}
            </div>
            <div class="text-sm leading-tight mb-1">
              {{ description }}
            </div>
          </template>
          <div class="flex justify-between items-end">
            <div class="flex items-center">
              <TIcon class="w-4 h-4 mr-1" name="icon" />
              <div class="text-sm font-bold">{{ username }}</div>
            </div>
            <TButtonLike v-if="likes !== false" :count="likes" :value="true" />
            <div v-if="extra" class="text-sm">{{ extra }}</div>
            <div
              v-if="objective"
              class="bg-primary text-base font-bold text-white rounded-full px-4 py-2 leading-none"
            >
              {{ objective }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useStyles from '~/use/styles'

export default {
  setup() {
    const { getStyles } = useStyles()

    return { getStyles }
  },
  props: {
    align: {
      type: String,
      default: 'bottom'
    },
    likes: {
      type: [Number, Boolean],
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    extra: {
      type: String,
      default: ''
    },
    objective: {
      type: String,
      default: ''
    },
    photo: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'lg'
    },
    styles: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    dances() {
      return this.getStyles(this.styles, 0, true, 5)
    }
  }
}
</script>
