<template>
  <div>
    <div
      v-if="can('edit', 'profiles', profile)"
      class="mb-2 flex items-start justify-center"
    >
      <TButton
        v-if="isAdmin()"
        icon="edit"
        :to="`/${profile.username}/edit`"
        class="hover:text-blue-500"
        label="Edit"
      />
      <TButton
        v-else
        icon="edit"
        to="/settings?tab=profile"
        class="hover:text-blue-500"
        label="Edit"
      />
    </div>

    <div class="flex flex-col items-center">
      <portal to="title">
        <router-link to="/" class="flex items-center">
          <TIcon name="icon" size="8" />
          <h1 class="ml-1 font-lato text-lg font-bold">
            {{ profile.username }}
          </h1>
        </router-link>
      </portal>

      <img
        v-if="profile.socialCover"
        :src="profile.socialCover"
        class="cursor-pointer"
        @click="download()"
      />
      <img v-else-if="profile.photo" :src="profile.photo" />

      <div class="flex w-full justify-between items-center p-2">
        <div>
          <div class="font-bold text-lg leading-none">
            {{ profile.name }}
          </div>
          <div class="text-sm text-gray-700">
            {{ profile.community }}
            <span v-if="profile.height">• {{ profile.height }}cm</span>
            <span v-if="profile.weight">• {{ profile.weight }}kg</span>
          </div>
        </div>
        <div class="flex space-x-2 items-center">
          <TButtonShare
            :id="profile.id"
            collection="profiles"
            :city="profile.community"
            :url="`https://wedance.vip/${profile.username}`"
            :text="`${profile.username} at WeDance`"
            :file="profile.socialCover"
            :file-name="profile.username"
          />
          <TCardActions
            :id="profile.id"
            collection="profiles"
            :item="profile"
          />
        </div>
      </div>

      <div v-if="profile.bio && !profile.socialCover" class="mt-4">
        <div>{{ profile.bio }}</div>
      </div>

      <WTeaser
        v-if="profile.partner === 'Yes'"
        title="I am looking for a dance partner"
        :description="profile.partnerBio"
        class="w-full mt-4"
      />

      <div
        class="mt-4 flex space-x-2 items-center justify-end border p-2 w-full"
      >
        <TButton
          v-if="profile.website"
          :href="profile.website"
          icon="house"
          type="round"
          icon-size="6"
        />
        <TButton
          v-if="profile.telegram"
          icon="telegram"
          type="round"
          icon-size="6"
          :href="`https://t.me/${profile.telegram}`"
        />
        <TButton
          v-if="profile.instagram"
          icon="instagram"
          type="round"
          icon-size="6"
          :href="`https://instagram.com/${profile.instagram}`"
        />
        <TButton
          v-if="profile.tiktok"
          icon="tiktok"
          type="round"
          icon-size="6"
          class="hidden md:block"
          :href="`https://tiktok.com/${profile.tiktok}`"
        />
        <TButton
          v-if="profile.youtube"
          icon="youtube"
          type="round"
          icon-size="6"
          class="hidden md:block"
          :href="`https://youtube.com/${profile.youtube}`"
        />
        <TButton
          v-if="profile.twitter"
          icon="twitter"
          type="round"
          icon-size="6"
          class="hidden md:block"
          :href="`https://twitter.com/${profile.twitter}`"
        />
        <TButton
          v-if="profile.facebook"
          icon="facebook"
          type="round"
          icon-size="6"
          class="hidden md:block"
          :href="`https://fb.com/${profile.facebook}`"
        />
        <TProfileContact :uid="profile.createdBy" />
      </div>
    </div>

    <div v-if="uid === profile.id" class="w-full flex justify-center p-4 mt-4">
      <TButton to="/events/-/edit" type="primary">{{
        $t('myprofile.events.add')
      }}</TButton>
    </div>

    <TEventList
      :filter="{ createdBy: profile.createdBy }"
      class="mt-4 w-full"
    />

    <TPreview v-if="profile.story" :content="profile.story" class="mt-8 px-4" />

    <div class="iconed border shadow p-4 space-y-4 mt-8">
      <dl v-if="profile.locales">
        <dt class="font-bold mr-1">Languages:</dt>
        <dd>{{ getLanguages(profile.locales) }}</dd>
      </dl>
      <dl v-else-if="profile.languages">
        <dt class="font-bold mr-1">Languages:</dt>
        <dd>{{ profile.languages }}</dd>
      </dl>
      <div v-if="profile.objectives">
        <h2 class="font-bold">Objectives:</h2>
        <div>{{ getObjectives(profile.objectives) }}</div>
      </div>
      <div v-if="profile.learning">
        <h2 class="font-bold">Which dance topics you are interested in?</h2>
        <div>{{ profile.learning }}</div>
      </div>
      <div v-if="profile.styles">
        <h2 class="font-bold">Dance styles:</h2>
        <TStyles :value.sync="profile.styles" />
      </div>
      <div v-else-if="profile.skills">
        <h2 class="font-bold">Dance styles:</h2>
        <div>{{ profile.skills }}</div>
      </div>
      <div v-if="profile.jobs">
        <h2 class="font-bold">Skills:</h2>
        <div>{{ profile.jobs }}</div>
      </div>

      <dl class="mt-4 md:flex">
        <dt class="font-bold mr-1">Joined:</dt>
        <dd>{{ getDateTimeYear(profile.createdAt) }}</dd>
      </dl>

      <dl v-if="profile.lastLoginAt" class="mt-4 md:flex">
        <dt class="font-bold mr-1">Last seen:</dt>
        <dd>{{ getDateTimeYear(profile.lastLoginAt) }}</dd>
      </dl>

      <dl class="mt-4 md:flex">
        <dt class="font-bold mr-1">Visibility:</dt>
        <dd>{{ profile.visibility }}</dd>
      </dl>
    </div>

    <div v-if="uid === profile.id" class="w-full flex justify-center p-4 mt-4">
      <TButton to="/posts/-/edit" type="primary">{{
        $t('myprofile.posts.add')
      }}</TButton>
    </div>

    <TPostList :filter="{ createdBy: profile.createdBy }" class="mt-4 w-full" />
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import useAuth from '~/use/auth'
import useProfiles from '~/use/profiles'
import { getDateTimeYear } from '~/utils'
import languages from '~/assets/languages'

export default {
  props: {
    profile: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const { uid, can, isAdmin } = useAuth()
    const { objectivesList } = useProfiles()

    return {
      uid,
      getDateTimeYear,
      objectivesList,
      can,
      isAdmin
    }
  },
  methods: {
    download() {
      saveAs(this.profile.socialCover, `${this.profile.username}.png`)
    },
    getObjectives(objectives) {
      return Object.keys(objectives)
        .map((o) => this.objectivesList.find((i) => i.value === o).label)
        .join(', ')
    },
    getLanguage(lang) {
      return languages.find((l) => l.value === lang)
    },
    getLanguages(langs) {
      if (!langs) {
        return []
      }

      return Object.keys(langs)
        .map((lang) => this.getLanguage(lang))
        .map((l) => l.label)
        .join(', ')
    }
  }
}
</script>
