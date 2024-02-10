<template>
  <div>
    <THeader>
      <TButton
        v-if="profile.type === 'City'"
        slot="left"
        allow-guests
        :to="localePath('/cities')"
        icon="place"
        :label="profile.name"
      />
      <div
        v-else
        slot="left"
        class="flex flex-no-wrap items-center ml-8 md:ml-0"
      >
        <div class="ml-1 font-lato text-lg font-bold">
          {{ profile.username }}
        </div>
      </div>

      <TButton
        allow-guests
        type="nav"
        icon="search"
        :to="localePath('/search')"
      />
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
    </THeader>

    <div class="grid grid-cols-4 gap-4 p-4">
      <div>
        <img
          v-if="profile.photo"
          :src="profile.photo"
          :alt="profile.username"
          class="w-full rounded-full"
        />
        <TIcon
          v-else-if="profile.type !== 'City'"
          name="undraw_profile_pic"
          class="w-full rounded-full"
        />
      </div>

      <div class="col-span-3">
        <h1 class="leading-tight font-bold">{{ profile.name }}</h1>
        <TExpand class="text-sm mb-4">
          <TPreview :content="profile.bio" />
          <TProfileDetails :profile="profile" />
        </TExpand>

        <div class="text-xs text-gray-500">
          {{ $tc('views', profile.viewsCount, { count: profile.viewsCount }) }}
          ·
          {{
            $tc('subscribers', subscribersCount, {
              count: subscribersCount,
            })
          }}
        </div>
      </div>
    </div>

    <div class="flex space-x-2 p-4 justify-end">
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
      <TReaction
        v-if="uid !== profile.id"
        :label="$t('Subscribe')"
        :toggled-label="$t('Unsubscribe')"
        field="watch"
        icon="BellIcon"
        hide-count
        :item="profile"
        collection="profiles"
      />
      <TProfileContacts
        :profile="profile"
        :title="$t('Contact')"
        type="simple"
      />
    </div>

    <WTeaser
      v-if="profile.partner === 'Yes'"
      :title="$t('profile.partnerSearch.title')"
      :description="profile.partnerBio"
      class="w-full mt-4"
    />

    <template v-if="!$route.query.beta">
      <TLoader v-if="!loaded" class="py-4" />
      <TEventListNoLoad
        v-else
        :community="profile.username"
        :username="profile.username"
        :docs="events"
        class="w-full border-b border-t pt-4"
      />
    </template>

    <WTeaser
      v-if="!uid && profile.type !== 'City' && profile.place"
      :title="$t('profile.invite.header', { count: invitesLeft })"
      :description="$t('profile.invite.description', { name: profile.name })"
      :button="$t('profile.invite.action')"
      :url="`/signin?invitedBy=${profile.username}`"
      class="my-0"
    />

    <div v-if="profile.reviews">
      <h3 class="text-xl font-bold p-4 border-t">{{ $t('reviews.title') }}</h3>
      <TReviewList :reviews="profile.reviews" class="p-4" />
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

    <TPostList
      :filter="{ username: profile.username }"
      class="mt-4 w-full border-t"
    />
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue-demi'
import { useApp } from '~/use/app'
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { getExcerpt, getProfileMeta } from '~/utils'
import { useI18n } from '~/use/i18n'
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
  head() {
    return getProfileMeta(this.profile)
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

    const subscribersCount = computed(() => {
      return props.profile?.watch?.usernames?.length || 0
    })

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
      loaded,
      uid,
      can,
      getExcerpt,
      profileFields,
      getCity,
      isAdmin,
      community,
      invitesLeft,
      subscribersCount,
      remove,
      events,
      softUpdate,
    }
  },
}
</script>
