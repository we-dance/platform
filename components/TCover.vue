<template>
  <div>
    <div class="bg-gray-900" :style="`width: ${width}px; height: ${height}px;`">
      <img v-if="src" :src="src" class="w-full" alt="Cover photo" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TImageInstagram',
  props: {
    src: {
      type: String,
      default: '',
    },
    fallback: {
      type: String,
      default: 'undraw_profile_pic',
    },
    width: {
      type: Number,
      default: 1024,
    },
    height: {
      type: Number,
      default: 1024,
    },
  },
}
</script>
