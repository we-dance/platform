<template>
  <div
    class="relative leading-none font-lato"
    :style="`width: ${size}px; height: ${size}px;`"
  >
    <TCover :width="size" :height="size" :src="profile.photo" />
    <div
      class="relative p-8 text-real-white flex flex-col bg-gradient-to-t from-black via-transparent to-transparent"
      :style="`margin-top: -${size}px; width: ${size}px; height: ${size}px;`"
    >
      <div class="flex-grow-0 flex flex-col items-end">
        <div class="uppercase py-2 px-8 -mr-8 text-5xl bg-green-500 font-bold">
          Dancer
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
        <div class="text-3xl leading-normal">
          {{ profile.bio }}
        </div>
        <div class="flex items-center mt-4">
          <TIcon class="w-8 h-8 mr-2" name="icon" />
          <div class="text-4xl font-bold">{{ profile.username }}</div>
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
    profile: {
      type: Object,
      default: () => ({})
    },
    size: {
      type: Number,
      default: 1080
    }
  },
  computed: {
    dances() {
      return this.getStyles(this.profile.styles, 0, true, 5)
    }
  }
}
</script>
