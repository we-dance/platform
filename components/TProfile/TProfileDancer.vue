<template>
  <div class="p-4">
    <div class="flex flex-col items-center">
      <TProfilePhoto size="xl" :uid="profile.createdBy" />
      <div class="font-bold text-lg leading-none mt-4">
        {{ profile.name }}
      </div>
      <div class="text-gray-700 text-sm">@{{ profile.username }}</div>
      <div v-if="profile.bio" class="mt-4">
        <div>{{ profile.bio }}</div>
      </div>
      <div
        v-if="profile.partner === 'Yes'"
        class="mt-4 border border-primary p-2 rounded"
      >
        <div class="font-bold text-primary">
          I am looking for a dance partner
        </div>
        <div v-if="profile.partnerBio">{{ profile.partnerBio }}</div>
      </div>
      <div class="mt-4">
        <TButton v-if="uid === profile.id" to="/settings?tab=profile"
          >Edit Profile</TButton
        >
        <TProfileContact v-else :uid="profile.createdBy" />
      </div>
    </div>
    <div>
      <dl v-if="profile.community" class="mt-4 md:flex">
        <dt class="font-bold mr-1">Community:</dt>
        <dd>
          {{ profile.community }}
        </dd>
      </dl>
      <div v-if="profile.styles" class="mt-4">
        <h2 class="font-bold">Dance styles:</h2>
        <TStyles :value.sync="profile.styles" />
      </div>
      <div v-else-if="profile.skills" class="mt-4">
        <h2 class="font-bold">Dance styles:</h2>
        <div>{{ profile.skills }}</div>
      </div>
      <div v-if="profile.jobs" class="mt-4">
        <h2 class="font-bold">Skills:</h2>
        <div>{{ profile.jobs }}</div>
      </div>
      <dl v-if="profile.languages" class="mt-4">
        <dt class="font-bold mr-1">Languages:</dt>
        <dd>{{ profile.languages }}</dd>
      </dl>
      <div v-if="profile.learning" class="mt-4">
        <h2 class="font-bold">Which dance topics you are interested in?</h2>
        <div>{{ profile.learning }}</div>
      </div>

      <div v-if="profile.story" class="mt-4">
        <h2 class="font-bold">My dance story:</h2>
        <TPreview :content="profile.story" />
      </div>

      <dl class="mt-4 md:flex">
        <dt class="font-bold mr-1">Joined:</dt>
        <dd>{{ getDateTime(profile.createdAt) }}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import { getDateTime } from '~/utils'

export default {
  props: {
    profile: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const { uid } = useAuth()

    return {
      uid,
      getDateTime
    }
  }
}
</script>
