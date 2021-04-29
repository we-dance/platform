<template>
  <div v-if="isDesktop">
    <div :class="desktopClass">
      <slot />
    </div>
  </div>
  <div v-else>
    <div
      class="fixed flex items-center justify-center bottom-0 right-0 mb-4 mr-4 shadow-lg bg-white text-primary rounded-full py-2 px-4 space-x-2 z-50"
      @click="isOpen = true"
    >
      <TIcon :name="icon" size="6" />
      <span class="text-dark">{{ title }}</span>
    </div>
    <TPopup v-if="isOpen" :title="title" @close="isOpen = false">
      <div class="py-4 h-64 overflow-y-scroll" :class="mobileClass">
        <slot />
      </div>
    </TPopup>
  </div>
</template>

<script>
import { useMediaQuery } from '@vueuse/core'
import { ref } from 'vue-demi'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    desktopClass: {
      type: String,
      default: ''
    },
    mobileClass: {
      type: String,
      default: ''
    }
  },
  setup() {
    const isOpen = ref(false)
    const isDesktop = useMediaQuery('(min-width: 800px)')

    return { isDesktop, isOpen }
  }
}
</script>
