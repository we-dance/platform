<template>
  <div>
    <WYoutube :url="application.video" />

    <div class="flex justify-center items-center pt-4">
      <button class="bg-gray-100 p-2" @click="votes--">
        <MinusIcon class="w-4" />
      </button>

      <div class="flex flex-nowrap bg-gray-200 p-2">
        <ThumbUpIcon class="w-4" />
        <span>{{ votes }}</span>
      </div>

      <button class="bg-gray-100 p-2" @click="votes++">
        <PlusIcon class="w-4" />
      </button>
    </div>
  </div>
</template>

<script>
import { ThumbUpIcon, PlusIcon, MinusIcon } from '@vue-hero-icons/outline'

export default {
  components: {
    ThumbUpIcon,
    PlusIcon,
    MinusIcon,
  },
  props: {
    application: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      votes: 0,
    }
  },
}
</script>
