<template>
  <div class="p-4">
    <div class="mb-4">
      Actions
    </div>
    <div>
      <TReaction
        label="Star"
        toggledLabel="Starred"
        field="star"
        icon="StarIcon"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
