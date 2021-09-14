<template>
  <div class="relative" @mouseover="onHover(true)" @mouseleave="onHover(false)">
    <div ref="btn" @click="onClick">
      <slot name="button" />
    </div>
    <div
      v-if="show"
      class="fixed w-full h-full top-0 left-0 bg-black opacity-0 z-40"
      @click="closeMenu"
    ></div>
    <div v-if="show" class="absolute text-left z-50" :class="classes">
      <slot name="menu" :closeMenu="closeMenu" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hover: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    show: false,
    isTop: true,
    isLett: true,
  }),
  computed: {
    classes() {
      let result

      result += this.isTop ? '' : ' bottom-0'
      result += this.isLeft ? ' left-0' : ' right-0'

      return result
    },
  },
  watch: {
    $route() {
      this.show = false
    },
    show() {
      this.isTop =
        this.$refs.btn.getBoundingClientRect().top < window.innerHeight / 2

      this.isLeft =
        this.$refs.btn.getBoundingClientRect().left < window.innerWidth / 2
    },
  },
  methods: {
    closeMenu() {
      this.show = false
      this.$emit('close')
    },
    onClick() {
      if (!this.hover) {
        this.show = !this.show
      }
    },
    onHover(val) {
      if (this.hover) {
        this.show = val
      }
    },
  },
}
</script>
