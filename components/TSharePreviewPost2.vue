<template>
  <div>
    <div id="canvas" class="relative leading-none font-lato">
      <img
        v-if="photo"
        :src="photo"
        :alt="centerTitle || bottomTitle"
        class="w-full"
      />
      <div v-else class="square bg-indigo-500"></div>

      <div
        class="absolute h-full w-full top-0 p-4 text-white flex flex-col bg-gradient-to-t from-black to-transparent"
      >
        <div class="absolute">
          <slot name="top" />
        </div>
        <div class="flex-grow-0 flex flex-col items-end">
          <div
            v-if="type"
            class="uppercase py-2 px-4 -mr-4 text-sm font-bold"
            :class="labelColor"
          >
            {{ type }}
          </div>
          <div v-if="dances" class="mt-2 text-shadow-md text-right space-y-2">
            <div
              v-for="dance in dances"
              :key="dance.id"
              class="uppercase text-xs flex space-x-2 justify-end items-center"
            >
              <span>{{ dance.name }}</span
              ><TIcon :name="getIcon(dance.level)" size="4" />
            </div>
          </div>
          <slot name="right" />
        </div>
        <div class="flex-grow text-center flex items-center justify-center">
          <div class="px-8">
            <div
              v-if="centerTitle"
              class="text-xl font-bold leading-tight"
              :class="size === 'lg' ? 'md:text-3xl' : ''"
            >
              {{ centerTitle }}
            </div>
            <div
              v-if="centerDescription"
              class="hidden md:block text-lg leading-tight mt-4"
            >
              {{ centerDescription }}
            </div>
          </div>
        </div>
        <div class="flex-grow-0">
          <div v-if="bottomTitle" class="text-lg font-bold leading-tight">
            {{ bottomTitle }}
          </div>
          <div v-if="bottomDescription" class="text-sm leading-tight mb-1">
            {{ bottomDescription }}
          </div>
          <div class="flex justify-between items-end">
            <div v-if="username" class="flex items-center">
              <TIcon class="w-4 h-4 mr-1" name="icon" />
              <div class="text-sm font-bold">{{ username }}</div>
            </div>
            <TButtonLike v-if="likes !== false" :count="likes" :value="true" />
            <div v-if="color" :class="color" class="rounded-full w-2 h-2"></div>
            <div v-if="extra" class="text-sm">{{ extra }}</div>
            <div
              v-if="objective"
              class="bg-primary text-sm font-bold text-white rounded-full px-4 py-2 leading-none"
            >
              {{ objective }}
            </div>
            <slot name="bottom" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useApp } from '~/use/app'
import { useStyles } from '~/use/styles'
import { getLabel } from '~/utils'

export default {
  setup(props) {
    const { getStyles } = useStyles()
    const { getPosterLabelColor } = useApp()
    const labelColor = getPosterLabelColor(props.collection, props.type)

    return { getStyles, labelColor, getLabel }
  },
  props: {
    collection: {
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
    centerTitle: {
      type: String,
      default: '',
    },
    centerDescription: {
      type: String,
      default: '',
    },
    bottomTitle: {
      type: String,
      default: '',
    },
    bottomDescription: {
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
      return this.getStyles(this.styles, 0, true, 5)
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
