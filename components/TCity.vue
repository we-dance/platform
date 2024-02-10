<template>
  <div>
    <THeader show-logo class="md:hidden" />
    <div class="p-4">
      <h1 class="text-2xl font-bold">
        {{ view === 'parties' ? 'Parties' : 'Classes' }} in {{ profile.name }}
      </h1>
      <TProfileStats :profile="profile" />
      <div class="text-xs">
        <ul class="list-disc pl-4 pt-4">
          <li>
            Looking for partner?
            <router-link to="/find-partner/start" class="underline font-bold"
              >Find a dance partner</router-link
            >
          </li>
          <li v-if="!$route.query.view">
            Want to learn to dance?
            <router-link to="/Munich?view=classes" class="underline font-bold"
              >See classes</router-link
            >
          </li>
          <li v-if="$route.query.view === 'classes'">
            Where can I dance?
            <router-link to="/Munich" class="underline font-bold"
              >See parties</router-link
            >
          </li>
          <li>
            Not in {{ profile.name }}?
            <router-link to="/settings?tab=profile" class="underline font-bold"
              >Change dancing city</router-link
            >
          </li>
        </ul>
      </div>
    </div>

    <TCalendar
      :key="view"
      :profile="profile"
      :view="view"
      class="w-full border-t"
    />

    <WTeaser
      v-if="profile.website"
      :allow-guests="false"
      :title="$t('teaser.chat.title')"
      :description="$t('teaser.chat.description')"
      :button="$t('teaser.chat.btnChatExists')"
      :href="profile.website"
      class="w-full mt-4"
    />

    <WTeaser
      v-if="!profile.website"
      :allow-guests="false"
      :title="$t('teaser.chat.title')"
      :description="$t('teaser.chat.description')"
      :button="$t('teaser.chat.btnChatMissing')"
      :href="internationalChatLink"
      class="w-full mt-4"
    />

    <div v-if="profile.instagram" class="bg-gray-100 py-4 flex justify-center">
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

    <div>
      <h3 class="text-2xl font-extrabold text-center p-4">
        Dance Events Near Me
      </h3>
      <ul>
        <li
          v-for="style in ['Salsa', 'Bachata', 'Kizomba', 'Zouk', 'Afrobeats']"
          :key="style"
          class="p-4 border-t w-full"
        >
          <nuxt-link :to="localePath(`/${profile.username}?style=${style}`)"
            >{{ style }} in {{ profile.name }}</nuxt-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue-demi'
import { useApp } from '~/use/app'
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { getExcerpt, getCityMeta, getDateObect } from '~/utils'
import { useDoc } from '~/use/doc'
import { useCities } from '~/use/cities'

export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  head() {
    return getCityMeta(this.profile, [], this.$route.query.style)
  },
  setup(props, { root }) {
    const internationalChatLink = 'https://t.me/+Vxw15sDG-dWpqHDj'
    const { uid, isAdmin, can } = useAuth()
    const { profileFields } = useProfiles()
    const { getCity } = useApp()
    const { remove } = useDoc('profiles')
    const { load, doc: promo } = useDoc('posts')
    const invitesLeft = 5
    const { switchCity } = useCities()
    const community = computed(() => getCity(props.profile?.place))
    const view = computed(() => root.$route.query.view || 'parties')

    const subscribersCount = computed(() => {
      return props.profile?.watch?.usernames?.length || 0
    })

    onMounted(async () => {
      await switchCity(props.profile.place)
      load('yEfJWBnepn0u6gOVmUor')
    })

    return {
      getDateObect,
      promo,
      internationalChatLink,
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
      view,
    }
  },
}
</script>
