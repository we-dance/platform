<template>
  <div :class="expanded ? '' : 'h-20 overflow-hidden relative'">
    <slot />
    <TButton
      :label="expanded ? hide : show"
      type="link"
      class="text-sm text-primary"
      :class="
        expanded
          ? ''
          : 'absolute inset-0 w-full pt-16 text-center bg-gradient-to-b from-transparent to-white'
      "
      @click="expanded = !expanded"
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
  },
  data: () => ({
    expanded: false,
  }),
}
</script>
