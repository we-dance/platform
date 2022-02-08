<template>
  <div v-if="item.hideReactions"></div>
  <div v-else class="flex flex-wrap gap-2 items-center">
    <TReaction
      :label="$t('TReaction.watch')"
      toggled-label="Watching"
      field="watch"
      icon="EyeIcon"
      :item="item"
    />
    <TStars :item="item" />
    <div class="text-xs text-gray-500">{{ item.viewsCount }} views</div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
}
</script>
