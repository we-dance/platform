<template>
  <div>
    <TIcon
      v-if="!src"
      :name="fallback"
      :style="`width: ${width}px; height: ${height}px;`"
    />
    <img v-else :src="src" :style="`width: ${width}px; height: ${height}px;`" />
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
