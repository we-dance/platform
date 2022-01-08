<template>
  <div class="inline-flex border rounded divide-x items-center">
    <div>
      <TReaction
        label="Star"
        toggledLabel="Starred"
        field="star"
        icon="StarIcon"
        class="border-none"
        :item="item"
      />
    </div>
    <div>
      <TButton type="xs" class="border-none" @click="showDropdown = true">
        <ChevronDownIcon class="w-3 h-3" />
      </TButton>
      <div class="border rounded p-4 absolute text-xs mt-1">
        Create a list
      </div>
    </div>
  </div>
</template>

<script>
import { ChevronDownIcon } from '@vue-hero-icons/outline'

export default {
  components: {
    ChevronDownIcon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    showDropdown: false,
  }),
}
</script>
