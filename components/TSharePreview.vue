<template>
  <div>
    <div
      id="canvas"
      class="relative font-lato leading-none"
      :style="`width: ${size}px; height: ${size}px;`"
    >
      <TCover :width="size" :height="size" :src="photo" />
      <div
        class="relative flex flex-col bg-gradient-to-t from-black via-transparent to-transparent p-8 text-white"
        :style="`margin-top: -${size}px; width: ${size}px; height: ${size}px;`"
      >
        <div class="flex flex-grow-0 flex-col items-end">
          <div
            class="-mr-8 py-4 px-8 text-4xl font-bold uppercase"
            :class="labelColor"
          >
            {{ type }}
          </div>
          <div class="text-shadow-md mt-8 space-y-2 text-right">
            <div
              v-for="dance in dances"
              :key="dance.id"
              class="flex items-center justify-end space-x-2 text-3xl uppercase"
            >
              <span>{{ dance.name }}</span
              ><TIcon :name="getIcon(dance.level)" size="8" />
            </div>
          </div>
        </div>
        <div class="flex-grow"></div>
        <div class="flex-grow-0">
          <div v-if="title" class="text-5xl font-bold leading-none">
            {{ title }}
          </div>
          <div class="text-3xl leading-normal">
            {{ description }}
          </div>
          <div class="flex items-end justify-between">
            <div class="mt-4 flex items-center">
              <div v-if="collection === 'events'">
                <div v-if="claimed === 'Yes'" class="mr-4 text-2xl">
                  Organised by
                </div>
                <div v-if="claimed === 'No'" class="mr-4 text-2xl">
                  Promoted by
                </div>
              </div>
              <TIcon class="mr-2 h-8 w-8" name="icon" />
              <div class="text-4xl font-bold">{{ username }}</div>
              <div class="ml-2 text-2xl">on www.wedance.vip</div>
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
    claimed: {
      type: String,
      default: '',
    },
    collection: {
      type: String,
      default: '',
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
    price: {
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
      type: Number,
      default: 1080,
    },
    styles: {
      type: Object,
      default: () => ({}),
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
