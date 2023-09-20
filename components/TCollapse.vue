<template>
  <div class="border-t border-b py-4">
    <div class="cursor-pointer flex" @click="expandedValue = !expandedValue">
      <TIcon v-if="expandedValue" name="arrow_up" size="8" />
      <TIcon v-else name="arrow_right" size="8" />
      <h4 class="font-bold text-xl">{{ title }}</h4>
    </div>
    <div v-if="expandedValue">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    expanded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expandedValue: this.expanded,
    }
  },
}
</script>
