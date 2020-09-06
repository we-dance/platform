<template>
  <div class="rounded border shadow p-4 bg-white">
    <div class="flex items-center">
      <router-link
        :to="`/u/${profile.username}`"
        class="text-sm flex items-center flex-grow mr-2"
      >
        <TProfilePhoto size="lg" :uid="uid" class="mr-2" />
        <div>
          <div class="font-bold">
            {{ profile.name }}
          </div>
          <div class="text-gray-600">@{{ profile.username }}</div>
        </div>
      </router-link>
      <TButton
        :href="
          `mailto:wedance@razbakov.com?subject=Dance Partner Request&body=Connect ${
            getProfile(myUid).username
          } and ${profile.username}`
        "
        >Send Request</TButton
      >
    </div>
    <div class="text-sm mt-2">
      <dl v-if="profile.learning" class="mt-1">
        <dt class="font-bold mr-1">I am getting into:</dt>
        <dd>{{ profile.learning }}</dd>
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
      <dl v-if="profile.bio" class="mt-2">
        <dt class="font-bold mr-1">About me:</dt>
        <dd></dd>
        <dd>{{ profile.bio }}</dd>
      </dl>
      <dl v-if="profile.height" class="mt-2">
        <dt class="font-bold mr-1">My height:</dt>
        <dd>{{ profile.height }}cm</dd>
      </dl>
      <dl v-if="profile.weight" class="mt-2">
        <dt class="font-bold mr-1">My weight:</dt>
        <dd>{{ profile.weight }}kg</dd>
      </dl>
      <dl v-if="profile.languages" class="mt-2">
        <dt class="font-bold mr-1">My languages:</dt>
        <dd>{{ profile.languages }}</dd>
      </dl>
      <dl v-if="profile.skills" class="mt-1">
        <dt class="font-bold mr-1">Experience:</dt>
        <dd>{{ profile.skills }}</dd>
      </dl>
      <dl v-if="profile.location" class="mt-1">
        <dt class="font-bold mr-1">City:</dt>
        <dd>{{ profile.location.locality }}, {{ profile.location.country }}</dd>
      </dl>
      <dl class="mt-2">
        <dt class="font-bold mr-1">Joined:</dt>
        <dd>{{ getDateTime(profile.createdAt) }}</dd>
      </dl>
      <dl v-if="profile.visibility" class="mt-2">
        <dt class="font-bold mr-1">Visibility:</dt>
        <dd>{{ profile.visibility }}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
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

    const profile = getProfile(props.uid)

    return {
      getProfile,
      getDateTime,
      profile,
      myUid
    }
  }
}
</script>
