<template>
  <div>
    <div class="md:flex p-4">
      <TProfilePhoto
        size="xl"
        class="mx-auto md:m-0 md:mr-8 mb-4"
        :uid="profile.createdBy"
      />
      <div class="w-full">
        <div class="flex justify-between">
          <div class="text-left">
            <div class="flex">
              <div class="font-bold text-2xl leading-none">
                {{ profile.name }}
              </div>
            </div>
            <div class="text-xs">
              {{ profile.community }}
            </div>
            <div>{{ profile.bio }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <div v-if="uid === profile.createdBy" class="text-primary">
        <TButton icon="edit" to="/settings?tab=profile" />
      </div>
      <TProfileContact v-else :uid="profile.createdBy" />
    </div>
    <div class="px-4">
      <div v-if="profile.story" class="mt-4">
        <TPreview :content="profile.story" />
      </div>
    </div>
    <div class="px-4">
      <h2 class="font-bold text-lg">Upcoming events</h2>
      <TEventList :filter="{ createdBy: profile.createdBy }" />
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
