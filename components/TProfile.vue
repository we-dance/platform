<template>
  <div class="p-4">
    <portal to="title">
      <h1 class="ml-1 font-lato text-lg font-bold">
        {{ profile.username }}
      </h1>
    </portal>

    <TItemCard>
      <TSharePreviewPost
        collection="profiles"
        :type="profile.type"
        :username="profile.username"
        :description="getExcerpt(profile.bio)"
        :color="profile.partner === 'Yes' ? 'bg-green-400' : 'bg-red-400'"
        :photo="profile.photo"
        :styles="profile.styles"
        size="sm"
        class="md:-mt-4 md:-mx-4"
      />

      <div class="my-2 flex justify-between">
        <div>
          <div class="font-bold text-lg leading-none">
            {{ profile.name }}
          </div>
          <div class="text-sm text-gray-700">
            {{ getCity(profile.place) }}
            <span v-if="profile.height">• {{ profile.height }}cm</span>
            <span v-if="profile.weight">• {{ profile.weight }}kg</span>
          </div>
        </div>
        <TProfileContact :uid="profile.createdBy" />
      </div>

      <TProfileContacts :profile="profile" class="mb-4" />

      <div class="flex justify-center space-x-2">
        <TPopupEdit
          v-if="isAdmin()"
          :fields="profileFields"
          label="Edit Profile"
          collection="profiles"
          singular="profile"
          :item="profile"
        />
        <TButton
          v-else-if="can('edit', 'profiles', profile)"
          label="Edit Profile"
          to="/settings?tab=profile"
        />
      </div>

      <WTeaser
        v-if="profile.partner === 'Yes'"
        title="I am looking for a dance partner"
        :description="profile.partnerBio"
        class="w-full mt-4"
      />

      <div v-if="uid === profile.id" class="w-full flex justify-center p-4">
        <TButton to="/events/-/edit" type="primary">{{
          $t('myprofile.events.add')
        }}</TButton>
      </div>

      <TEventList
        :filter="{ createdBy: profile.createdBy }"
        class="mt-4 w-full"
      />

      <TPreview v-if="profile.story" :content="profile.story" class="mt-4" />

      <TProfileDetails :profile="profile" />
    </TItemCard>

    <TItemFooter
      collection="profiles"
      :item="profile"
      :title="profile.username"
    />

    <div v-if="uid === profile.id" class="w-full flex justify-center p-4 mt-4">
      <TButton to="/posts/-/edit" type="primary">{{
        $t('myprofile.posts.add')
      }}</TButton>
    </div>

    <TPostList :filter="{ createdBy: profile.createdBy }" class="mt-4 w-full" />
  </div>
</template>

<script>
import { useApp } from '~/use/app'
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { getExcerpt } from '~/utils'

export default {
  props: {
    profile: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const { uid, isAdmin, can } = useAuth()
    const { profileFields } = useProfiles()
    const { getCity } = useApp()

    return {
      uid,
      can,
      getExcerpt,
      profileFields,
      getCity,
      isAdmin
    }
  }
}
</script>
