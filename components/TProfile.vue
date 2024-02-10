<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <div class="flex flex-col items-center">
      <div class="bg-primary h-32 w-full"></div>
      <div class="w-32 -mt-16">
        <img
          v-if="profile.photo"
          :src="profile.photo"
          :alt="profile.username"
          class="w-full rounded-full border-4 border-white"
        />
        <TIcon v-else name="undraw_profile_pic" class="w-full rounded-full" />
      </div>
      <h1 class="leading-none mb-2 px-4 text-center font-bold text-3xl mt-2">
        {{ profile.name }}
      </h1>
      <TProfileStats :profile="profile" />
      <TPreview class="text-sm text-center px-4" :content="profile.bio" />
      <div class="flex space-x-2 justify-center my-2 px-4">
        <TReaction
          v-if="uid !== profile.id"
          :label="$t('Connect')"
          :toggled-label="$t('Connected')"
          field="watch"
          type="primary"
          hide-count
          :item="profile"
          collection="profiles"
        />
        <TButton
          v-if="uid !== profile.id"
          label="Message"
          :to="`/chat/${profile.username}`"
        />
        <TButton
          v-if="uid === profile.id"
          type="primary"
          :label="$t('myprofile.edit')"
          :to="localePath('/settings?tab=profile')"
        />
        <TButton
          v-if="uid === profile.id"
          :to="localePath('/events/-/import')"
          type="base"
          >{{ $t('myprofile.addEvent') }}</TButton
        >
        <TDropdown>
          <TPopupEdit
            v-if="isAdmin()"
            type="context"
            :fields="profileFields"
            :label="$t('Edit')"
            collection="profiles"
            singular="profile"
            :item="profile"
          />
          <TCardActions
            :id="profile.id"
            collection="profiles"
            :item="profile"
            type="context"
          />
          <TButtonShare
            :id="profile.id"
            collection="profiles"
            :place="profile.place"
            :file="profile.socialCover"
            :file-name="profile.username"
            :url="`https://wedance.vip/${profile.username}`"
            :text="profile.name"
            type="context"
            :label="$t('share.title')"
          />
          <TButton
            v-if="isAdmin()"
            type="context"
            icon="delete"
            :label="$t('Delete')"
            @click="remove(profile.id)"
          />
          <TButton
            v-if="isAdmin()"
            type="context"
            icon="upload"
            label="Instagram"
            @click="softUpdate(profile.id, { import: 'requested' })"
          />
        </TDropdown>
      </div>
      <TContactsGrid :profile="profile" class="my-4" />
    </div>

    <TwTabs id="tabs" :tabs="tabs" />

    <div class="min-h-screen">
      <TProfileDetails v-if="!$route.query.view" :profile="profile" />
      <TEventListNoLoad
        v-if="$route.query.view === 'events'"
        :community="profile.username"
        :username="profile.username"
        :docs="events"
        class="w-full border-b border-t pt-4"
      />
      <TReviewList
        v-if="$route.query.view === 'reviews'"
        :reviews="profile.reviews"
        class="px-4"
      />
      <TPostList
        v-if="$route.query.view === 'posts'"
        :filter="{ username: profile.username }"
        class="mt-4 w-full border-t"
      />
    </div>

    <div
      v-if="profile.id !== profile.createdBy && profile.type !== 'City'"
      class="py-4 flex justify-center"
    >
      <TButton
        type="simple"
        :label="$t('profile.claim')"
        :href="`mailto:support@wedance.vip?subject=Claim ${profile.username}`"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue-demi'
import { useApp } from '~/use/app'
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { getExcerpt, getProfileMeta } from '~/utils'
import { useDoc } from '~/use/doc'
import {
  getEventsOrganisedBy,
  getEventsWithArtist,
  getEventsWithGuest,
} from '~/use/events'

export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { root }) {
    const { uid, isAdmin, can } = useAuth()
    const { profileFields } = useProfiles()
    const { getCity } = useApp()
    const { remove, softUpdate } = useDoc('profiles')
    const invitesLeft = 5
    const community = computed(() => getCity(props.profile?.place))

    const events = ref([])
    const loaded = ref(false)

    const view = computed(() => root.$route.query.view)

    const tabs = computed(() => [
      {
        name: 'About',
        to: `/${props.profile.username}`,
        current: !view.value,
      },
      {
        name: 'Events',
        to: `/${props.profile.username}?view=events#tabs`,
        current: view.value === 'events',
      },
      {
        name: 'Reviews',
        to: `/${props.profile.username}?view=reviews#tabs`,
        current: view.value === 'reviews',
      },
      {
        name: 'Posts',
        to: `/${props.profile.username}?view=posts#tabs`,
        current: view.value === 'posts',
      },
    ])

    onMounted(async () => {
      let result = []

      result = [
        ...result,
        ...(await getEventsOrganisedBy(props.profile?.username)),
      ]
      result = [
        ...result,
        ...(await getEventsWithArtist(props.profile?.username)).filter(
          (item) => !result.find((existing) => existing.id === item.id)
        ),
      ]
      result = [
        ...result,
        ...(await getEventsWithGuest(props.profile?.username)).filter(
          (item) => !result.find((existing) => existing.id === item.id)
        ),
      ]

      events.value = result
      loaded.value = true
    })

    return {
      tabs,
      loaded,
      uid,
      can,
      getExcerpt,
      profileFields,
      getCity,
      isAdmin,
      community,
      invitesLeft,
      remove,
      events,
      softUpdate,
    }
  },
  head() {
    return getProfileMeta(this.profile)
  },
}
</script>
