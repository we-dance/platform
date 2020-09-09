<template>
  <div
    ref="wrapper"
    class="absolute w-full h-full top-0 left-0 flex items-end md:items-center justify-center"
  >
    <div
      class="fixed w-full h-full top-0 left-0 bg-black opacity-50 z-40"
      @click="$emit('close')"
    ></div>
    <transition appear name="slide-up">
      <div
        class="bg-white p-4 rounded w-full md:w-auto z-50 overflow-hidden flex justify-center items-center"
      >
        <div>
          <div v-if="title" class="flex justify-between border-b pb-2">
            <div class="font-bold">{{ title }}</div>
            <button
              v-if="!noClose"
              class="cursor-pointer"
              @click="$emit('close')"
            >
              <TIcon name="close" class="cursor-pointer w-4 h-4" />
            </button>
          </div>

          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    noClose: {
      type: Boolean,
      default: false
    },
    noScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (!this.noScroll) {
      document.documentElement.scrollTop = 0
      const el = document.getElementsByTagName('body')[0]
      el.classList.add('overflow-y-hidden')
    }
  },
  beforeDestroy() {
    if (!this.noScroll) {
      const el = document.getElementsByTagName('body')[0]
      el.classList.remove('overflow-y-hidden')
    }
  }
}
</script>

<style></style>
