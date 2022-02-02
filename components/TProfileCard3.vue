<template>
  <div>
    <div v-if="label" class="font-bold text-sm mb-4 leading-none text-gray-700">
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
        <div v-if="showDetails" class="text-sm text-gray-700 mt-4">
          <dl class="flex space-x-1">
            <dt class="font-bold">Address:</dt>
            <dd>
              <a
                :href="
                  `https://maps.google.com/?q=${profile.zipcode} ${profile.community}`
                "
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
          <dl v-if="profile.locales" class="md:flex space-x-1">
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
