<template>
  <div class="rounded border shadow p-4 bg-white">
    <TPopup v-if="showPopup">
      <div class="flex justify-between border-b pb-2 mb-4">
        <div class="font-bold">Members only</div>
        <button class="cursor-pointer" @click="showPopup = false">
          <TIcon name="close" class="cursor-pointer w-4 h-4" />
        </button>
      </div>
      <div class="my-4 flex flex-col justify-center">
        <div>You need a profile to send requests</div>
        <TButton class="mt-2" to="/signin?target=/people"
          >Create Profile</TButton
        >
      </div>
    </TPopup>
    <div class="flex items-center">
      <router-link
        :to="`/u/${profile.username}`"
        class="text-sm flex items-center flex-grow mr-2"
      >
        <TProfilePhoto size="lg" :uid="uid" class="mr-2" />
        <div>
          <div>
            <span class="font-bold">{{ profile.name }}</span>
            <span v-if="profile.location" class="text-xs"
              >• {{ profile.location.locality }}</span
            >
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
      <TButton
        v-if="myUid"
        :href="
          `mailto:support@wedance.vip?subject=Dance Partner Request&body=Connect ${
            getProfile(myUid).username
          } and ${profile.username}`
        "
        >Send Request</TButton
      >
      <TButton v-else @click="showPopup = true">Send Request</TButton>
    </div>
    <div class="text-sm mt-2">
      <dl v-if="profile.bio" class="mt-2">
        <dt class="font-bold mr-1">About me:</dt>
        <dd></dd>
        <dd>{{ profile.bio }}</dd>
      </dl>
      <dl v-if="profile.languages" class="mt-2">
        <dt class="font-bold mr-1">My languages:</dt>
        <dd>{{ profile.languages }}</dd>
      </dl>
      <dl v-if="profile.skills" class="mt-1">
        <dt class="font-bold mr-1">Experience:</dt>
        <dd>{{ profile.skills }}</dd>
      </dl>
      <dl
        v-if="profile.partner"
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
import { ref } from '@vue/composition-api'
import { getDateTime } from '~/utils'
import useProfiles from '~/use/profiles'
import useAuth from '~/use/auth'

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

    const { uid: myUid } = useAuth()

    const showPopup = ref(false)

    const profile = getProfile(props.uid)

    return {
      getProfile,
      getDateTime,
      profile,
      myUid,
      showPopup
    }
  }
}
</script>
