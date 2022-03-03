<template>
  <div class="mt-8 space-y-4 bg-gray-100 p-4">
    <dl v-if="profile.locales">
      <dt class="mr-1 font-bold">{{ $t('profile.languages') }}:</dt>
      <dd>{{ getLabels(languages, profile.locales) }}</dd>
    </dl>
    <dl v-else-if="profile.languages">
      <dt class="mr-1 font-bold">{{ $t('profile.languages') }}:</dt>
      <dd>{{ profile.languages }}</dd>
    </dl>
    <div v-if="profile.objectives">
      <h2 class="font-bold">{{ $t('profile.objectives') }}:</h2>
      <div>{{ getLabels(objectivesList, profile.objectives) }}</div>
    </div>
    <div v-if="profile.learning">
      <h2 class="font-bold">{{ $t('profile.learning.label') }}</h2>
      <div>{{ profile.learning }}</div>
    </div>
    <div v-if="profile.styles">
      <h2 class="font-bold">{{ $t('profile.style') }}:</h2>
      <TStyles :value.sync="profile.styles" />
    </div>
    <div v-else-if="profile.skills">
      <h2 class="font-bold">{{ $t('profile.style') }}:</h2>
      <div>{{ profile.skills }}</div>
    </div>
    <div v-if="profile.jobs">
      <h2 class="font-bold">{{ $t('profile.jobs.label') }}:</h2>
      <div>{{ profile.jobs }}</div>
    </div>

    <dl class="mt-4 md:flex">
      <dt class="mr-1 font-bold">{{ $t('profile.joined') }}:</dt>
      <dd>{{ getDateTimeYear(profile.createdAt) }}</dd>
    </dl>

    <dl v-if="profile.lastLoginAt" class="mt-4 md:flex">
      <dt class="mr-1 font-bold">{{ $t('profile.profileSorts.lastSeen') }}:</dt>
      <dd>{{ getDateTimeYear(profile.lastLoginAt) }}</dd>
    </dl>

    <dl class="mt-4 md:flex">
      <dt class="mr-1 font-bold">{{ $t('visibility.label') }}:</dt>
      <dd>{{ profile.visibility }}</dd>
    </dl>
  </div>
</template>

<script>
import { getDateTimeYear, getLabels } from '~/utils'
import { useProfiles } from '~/use/profiles'
import languages from '~/assets/languages'

export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const { objectivesList, profilePosterFields, profileDetailFields } =
      useProfiles()

    return {
      objectivesList,
      profilePosterFields,
      profileDetailFields,
      languages,
      getDateTimeYear,
      getLabels,
    }
  },
}
</script>
