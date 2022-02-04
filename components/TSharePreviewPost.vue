<template>
  <div>
    <div id="canvas" class="relative font-lato leading-none">
      <img v-if="photo" :src="photo" :alt="title" class="absolute w-full" />
      <div class="square bg-indigo-500"></div>

      <div
        class="absolute top-0 flex h-full w-full flex-col bg-gradient-to-t from-black to-transparent p-4 text-white"
      >
        <div class="flex flex-grow-0 flex-col items-end">
          <div
            v-if="type"
            class="-mr-4 py-2 px-4 text-sm font-bold uppercase"
            :class="labelColor"
          >
            {{ type }}
          </div>
          <div class="text-shadow-md mt-2 space-y-2 text-right">
            <div
              v-for="dance in dances"
              :key="dance.id"
              class="flex items-center justify-end space-x-2 text-xs uppercase"
            >
              <span>{{ dance.name }}</span
              ><TIcon :name="getIcon(dance.level)" size="4" />
            </div>
          </div>
        </div>
        <div class="flex flex-grow items-center justify-center text-center">
          <div v-if="align === 'center'" class="px-8">
            <div
              v-if="title"
              class="text-xl font-bold leading-tight"
              :class="size === 'lg' ? 'md:text-3xl' : ''"
            >
              {{ title }}
            </div>
            <div class="mt-4 hidden text-lg leading-tight md:block">
              {{ description }}
            </div>
          </div>
        </div>
        <div class="flex-grow-0">
          <template v-if="align === 'bottom'">
            <div v-if="title" class="text-lg font-bold leading-tight">
              {{ title }}
            </div>
            <div class="mb-1 text-sm leading-tight">
              {{ description }}
            </div>
          </template>
          <div class="flex items-end justify-between">
            <div class="flex items-center">
              <div v-if="collection === 'events'">
                <div v-if="claimed === 'Yes'" class="mr-2 text-sm">
                  {{ $t('events.post.organizer') }}
                </div>
                <div v-if="claimed === 'No'" class="mr-2 text-sm">
                   {{ $t('events.post.promoter') }}
                </div>
              </div>
              <TIcon class="mr-1 h-4 w-4" name="icon" />
              <div class="text-sm font-bold">{{ username }}</div>
            </div>
            <div v-if="color" :class="color" class="h-2 w-2 rounded-full"></div>
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
