<template>
  <div class="flex items-center">
    <div v-if="photo">
      <router-link v-if="noHover" :to="`/u/${profile.username}`">
        <img
          v-if="profile.photo"
          :class="`rounded-full mr-2 w-${size} h-${size}`"
          :src="profile.photo"
        />
        <div
          v-else
          :class="`rounded-full mr-2 w-${size} h-${size} bg-orange-500`"
        ></div>
      </router-link>
      <TMenu v-else hover>
        <template v-slot:button>
          <router-link :to="`/u/${profile.username}`">
            <img
              v-if="profile.photo"
              :class="`rounded-full mr-2 w-${size} h-${size}`"
              :src="profile.photo"
            />
            <div
              v-else
              :class="`rounded-full mr-2 w-${size} h-${size} bg-orange-500`"
            ></div>
          </router-link>
        </template>
        <template v-slot:menu>
          <TCardProfile class="w-64" :uid="uid" />
        </template>
      </TMenu>
    </div>
    <div v-if="name">
      <router-link class="hover:underline" :to="`/u/${profile.username}`">
        {{ profile.username }}
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
    },
    noHover: {
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
  setup(props) {
    const { getProfile } = useProfiles()

    const profile = getProfile(props.uid)

    return {
      profile
    }
  }
}
</script>
