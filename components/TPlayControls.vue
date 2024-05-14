<template>
  <div
    class="px-2 py-1 text-sm flex items-center gap-2 cursor-pointer"
    :class="{ 'text-gray-500': locked, 'font-bold bg-gray-100': isActive }"
  >
    <LockClosedIcon v-if="locked" class="w-4 h-4" />
    <PauseIcon v-else-if="isActive" class="w-4 h-4" />
    <PlayIcon v-else class="w-4 h-4" />
    <div class="flex-grow">{{ title }}</div>
    <div v-if="duration" class="text-xs font-mono">{{ duration }} min</div>
  </div>
</template>

<script>
import { PauseIcon, PlayIcon, LockClosedIcon } from '@vue-hero-icons/outline'

export default {
  components: {
    PlayIcon,
    PauseIcon,
    LockClosedIcon,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    current: {
      type: String,
      default: '',
    },
    videoId: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    locked: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isActive() {
      return this.current === this.videoId
    },
  },
}
</script>
