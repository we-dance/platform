<template>
  <div>
    <div class="font-bold text-sm mb-2 leading-none text-gray-700">
      {{ label }}
    </div>
    <div class="flex mt-4">
      <router-link :to="`/u/${profile.username}`">
        <TProfilePhoto2 size="lg" :src="profile.photo" />
      </router-link>
      <div class="ml-2">
        <router-link
          class="font-bold hover:underline"
          :to="`/u/${profile.username}`"
        >
          {{ profile.username }}
        </router-link>
        <div class="text-xs text-gray-800">{{ profile.bio }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    profile: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
