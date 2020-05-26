<template>
  <div class="relative">
    <div ref="btn" @click="show = !show">
      <slot name="button" />
    </div>
    <div
      v-if="show"
      class="absolute border right-0 text-left -mt-1 w-32 py-2 bg-white rounded-lg shadow-xl z-30"
      :class="position === 'top' ? 'bottom-0 mb-12' : ''"
    >
      <slot name="menu" :closeMenu="closeMenu" />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: false,
    position: 'bottom'
  }),
  watch: {
    $route() {
      this.show = false
    },
    show() {
      const isTop =
        this.$refs.btn.getBoundingClientRect().top > window.innerHeight / 2

      this.position = isTop ? 'top' : 'bottom'
    }
  },
  methods: {
    closeMenu() {
      this.show = false
    }
  }
}
</script>
