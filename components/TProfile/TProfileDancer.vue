<template>
  <div class="p-4">
    <div class="flex flex-col items-center">
      <TProfilePhoto size="xl" :uid="profile.createdBy" />
      <div class="font-bold text-lg leading-none mt-4">
        {{ profile.name }}
      </div>
      <div class="text-sm text-gray-700">
        {{ profile.community }}
      </div>
      <div v-if="profile.bio" class="mt-4">
        <div>{{ profile.bio }}</div>
      </div>
      <WTeaser
        v-if="profile.partner === 'Yes'"
        title="I am looking for a dance partner"
        :description="profile.partnerBio"
        class="w-full mt-4"
      />
      <div
        class="mt-4 flex space-x-4 items-center justify-end border p-4 w-full"
      >
        <TButton
          v-if="profile.instagram"
          icon="instagram"
          type="round"
          iconSize="6"
          :href="`https://instagram.com/${profile.instagram}`"
        />
        <TButton
          v-if="profile.tiktok"
          icon="tiktok"
          type="round"
          iconSize="6"
          :href="`https://tiktok.com/${profile.tiktok}`"
        />
        <TButton
          v-if="profile.youtube"
          icon="youtube"
          type="round"
          iconSize="6"
          :href="`https://youtube.com/${profile.youtube}`"
        />
        <TButton
          v-if="profile.twitter"
          icon="twitter"
          type="round"
          iconSize="6"
          :href="`https://twitter.com/${profile.twitter}`"
        />
        <TButton
          v-if="profile.facebook"
          icon="facebook"
          type="round"
          iconSize="6"
          :href="`https://fb.com/${profile.facebook}`"
        />
        <TButton
          v-if="profile.website"
          :href="profile.website"
          label="Visit website"
          type="round"
        />
        <TButton v-if="uid === profile.id" to="/settings?tab=profile"
          >Edit Profile</TButton
        >
        <TProfileContact v-else :uid="profile.createdBy" />
      </div>
    </div>
    <TPreview v-if="profile.story" :content="profile.story" class="mt-4" />
    <div class="rounded border shadow p-4 space-y-4 mt-4">
      <dl v-if="profile.languages">
        <dt class="font-bold mr-1">Languages:</dt>
        <dd>{{ profile.languages }}</dd>
      </dl>
      <div v-if="profile.learning">
        <h2 class="font-bold">Which dance topics you are interested in?</h2>
        <div>{{ profile.learning }}</div>
      </div>
      <div v-if="profile.styles">
        <h2 class="font-bold">Dance styles:</h2>
        <TStyles :value.sync="profile.styles" />
      </div>
      <div v-else-if="profile.skills">
        <h2 class="font-bold">Dance styles:</h2>
        <div>{{ profile.skills }}</div>
      </div>
      <div v-if="profile.jobs">
        <h2 class="font-bold">Skills:</h2>
        <div>{{ profile.jobs }}</div>
      </div>

      <dl class="mt-4 md:flex">
        <dt class="font-bold mr-1">Joined:</dt>
        <dd>{{ getDateTime(profile.createdAt) }}</dd>
      </dl>

      <dl class="mt-4 md:flex">
        <dt class="font-bold mr-1">Visibility:</dt>
        <dd>{{ profile.visibility || 'N/A' }}</dd>
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
