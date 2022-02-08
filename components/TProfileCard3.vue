<template>
  <div>
    <div v-if="label" class="mb-4 text-sm font-bold leading-none text-gray-700">
      {{ label }}
    </div>
    <div class="flex">
      <NuxtLink :to="`/${profile.username}`">
        <TProfilePhoto2 size="lg" :src="profile.photo" />
      </NuxtLink>
      <div class="ml-2">
        <NuxtLink
          class="font-bold hover:underline"
          :to="`/${profile.username}`"
        >
          {{ profile.username }}
        </NuxtLink>
        <div class="text-xs text-gray-800">{{ profile.bio }}</div>
        <div v-if="showDetails" class="mt-4 text-sm text-gray-700">
          <dl class="flex space-x-1">
            <dt class="font-bold">Address:</dt>
            <dd>
              <a
                :href="`https://maps.google.com/?q=${profile.zipcode} ${profile.community}`"
                class="underline hover:no-underline"
                target="_blank"
                >{{ profile.community }} {{ profile.zipcode }}</a
              >
            </dd>
          </dl>
          <dl v-if="profile.height" class="flex space-x-1">
            <dt class="font-bold">Height:</dt>
            <dd>{{ profile.height }}cm</dd>
          </dl>
          <dl v-if="profile.weight" class="flex space-x-1">
            <dt class="font-bold">Weight:</dt>
            <dd>{{ profile.weight }}kg</dd>
          </dl>
          <dl v-if="profile.locales" class="space-x-1 md:flex">
            <dt class="font-bold">Languages:</dt>
            <dd>{{ getLabels(languages, profile.locales) }}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLabels } from '~/utils'
import languages from '~/assets/languages'

export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    profile: {
      type: Object,
      default: () => ({}),
    },
    showDetails: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      getLabels,
      languages,
    }
  },
}
</script>
