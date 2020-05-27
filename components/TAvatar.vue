<template>
  <div class="flex items-center">
    <div v-if="photo">
      <router-link :to="`/u/${getProfile(uid).username}`">
        <img
          v-if="getProfile(uid).photo"
          :class="`rounded-full mr-2 w-${size} h-${size}`"
          :src="getProfile(uid).photo"
        />
        <div
          v-else
          :class="`rounded-full mr-2 w-${size} h-${size} bg-orange-500`"
        ></div>
      </router-link>
    </div>
    <div v-if="name">
      <router-link
        class="hover:underline"
        :to="`/u/${getProfile(uid).username}`"
      >
        {{ getProfile(uid).username }}
      </router-link>
    </div>
  </div>
</template>

<script>
import useProfiles from '~/use/profiles'

export default {
  props: {
    uid: {
      type: String,
      default: ''
    },
    photo: {
      type: Boolean,
      default: false
    },
    name: {
      type: Boolean,
      default: false
    },
    middle: {
      type: Boolean,
      default: false
    },
    big: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    size() {
      if (this.middle) {
        return 6
      }

      if (this.big) {
        return 10
      }

      return 4
    }
  },
  setup() {
    const { getProfile } = useProfiles()

    return {
      getProfile
    }
  }
}
</script>
