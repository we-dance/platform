<template>
  <div :class="`w-${dim} h-${dim}`">
    <TIcon
      v-if="!src"
      name="undraw_profile_pic"
      :class="`rounded-full w-${dim} h-${dim}`"
    />
    <img v-else :class="`rounded-full w-full`" :src="src" />
  </div>
</template>

<script>
export default {
  name: 'TProfilePhoto2',
  props: {
    src: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
  },
  computed: {
    dim() {
      const sizes = {
        xs: 4,
        sm: 6,
        md: 8,
        lg: 10,
        xl: 32,
        '2xl': 64,
      }

      return sizes[this.size]
    },
  },
}
</script>
