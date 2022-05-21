<template>
  <div>
    <THeader :title="profile.username">
      <TButton type="nav" icon="search" to="/search" />
      <TDropdown>
        <TPopupEdit
          v-if="isAdmin()"
          type="context"
          :fields="profileFields"
          :label="$t('myprofile.edit')"
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
      </TDropdown>
    </THeader>

    <template v-if="uid === profile.id">
      <div v-if="intro.visible" class="m-4 rounded border p-4">
        <h2 class="border-b p-4 font-bold text-lg -m-4 mb-4">
          {{ $t('myprofile.intro.title') }}
        </h2>
        <div class="typo">
          <p>
            {{ $t('myprofile.intro.description1') }}
          </p>
          <div>
            <i18n
              path="myprofile.intro.description2"
              tag="p"
              for="myprofile.intro.community"
            >
              <NuxtLink to="/community">{{
                $t('myprofile.intro.community')
              }}</NuxtLink>
            </i18n>
          </div>
          <i18n
            path="myprofile.intro.description3"
            tag="p"
            for="myprofile.edit"
          >
            <NuxtLink to="/settings?tab=profile">{{
              $t('myprofile.edit')
            }}</NuxtLink>
          </i18n>
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
            {{ $t('myprofile.ambassador.description1') }}
          </p>
          <p>
            {{
              $t('myprofile.ambassador.description2', { community: community })
            }}
          </p>
        </div>

        <w-profile username="CharlyAl"></w-profile>

        <div class="mt-4">
          {{ $t('myprofile.ambassador.description2') }}
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

        <TButton
          v-if="uid !== profile.id && profile.type !== 'City'"
          type="base"
          class="mt-4"
          :to="`/chat/${profile.username}`"
          >{{ $t('profile.chat.label') }}</TButton
        >
        <TButton type="base" class="mt-4" to="/events/-/edit">{{
          $t('myprofile.addEvent')
        }}</TButton>
      </div>
    </div>

    <TProfileContacts :profile="profile" class="py-2 mb-4 bg-gray-100" />

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
      :filter="{ 'org.username': profile.username }"
      class="mt-4 w-full"
    />

    <TEventList
      v-if="profile.type === 'City'"
      :filter="{ place: profile.place }"
      :community="profile.username"
      class="mt-4 w-full"
    />

    <TPreview v-if="profile.story" :content="profile.story" class="p-4" />

    <TProfileDetails v-if="profile.type !== 'City'" :profile="profile" />

    <div v-if="uid === profile.id" class="w-full flex justify-center p-4 mt-4">
      <TButton to="/posts/-/edit" type="primary">{{
        $t('myprofile.addPost')
      }}</TButton>
    </div>

    <TPostList
      :filter="{ username: profile.username }"
      class="mt-4 w-full border-t"
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
    }
  },
}
</script>
