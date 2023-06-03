<template>
  <div class="border-t border-b py-4">
    <div class="cursor-pointer flex" @click="expanded = !expanded">
      <TIcon v-if="expanded" name="arrow_up" size="8" />
      <TIcon v-else name="arrow_right" size="8" />
      <h4 class="font-bold text-xl">{{ title }}</h4>
    </div>
    <div v-if="expanded">
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
  },
  data: () => ({
    expanded: false,
  }),
}
</script>
