<template>
  <div>
    <THeader>
      <TButton
        v-if="profile.type === 'City'"
        slot="left"
        allow-guests
        to="/cities"
        icon="place"
        :label="profile.name"
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
          <TProfileDetails v-if="profile.type !== 'City'" :profile="profile" />
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

        <div v-if="profile.type === 'City'" class="flex space-x-2 mt-4">
          <TReaction
            :label="$t('Subscribe')"
            :toggled-label="$t('Unsubscribe')"
            field="watch"
            icon="BellIcon"
            hide-count
            :item="profile"
            collection="profiles"
          />
        </div>
      </div>
    </div>

    <div v-if="profile.type !== 'City'" class="flex space-x-2 p-4 justify-end">
      <TButton
        v-if="uid === profile.id"
        type="primary"
        :label="$t('myprofile.edit')"
        to="/settings?tab=profile"
      />
      <TButton v-if="uid === profile.id" to="/posts/-/edit" type="base">{{
        $t('myprofile.addPost')
      }}</TButton>
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

    <TCommunity
      v-if="profile.type === 'City' && profile.username !== 'Travel'"
      class="pt-4 border-t"
    />

    <template v-if="$route.query.beta">
      <TCalendar
        v-if="profile.type === 'City' && profile.username !== 'Travel'"
        class="mt-4 w-full border-t pt-4 pb-8"
      />
    </template>

    <template v-if="!$route.query.beta">
      <TEventListNoLoad
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

    <WTeaser
      v-if="profile.type === 'City' && profile.website"
      :allow-guests="false"
      :title="$t('teaser.chat.title')"
      :description="$t('teaser.chat.description')"
      :button="$t('teaser.chat.btnChatExists')"
      :href="profile.website"
      class="w-full mt-4"
    />

    <WTeaser
      v-if="profile.type === 'City' && !profile.website"
      :allow-guests="false"
      :title="$t('teaser.chat.title')"
      :description="$t('teaser.chat.description')"
      :button="$t('teaser.chat.btnChatMissing')"
      :href="internationalChatLink"
      class="w-full mt-4"
    />

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
          {{ $t('profile.follow.title') }}
        </h3>
        <p class="text-center">
          {{ $t('profile.follow.description') }}
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
import { getExcerpt, getMeta } from '~/utils'
import { useI18n } from '~/use/i18n'
import { useDoc } from '~/use/doc'
import {
  getEventsInPlace,
  getEventsOrganisedBy,
  getEventsWithArtist,
  getEventsWithGuest,
  getFestivals,
} from '~/use/events'
import { useCities } from '~/use/cities'

export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  head() {
    return getMeta('profiles', this.profile)
  },
  setup(props) {
    const internationalChatLink = 'https://t.me/+Vxw15sDG-dWpqHDj'
    const { uid, isAdmin, can } = useAuth()
    const { profileFields } = useProfiles()
    const { switchCity } = useCities()
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

    const subscribersCount = computed(() => {
      return props.profile?.watch?.count || 0
    })

    onMounted(async () => {
      let result = []

      if (props.profile.username === 'Travel') {
        result = await getFestivals()
      } else if (props.profile.type === 'City') {
        await switchCity(props.profile.place)
        result = await getEventsInPlace(props.profile.place)
      } else {
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
      }

      events.value = result
    })

    return {
      internationalChatLink,
      intro,
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
    }
  },
}
</script>
