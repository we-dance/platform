<template>
  <div>
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
      <div class="mt-2 mb-2 px-4 text-center">
        <TVenueType :type="profile.venueType" class="text-xs uppercase" />
        <h1 class="leading-none text-center font-bold text-3xl">
          {{ profile.name || profile.username }}
        </h1>
      </div>
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
          :label="$t('Subscribe')"
          :toggled-label="$t('Subscribed')"
          toggled-class="bg-green-500"
          field="watch"
          type="primary"
          hide-count
          :item="profile"
          collection="profiles"
        />
        <TButton
          v-if="profile.type == 'Venue'"
          label="Book Venue"
          :to="`/events/-/edit?venue=${profile.username}`"
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
      <TContactsGrid :profile="profile" class="my-4 justify-center" />
    </div>

    <TwTabs id="tabs" track="profile" :tabs="tabs" />

    <div class="min-h-screen">
      <TStories
        v-if="$route.query.view === 'stories'"
        :created-by="profile.id"
        class="w-full"
      />
      <div v-if="profile.username == 'zensual.art'" class="pb-4 px-4">
        <div class="max-w-sm mx-auto">
          <div class="p-4 pb-0 -mb-3">
            <span class="rounded bg-primary text-white text-xs px-1">
              Online Classes
            </span>
          </div>
          <NuxtLink
            to="/demo/zensual.art"
            class="flex border-b p-4 leading-none gap-2 rounded-lg shadow bg-orange-100 border-orange-200"
          >
            <div class="w-full">
              <div class="font-bold text-sm hover:underline hover:text-primary">
                Salsa Lady Styling
              </div>
              <div>
                <div class="text-xs text-gray-700">
                  Salsa Cubana · Son
                </div>
              </div>
              <div class="text-primary text-xs">
                €10/month
              </div>
            </div>
            <div>
              <img
                class="w-20 rounded"
                src="https://firebasestorage.googleapis.com/v0/b/wedance-4abe3.appspot.com/o/media%2FtvR012ArEpQhCJdPHh6G7sLuqoO2%2Fc3bfb7be-1dfb-4e71-b486-30754d0ddfa2?alt=media&token=f45dcae4-b2f4-4ea1-9bee-db41c89654f0"
                alt="Ecstasy of Sensuality Cover"
              />
            </div>
          </NuxtLink>
        </div>
      </div>
      <TEventListNoLoad
        v-if="$route.query.view === 'events'"
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
      <TProfileDetails v-if="!$route.query.view" :profile="profile" />
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
  getEventsSavedBy,
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
        name: 'About',
        to: `/${props.profile.username}#tabs`,
        current: !view.value,
        value: 'about',
      },
      {
        name: 'Events',
        to: `/${props.profile.username}?view=events#tabs`,
        current: view.value === 'events',
        value: 'events',
      },
      {
        name: 'Stories',
        to: `/${props.profile.username}?view=stories#tabs`,
        current: view.value === 'stories',
        value: 'stories',
      },
      {
        name: 'Reviews',
        to: `/${props.profile.username}?view=reviews#tabs`,
        current: view.value === 'reviews',
        hidden: props.profile.type === 'Dancer',
        value: 'reviews',
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

      result = [
        ...result,
        ...(await getEventsSavedBy(props.profile)).filter(
          (item) => !result.find((existing) => existing.id === item.id)
        ),
      ]

      result = result.filter((item) => item.type === 'event')

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
