<template>
  <div>
    <TCityHeader :profile="profile" :view="view" />

    <div class="p-4">
      <h1 class="text-2xl font-bold">
        {{ view === 'parties' ? 'Parties' : 'Classes' }} in {{ profile.name }}
      </h1>

      <div class="text-sm">
        Discover the vibrant dance scene in {{ profile.name }}. Browse through a
        curated list of dance
        {{ view === 'parties' ? 'parties' : 'classes' }} and filter by your
        favorite styles like Salsa, Bachata, Kizomba, and more.
      </div>
      <TProfileStats :profile="profile" />
    </div>

    <TCalendar
      :key="view + ($route.query.style || '')"
      :profile="profile"
      :view="view"
      class="w-full border-t"
    />

    <WTeaser
      :allow-guests="false"
      :title="$t('teaser.feed.title')"
      :description="$t('teaser.feed.description')"
      :button="$t('teaser.feed.btn')"
      :url="`/explore/${profile.username}/tips`"
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

    <div class="p-4 text-gray-600">
      <h3 class="text-xs font-extrabold text-center">
        Dance Events Near Me
      </h3>
      <ul class="text-xs text-center">
        <li
          v-for="style in [
            'Salsa',
            'Bachata',
            'Kizomba',
            'BrazilianZouk',
            'Afrobeats',
          ]"
          :key="style"
          class="inline-block p-1"
        >
          <nuxt-link
            :to="localePath(`/explore/${profile.username}?style=${style}`)"
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
    view: {
      type: String,
      default: 'parties',
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
    }
  },
}
</script>
