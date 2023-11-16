<template>
  <div :class="expandedValue ? '' : 'h-20 overflow-y-hidden relative'">
    <slot />
    <TButton
      v-if="!expanded"
      allow-guests
      :label="expandedValue ? hide : show"
      type="link"
      class="text-sm text-primary"
      :class="
        expandedValue
          ? ''
          : 'absolute inset-0 pt-16 text-center bg-gradient-to-b from-transparent to-white'
      "
      @click="expandedValue = !expandedValue"
    />
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: String,
      default: 'Show more',
    },
    hide: {
      type: String,
      default: 'Show less',
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
