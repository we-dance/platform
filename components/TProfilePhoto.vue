<template>
  <TIcon
    v-if="loading || !photo"
    name="undraw_profile_pic"
    :class="`rounded-full w-${dim} h-${dim}`"
  />
  <img v-else :class="`rounded-full w-${dim} h-${dim}`" :src="photo" />
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import { useProfiles } from '~/use/profiles'

export default {
  name: 'TProfilePhoto',
  props: {
    uid: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'xs',
    },
  },
  computed: {
    photo() {
      return this.profile?.photo
    },
    dim() {
      const sizes = {
        xs: 4,
        sm: 6,
        md: 8,
        lg: 10,
        xl: 32,
      }

      return sizes[this.size]
    },
  },
  setup(props) {
    const { getProfile, loading } = useProfiles()

    const profile = computed(() => getProfile(props.uid))

    return {
      profile,
      loading,
    }
  },
}
</script>
