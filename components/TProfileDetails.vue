<template>
  <div class="space-y-4 mt-8 p-4 bg-gray-100">
    <dl v-if="profile.current">
      <dt class="font-bold mr-1">{{ $t('profile.current.label') }}:</dt>
      <dd>{{ getCity(profile.current) }}</dd>
    </dl>
    <dl v-if="!profile.place && profile.import">
      <dt class="font-bold mr-1">{{ $t('profile.place.label') }}:</dt>
      <dd>
        <TPopupEdit
          :fields="profileFields.filter((f) => f.name === 'place')"
          label="Add city"
          collection="profiles"
          singular="profile"
          :item="profile"
        />
      </dd>
    </dl>
    <dl v-if="profile.place">
      <dt class="font-bold mr-1">{{ $t('profile.place.label') }}:</dt>
      <dd>{{ getCity(profile.place) }}</dd>
    </dl>
    <dl v-if="!profile.hometown && profile.import">
      <dt class="font-bold mr-1">{{ $t('profile.hometown.label') }}:</dt>
      <dd>
        <TPopupEdit
          :fields="profileFields.filter((f) => f.name === 'hometown')"
          label="Add city"
          collection="profiles"
          singular="profile"
          :item="profile"
        />
      </dd>
    </dl>
    <dl v-if="profile.hometown">
      <dt class="font-bold mr-1">{{ $t('profile.hometown.label') }}:</dt>
      <dd>{{ getCity(profile.hometown) }}</dd>
    </dl>
    <dl v-if="profile.locales">
      <dt class="font-bold mr-1">{{ $t('profile.languages') }}:</dt>
      <dd>{{ getLabels(languages, profile.locales) }}</dd>
    </dl>
    <dl v-else-if="profile.languages">
      <dt class="font-bold mr-1">{{ $t('profile.languages') }}:</dt>
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
      <dt class="font-bold mr-1">{{ $t('profile.joined') }}:</dt>
      <dd>{{ getDateTimeYear(profile.createdAt) }}</dd>
    </dl>

    <dl v-if="profile.lastLoginAt" class="mt-4 md:flex">
      <dt class="font-bold mr-1">{{ $t('profile.profileSorts.lastSeen') }}:</dt>
      <dd>{{ getDateTimeYear(profile.lastLoginAt) }}</dd>
    </dl>

    <dl class="mt-4 md:flex">
      <dt class="font-bold mr-1">{{ $t('visibility.label') }}:</dt>
      <dd>{{ profile.visibility }}</dd>
    </dl>
  </div>
</template>

<script>
import { getDateTimeYear, getLabels } from '~/utils'
import { useProfiles } from '~/use/profiles'
import languages from '~/assets/languages'
import { useApp } from '~/use/app'

export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const {
      objectivesList,
      profilePosterFields,
      profileDetailFields,
      profileFields,
    } = useProfiles()
    const { getCity } = useApp()

    return {
      objectivesList,
      profilePosterFields,
      profileDetailFields,
      languages,
      profileFields,
      getDateTimeYear,
      getLabels,
      getCity,
    }
  },
}
</script>
