<template>
  <div>
    <div
      id="canvas"
      class="relative leading-none font-lato"
      :style="`width: ${size}px; height: ${size}px;`"
    >
      <TCover :width="size" :height="size" :src="photo" />
      <div
        class="relative p-8 text-white flex flex-col bg-gradient-to-t from-black via-transparent to-transparent"
        :style="`margin-top: -${size}px; width: ${size}px; height: ${size}px;`"
      >
        <div class="flex-grow-0 flex flex-col items-end">
          <div
            class="uppercase py-4 px-8 -mr-8 text-4xl font-bold"
            :class="labelColor"
          >
            {{ type }}
          </div>
          <div class="mt-8 text-shadow-md text-right space-y-2">
            <div
              v-for="dance in dances"
              :key="dance.id"
              class="uppercase text-3xl flex space-x-2 justify-end items-center"
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
          <div class="flex justify-between items-end">
            <div class="flex items-center mt-4">
              <div v-if="collection === 'events'">
                <div v-if="claimed === 'Yes'" class="mr-4 text-2xl">
                  Organised by
                </div>
                <div v-if="claimed === 'No'" class="mr-4 text-2xl">
                  Promoted by
                </div>
              </div>
              <TIcon class="w-8 h-8 mr-2" name="icon" />
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
