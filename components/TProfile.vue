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
        <TIcon v-else name="undraw_profile_pic" class="w-full rounded-full" />
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

    <TEventList
      v-if="profile.type !== 'City'"
      title="Organising"
      :filter="{ 'org.username': profile.username }"
      :username="profile.username"
      class="w-full border-b"
    />

    <TEventList
      v-if="profile.type !== 'City'"
      title="Attending as Special Guest"
      :filter="{ artistsList: profile.username }"
      :username="profile.username"
      comparison="array-contains"
      class="w-full border-b"
    />

    <TEventList
      v-if="profile.type !== 'City'"
      title="Attending as Guest"
      :filter="{ [`star.list.${profile.username}`]: true }"
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

    <TEventList
      v-if="profile.type === 'City' && profile.username !== 'Travel'"
      :filter="{ place: profile.place }"
      :community="profile.username"
      :username="profile.username"
      class="mt-4 w-full border-b pb-8"
    />

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
      v-if="profile.id !== profile.createdBy"
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

    <WTeaser
      v-if="profile.type === 'City'"
      title="Event missing?"
      description="You know a good dance event and it is not listed in calendar?"
      button="Recommend an Event"
      url="/events/-/edit"
      class="mt-4"
    />

    <WTeaser
      v-if="profile.type === 'City'"
      title="Need more?"
      description="Ask local dancers, artists and organisers."
      button="Ask Community"
      url="/community"
      class="mt-4"
    />

    <WTeaser
      v-if="profile.type === 'City' && profile.telegram"
      title="On Time!"
      description="Be the first one to know about new events. Reserve a spot. Get the early bird price."
      button="Follow on Telegram"
      :href="profile.telegram"
      class="mt-4"
    />

    <WTeaser
      v-if="profile.type === 'City' && profile.instagram"
      title="Photos and Videos"
      description="Discover other dancers. Participate in dance challenges. Show your talent and tag us in your stories on Instagram."
      button="Follow on Instagram"
      :href="profile.instagram"
      class="mt-4"
    />
  </div>
</template>

<script>
import { computed } from 'vue-demi'
import { useApp } from '~/use/app'
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { getExcerpt } from '~/utils'
import { useI18n } from '~/use/i18n'
import { useDoc } from '~/use/doc'

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
    }
  },
}
</script>
