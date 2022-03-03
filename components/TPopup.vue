<template>
  <div
    ref="wrapper"
    class="fixed top-0 left-0 flex h-full w-full items-end justify-center md:items-center"
    style="z-index: 100"
  >
    <div
      class="fixed top-0 left-0 z-40 h-full w-full bg-black opacity-50"
      @click="$emit('close')"
    ></div>
    <transition appear name="slide-up">
      <div
        class="z-50 mt-4 flex max-h-screen w-full items-center justify-center overflow-y-scroll rounded bg-white px-4 md:w-auto"
      >
        <div class="w-full">
          <div
            v-if="title"
            class="sticky top-0 z-50 flex justify-between border-b bg-white pt-4 pb-2"
          >
            <div class="font-bold">{{ title }}</div>
            <button
              v-if="!noClose"
              class="cursor-pointer"
              @click="$emit('close')"
            >
              <TIcon name="close" class="h-4 w-4 cursor-pointer" />
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
      default: '',
    },
    noClose: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    const el = document.getElementsByTagName('body')[0]
    el.classList.add('overflow-y-hidden')
  },
  beforeDestroy() {
    const el = document.getElementsByTagName('body')[0]
    el.classList.remove('overflow-y-hidden')
  },
}
</script>
