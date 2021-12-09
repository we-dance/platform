<template>
  <div>
    <THeader :title="profile.username">
      <TButton type="nav" icon="search" to="/search" />
      <TDropdown v-if="isAdmin()">
        <TPopupEdit
          type="context"
          :fields="profileFields"
          label="Edit Profile"
          collection="profiles"
          singular="profile"
          :item="profile"
        />
      </TDropdown>
    </THeader>

    <template v-if="uid === profile.id">
      <div v-if="intro.visible" class="m-4 rounded border p-4">
        <h2 class="border-b p-4 font-bold text-lg -m-4 mb-4">
          Welcome to WeDance!
        </h2>
        <div class="typo">
          <p>
            This is your profile. A square below is a poster – your visual
            introduction.
          </p>
          <p>
            Your poster is also shown in
            <router-link to="/community">Сommunity</router-link> among other
            dancers.
          </p>
          <p>
            Click
            <router-link to="/settings?tab=profile">Edit Profile</router-link>
            and add:
          </p>
          <ul>
            <li v-for="field in intro.missing" :key="field.name">
              {{ field.label }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="false">
        <div>
          <p>
            WeDance is represented by Ambassador in local dance communities.
            Volunteers help Ambassador with different initiatives to unite local
            dancers. WeDance is created and supported by volunteers. Get
            Involved, become volunteer!
          </p>
          <p>Ambassador in {{ community }} is</p>
        </div>

        <w-profile username="CharlyAl"></w-profile>

        <div class="mt-4">
          Help us build a dance network in your city, follow and interact with
          our local social media accounts:
          <div class="mt-4 flex flex-col items-center space-y-2">
            <TButton
              icon="instagram"
              icon-size="6"
              :href="`https://instagram.com/WeDance${community}`"
              :label="`WeDance${community}`"
            />
            <TButton
              icon="facebook"
              icon-size="6"
              :href="`https://fb.com/WeDance${community}`"
              :label="`WeDance${community}`"
            />
            <TButton
              icon="telegram"
              icon-size="6"
              :href="`https://t.me/WeDance${community}`"
              :label="`WeDance${community}`"
            />
          </div>
        </div>
      </div>
    </template>

    <TItemCard>
      <template>
        <TSharePreviewPost
          collection="profiles"
          :type="profile.type"
          :username="profile.username"
          :description="getExcerpt(profile.bio)"
          :extra="community"
          :photo="profile.photo"
          :styles="profile.styles"
          size="sm"
          class="md:-mt-4 md:-mx-4"
        />

        <div class="my-2 flex justify-between">
          <div class="flex items-center">
            <div class="font-bold text-lg leading-none">
              {{ profile.name }}
            </div>
            <div class="ml-2 text-sm text-gray-700">
              <span v-if="profile.height">• {{ profile.height }}cm</span>
              <span v-if="profile.weight">• {{ profile.weight }}kg</span>
            </div>
          </div>
          <TButton
            v-if="uid !== profile.id"
            type="primary"
            :to="`/chat/${profile.username}`"
            >Chat</TButton
          >
        </div>

        <div v-if="profile.bio && profile.bio.length > 140" class="mb-2">
          {{ profile.bio }}
        </div>
      </template>

      <TProfileContacts :profile="profile" class="p-2 -mx-4 mb-4" />

      <div v-if="uid === profile.id" class="flex justify-center space-x-2">
        <TButton label="Edit Profile" to="/settings?tab=profile" />
      </div>

      <WTeaser
        v-if="profile.partner === 'Yes'"
        title="I am looking for a dance partner"
        :description="profile.partnerBio"
        class="w-full mt-4"
      />

      <TPreview v-if="profile.story" :content="profile.story" class="mt-4" />

      <TEventList
        v-if="profile.type !== 'City'"
        :filter="{ createdBy: profile.createdBy }"
        class="mt-4 w-full"
      />

      <TEventList
        v-if="profile.type === 'City'"
        :filter="{ place: profile.place }"
        :community="profile.username"
        class="mt-4 w-full"
      />

      <div v-if="uid === profile.id" class="w-full flex justify-center p-4">
        <TButton to="/events/-/edit" type="primary">{{
          $t('myprofile.events.add')
        }}</TButton>
      </div>

      <TProfileDetails v-if="profile.type !== 'City'" :profile="profile" />
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
import { computed } from 'vue-demi'
import { useApp } from '~/use/app'
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { getExcerpt } from '~/utils'

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

    const community = computed(() => getCity(props.profile?.place))

    const intro = {
      fields: [
        {
          name: 'photo',
          label: 'your photo',
        },
        {
          name: 'gender',
          label: 'your gender',
        },
        {
          name: 'styles',
          label: 'what do you dance',
        },
        {
          name: 'bio',
          label: 'teaser (short introduction)',
        },
        {
          name: 'place',
          label: 'your city',
        },
        {
          name: 'objectives',
          label: 'your objectives',
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
    }
  },
}
</script>
