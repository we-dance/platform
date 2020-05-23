<template>
  <div class="relative">
    <div @click="show = !show">
      <slot name="button" />
    </div>
    <div
      v-if="show"
      class="absolute border right-0 text-left -mt-1 w-32 py-2 bg-white rounded-lg shadow-xl z-30"
    >
      <slot name="menu" :closeMenu="closeMenu" />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: false
  }),
  methods: {
    closeMenu() {
      this.show = false
    }
  }
}
</script>
