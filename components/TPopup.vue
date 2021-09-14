<template>
  <div
    ref="wrapper"
    class="fixed w-full h-full top-0 left-0 flex items-end md:items-center justify-center"
    style="z-index: 100"
  >
    <div
      class="fixed w-full h-full top-0 left-0 bg-black opacity-50 z-40"
      @click="$emit('close')"
    ></div>
    <transition appear name="slide-up">
      <div
        class="bg-white px-4 rounded w-full md:w-auto z-50 overflow-y-scroll mt-4 flex justify-center items-center max-h-screen"
      >
        <div class="w-full">
          <div
            v-if="title"
            class="flex bg-white justify-between border-b pt-4 pb-2 sticky top-0 z-50"
          >
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
