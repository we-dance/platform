<template>
  <div>
    <div id="canvas" class="relative leading-none font-lato overflow-hidden">
      <img v-if="photo" :src="photo" :alt="title" class="absolute w-full" />
      <div class="square bg-indigo-500"></div>

      <div
        class="absolute h-full w-full top-0 p-4 text-white flex flex-col bg-gradient-to-t from-black to-transparent"
      >
        <div class="flex-grow-0 flex flex-col items-end">
          <div
            v-if="type"
            class="uppercase py-2 px-4 -mr-4 text-sm font-bold"
            :class="labelColor"
          >
            {{ type }}
          </div>
          <div class="mt-2 text-shadow-md text-right space-y-2">
            <div
              v-for="dance in dances"
              :key="dance.id"
              class="uppercase text-xs flex space-x-2 justify-end items-center"
            >
              <span>{{ dance.name }}</span>
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
              <div v-if="collection === 'events'">
                <div v-if="claimed === 'Yes'" class="mr-2 text-sm">
                  Organised by
                </div>
                <div v-if="claimed === 'No'" class="mr-2 text-sm">
                  Promoted by
                </div>
              </div>
              <TIcon class="w-4 h-4 mr-1" name="icon" />
              <div class="text-sm font-bold">{{ username }}</div>
            </div>
            <div v-if="color" :class="color" class="rounded-full w-2 h-2"></div>
            <div v-if="extra && collection !== 'events'" class="text-sm">
              {{ extra }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useApp } from '~/use/app'
import { useStyles } from '~/use/styles'

export default {
  setup(props) {
    const { getStyles } = useStyles()
    const { getPosterLabelColor } = useApp()
    const labelColor = getPosterLabelColor(props.collection, props.type)

    return { getStyles, labelColor }
  },
  props: {
    collection: {
      type: String,
      default: '',
    },
    claimed: {
      type: String,
      default: '',
    },
    align: {
      type: String,
      default: 'bottom',
    },
    likes: {
      type: [Number, Boolean],
      default: false,
    },
    type: {
      type: String,
      default: '',
    },
    username: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    extra: {
      type: String,
      default: '',
    },
    objective: {
      type: String,
      default: '',
    },
    photo: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'lg',
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
    color: {
      type: String,
      default: '',
    },
  },
  computed: {
    dances() {
      return this.getStyles(this.styles, 0, true, 3)
    },
  },
  methods: {
    getIcon(level) {
      const map = {
        Interested: '0_of_4',
        Beginner: '1_of_4',
        Intermediate: '2_of_4',
        Advanced: '3_of_4',
        Master: '4_of_4',
      }

      if (!map[level]) {
        return '0_of_4'
      }

      return map[level]
    },
  },
}
</script>
