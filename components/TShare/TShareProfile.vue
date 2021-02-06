<template>
  <div>
    <div
      id="canvas"
      class="relative leading-none font-lato"
      :style="`width: ${size}px; height: ${size}px;`"
    >
      <TCover :width="size" :height="size" :src="photo" />
      <div
        class="relative p-8 text-real-white flex flex-col bg-gradient-to-t from-black via-transparent to-transparent"
        :style="`margin-top: -${size}px; width: ${size}px; height: ${size}px;`"
      >
        <div class="flex-grow-0 flex flex-col items-end">
          <div
            class="uppercase py-4 px-8 -mr-8 text-4xl bg-green-500 font-bold"
          >
            {{ type }}
          </div>
          <div class="mt-8 text-shadow-md text-right space-y-2">
            <div
              v-for="dance in dances"
              :key="dance.id"
              class="uppercase text-3xl"
            >
              {{ dance.name }}
            </div>
          </div>
        </div>
        <div class="flex-grow"></div>
        <div class="flex-grow-0">
          <div v-if="title" class="text-5xl font-bold leading-normal">
            {{ title }}
          </div>
          <div class="text-3xl leading-normal">
            {{ description }}
          </div>
          <div class="flex justify-between items-end">
            <div class="flex items-center mt-4">
              <TIcon class="w-8 h-8 mr-2" name="icon" />
              <div class="text-4xl font-bold">{{ username }}</div>
            </div>
            <div class="text-3xl">{{ price }}</div>
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
    price: {
      type: String,
      default: ''
    },
    photo: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 1080
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
