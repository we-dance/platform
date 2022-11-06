<template>
  <div>
    <THeader>
      <TButton
        v-if="profile.type === 'City'"
        slot="left"
        to="/cities"
        icon="place"
        :label="profile.username"
      />
      <div
        v-else
        slot="left"
        class="flex flex-no-wrap items-center ml-8 md:ml-0"
      >
        <h1 class="ml-1 font-lato text-lg font-bold">
          {{ profile.username }}
        </h1>
      </div>

      <TButton allow-guests type="nav" icon="search" to="/search" />
      <TDropdown>
        <TPopupEdit
          v-if="isAdmin()"
          type="context"
          :fields="profileFields"
          label="Edit"
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
          label="Delete"
          @click="remove(profile.id)"
        />
      </TDropdown>
    </THeader>

    <div class="flex p-4 space-x-4">
      <div class="w-32">
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

      <div>
        <h1 class="leading-tight font-bold">{{ profile.name }}</h1>
        <div class="text-sm">{{ profile.bio }}</div>

        <div class="text-xs text-gray-500">
          {{ profile.viewsCount || 0 }} views
        </div>

        <div v-if="profile.type === 'City'" class="flex space-x-2 mt-4">
          <TReaction
            label="Subscribe"
            toggled-label="Unsubscribe"
            field="watch"
            icon="BellIcon"
            :item="profile"
            collection="profiles"
          />
          <TButton type="simple" to="/events/-/edit">{{
            $t('myprofile.addEvent')
          }}</TButton>
        </div>
        <div v-if="profile.type !== 'City'" class="flex space-x-2 mt-4">
          <TReaction
            label="Follow"
            toggled-label="Unfollow"
            field="watch"
            icon="BellIcon"
            :item="profile"
            collection="profiles"
          />
          <TProfileContacts :profile="profile" title="Contact" type="simple" />
        </div>
      </div>
    </div>

    <div v-if="uid === profile.id" class="flex justify-center space-x-2">
      <TButton :label="$t('myprofile.edit')" to="/settings?tab=profile" />
    </div>

    <WTeaser
      v-if="profile.partner === 'Yes'"
      :title="$t('profile.partnerSearch.title')"
      :description="profile.partnerBio"
      class="w-full mt-4"
    />

    <TCommunity v-if="profile.type === 'City'" class="pt-4 border-t" />

    <TEventListNoLoad
      v-if="profile.type !== 'City'"
      :docs="events"
      :username="profile.username"
      class="w-full border-b"
    />

    <TEventList
      v-if="profile.type === 'City' && profile.username == 'Travel'"
      :filter="{ eventType: 'Festival' }"
      :community="profile.username"
      :username="profile.username"
      class="mt-4 w-full border-b pb-8"
    />

    <template v-if="$route.query.beta">
      <TCalendar
        v-if="profile.type === 'City' && profile.username !== 'Travel'"
        class="mt-4 w-full border-t pt-4 pb-8"
      />
    </template>

    <template v-if="!$route.query.beta">
      <TEventList
        v-if="profile.type === 'City' && profile.username !== 'Travel'"
        title="Upcoming Events"
        :filter="{ place: profile.place }"
        :community="profile.username"
        :username="profile.username"
        class="mt-4 w-full border-t pt-4 pb-8"
      />
    </template>

    <WTeaser
      v-if="!uid && profile.type !== 'City' && profile.place"
      :title="`${invitesLeft} invites left`"
      :description="
        `${profile.name} invites you to get a free VIP membership for faster networking, get rewards, discover dance flashmobs and VIP events`
      "
      button="Accept Invitation"
      :url="`/signin?invitedBy=${profile.username}`"
      class="my-0"
    />

    <div
      v-if="uid === profile.id"
      class="w-full flex justify-center p-4 mt-4 space-x-4"
    >
      <TButton to="/events/-/edit" type="primary">{{
        $t('myprofile.addEvent')
      }}</TButton>
      <TButton to="/posts/-/edit" type="base">{{
        $t('myprofile.addPost')
      }}</TButton>
    </div>

    <TPreview v-if="profile.story" :content="profile.story" class="p-4" />

    <TProfileDetails v-if="profile.type !== 'City'" :profile="profile" />

    <div
      v-if="profile.id !== profile.createdBy && profile.type !== 'City'"
      class="py-4 flex justify-center"
    >
      <TButton
        type="simple"
        label="Claim my profile"
        :href="`mailto:support@wedance.vip?subject=Claim ${profile.username}`"
      />
    </div>

    <TPostList
      v-if="profile.type !== 'City'"
      :filter="{ username: profile.username }"
      class="mt-4 w-full border-t"
    />

    <div
      v-if="profile.type === 'City' && profile.instagram"
      class="bg-gray-100 py-4 flex justify-center"
    >
      <div class="max-w-md py-4 space-y-1">
        <div class="flex justify-center"></div>
        <h3 class="text-2xl font-extrabold text-center">
          Follow us
        </h3>
        <p class="text-center">
          We regularly post event announcements and introduce new members on our
          social media.
        </p>
        <div class="p-4 flex flex-wrap gap-2 items-center justify-center">
          <TButton
            v-if="profile.youtube"
            allow-guests
            icon="youtube"
            type="round"
            icon-size="6"
            :href="profile.youtube"
          />
          <TButton
            v-if="profile.instagram"
            allow-guests
            icon="instagram"
            type="round"
            icon-size="6"
            :href="profile.instagram"
          />
          <TButton
            v-if="profile.telegram"
            allow-guests
            icon="telegram"
            type="round"
            icon-size="6"
            :href="profile.telegram"
          />
          <TButton
            v-if="profile.twitter"
            allow-guests
            icon="twitter"
            type="round"
            icon-size="6"
            :href="profile.twitter"
          />
          <TButton
            v-if="profile.tiktok"
            allow-guests
            icon="tiktok"
            type="round"
            icon-size="6"
            :href="profile.tiktok"
          />
          <TButton
            v-if="profile.facebook"
            allow-guests
            icon="facebook"
            type="round"
            icon-size="6"
            :href="profile.facebook"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue-demi'
import { useApp } from '~/use/app'
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { getExcerpt } from '~/utils'
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
  setup(props) {
    const { uid, isAdmin, can } = useAuth()
    const { profileFields } = useProfiles()
    const { getCity } = useApp()
    const { t } = useI18n()
    const { remove } = useDoc('profiles')
    const invitesLeft = 5
    const community = computed(() => getCity(props.profile?.place))
    const intro = {
      fields: [
        {
          name: 'photo',
          label: t('myprofile.intro.photo'),
        },
        {
          name: 'gender',
          label: t('myprofile.intro.gender'),
        },
        {
          name: 'styles',
          label: t('myprofile.intro.styles'),
        },
        {
          name: 'bio',
          label: t('myprofile.intro.bio'),
        },
        {
          name: 'place',
          label: t('myprofile.intro.place'),
        },
        {
          name: 'objectives',
          label: t('myprofile.intro.objectives'),
        },
      ],
      missing: [],
      visible: false,
    }
    for (const field of intro.fields) {
      if (!props.profile[field.name]) {
        intro.missing.push(field)
        intro.visible = true
      }
    }

    const events = ref([])

    onMounted(async () => {
      let result = []
      result = [
        ...result,
        ...(await getEventsOrganisedBy(props.profile?.username)),
      ]
      result = [
        ...result,
        ...(await getEventsWithArtist(props.profile?.username)),
      ]
      result = [
        ...result,
        ...(await getEventsWithGuest(props.profile?.username)),
      ]

      events.value = result
    })

    return {
      intro,
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
    }
  },
}
</script>
