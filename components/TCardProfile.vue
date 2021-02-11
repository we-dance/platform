<template>
  <div class="rounded border shadow p-4 bg-white">
    <div class="flex items-center">
      <router-link
        :to="`/${profile.username}`"
        class="text-sm flex items-center flex-grow mr-2"
      >
        <TProfilePhoto size="lg" :uid="uid" class="mr-2" />
        <div>
          <div>
            <span class="font-bold">{{ profile.name }}</span>
            <span v-if="profile.height" class="text-xs"
              >• {{ profile.height }}cm</span
            >
            <span v-if="profile.weight" class="text-xs"
              >• {{ profile.weight }}kg</span
            >
          </div>
          <div class="text-gray-600">@{{ profile.username }}</div>
        </div>
      </router-link>

      <TProfileContact :uid="uid" />
    </div>
    <div class="text-sm mt-2">
      <dl v-if="profile.bio" class="mt-2">
        <dt class="font-bold mr-1">About me:</dt>
        <dd></dd>
        <dd>{{ profile.bio }}</dd>
      </dl>
      <dl v-if="profile.styles" class="mt-1">
        <dt class="font-bold mr-1">Dance styles:</dt>
        <dd v-if="profile.styles"><TStyles :value="profile.styles" /></dd>
      </dl>
      <dl v-else-if="profile.skills" class="mt-1">
        <dt class="font-bold mr-1">Dance styles:</dt>
        <dd>{{ profile.skills }}</dd>
      </dl>
      <dl v-if="profile.languages" class="mt-2">
        <dt class="font-bold mr-1">My languages:</dt>
        <dd>{{ profile.languages }}</dd>
      </dl>
      <dl
        v-if="profile.partner === 'Yes'"
        class="mt-2 bg-primary text-white px-2 py-1 rounded-full"
      >
        <dt class="font-bold mr-1">I am looking for partner</dt>
      </dl>
      <dl v-if="profile.partnerBio" class="mt-2">
        <dt class="font-bold mr-1">About my partner:</dt>
        <dd>{{ profile.partnerBio }}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { getDateTime } from '~/utils'
import useProfiles from '~/use/profiles'

export default {
  name: 'TCardProfile',
  props: {
    uid: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { getProfile } = useProfiles()
    const profile = getProfile(props.uid)

    return {
      getProfile,
      getDateTime,
      profile
    }
  }
}
</script>
