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
        {{ profile.name || profile.username }}
      </h1>
      <a
        v-if="profile.address"
        :href="profile.address.url"
        target="_blank"
        class="block py-2 px-4 hover:underline"
      >
        <div class="flex items-center justify-start leading-tight">
          <TIcon name="place" class="h-4 w-4" />
          <div>
            <div class="text-gray-700">
              {{ profile.address.formatted_address }}
            </div>
          </div>
        </div>
      </a>
      <TProfileStats :profile="profile" />
      <TPreview class="text-sm text-center px-4" :content="profile.bio" />
      <div class="flex space-x-2 justify-center my-2 px-4">
        <TReaction
          v-if="uid !== profile.id"
          :label="$t('Connect')"
          :toggled-label="$t('Connected')"
          toggled-class="bg-green-500"
          field="watch"
          type="primary"
          hide-count
          :item="profile"
          collection="profiles"
        />
        <TButton
          v-if="uid !== profile.id && profile.id === profile.createdBy"
          label="Message"
          :to="`/chat/${profile.username}`"
        />
        <TButton
          v-if="uid === profile.id"
          type="primary"
          :label="$t('myprofile.edit')"
          :to="localePath('/settings?tab=profile')"
        />
        <TDropdown>
          <TPopupEdit
            v-if="can('edit', profile)"
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
          <TShowAccount v-if="isAdmin()" :id="profile.id" type="context" />
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
      <TMyActions
        v-if="!$route.query.view && uid == profile.id"
        :place="currentCity"
      />
      <TStories
        v-if="$route.query.view === 'stories'"
        :created-by="profile.id"
        class="w-full"
      />
      <TEventListNoLoad
        v-if="!$route.query.view"
        :community="profile.username"
        :username="profile.username"
        :docs="events"
        :invited-by="profile.id"
        class="w-full border-b border-t pt-4"
      />
      <TReviewList
        v-if="$route.query.view === 'reviews'"
        :profile="profile"
        class="px-4"
      />
      <TProfileDetails
        v-if="$route.query.view === 'about'"
        :profile="profile"
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
  getEventsWithVenue,
} from '~/use/events'
import { useCities } from '~/use/cities'

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
    const { currentCity } = useCities()
    const community = computed(() => getCity(props.profile?.place))

    const events = ref([])
    const loaded = ref(false)

    const view = computed(() => root.$route.query.view)

    const tabs = computed(() => [
      {
        name: 'Events',
        to: `/${props.profile.username}`,
        current: !view.value,
      },
      {
        name: 'Stories',
        to: `/${props.profile.username}?view=stories#tabs`,
        current: view.value === 'stories',
      },
      {
        name: 'Reviews',
        to: `/${props.profile.username}?view=reviews#tabs`,
        current: view.value === 'reviews',
        hidden: props.profile.type === 'Dancer',
      },
      {
        name: 'About',
        to: `/${props.profile.username}?view=about#tabs`,
        current: view.value === 'about',
      },
    ])

    onMounted(async () => {
      let result = []

      result = [
        ...result,
        ...(await getEventsOrganisedBy(props.profile?.username)),
      ]
      if (props.profile?.address?.place_id) {
        result = [
          ...result,
          ...(
            await getEventsWithVenue(props.profile?.address?.place_id)
          ).filter(
            (item) => !result.find((existing) => existing.id === item.id)
          ),
        ]
      }
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
      currentCity,
    }
  },
  head() {
    return getProfileMeta(this.profile)
  },
}
</script>
