<template>
  <img
    v-if="profile.photo"
    :class="`rounded-full w-${dim} h-${dim}`"
    :src="profile.photo"
  />
  <TIcon
    v-else
    name="undraw_profile_pic"
    :class="`rounded-full w-${dim} h-${dim}`"
  />
</template>

<script>
import useProfiles from '~/use/profiles'

export default {
  name: 'TProfilePhoto',
  props: {
    uid: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'xs'
    }
  },
  computed: {
    dim() {
      const sizes = {
        xs: 4,
        sm: 6,
        md: 8,
        lg: 10,
        xl: 32
      }

      return sizes[this.size]
    }
  },
  setup(props) {
    const { getProfile } = useProfiles()

    const profile = getProfile(props.uid)

    return {
      profile
    }
  }
}
</script>
