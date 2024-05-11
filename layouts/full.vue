<template>
  <div class="bg-gray-200 min-h-screen pb-4 border-t-2 border-primary">
    <nav class="hidden md:flex p-4 gap-2 justify-start">
      <router-link :to="city.username ? `/explore/${city.username}` : '/'">
        <TIcon name="logo-horizontal-dark" />
      </router-link>
      <div class="flex-grow"></div>
      <TButton
        v-if="uid"
        allow-guests
        type="primary"
        :to="localePath(`/${username}`)"
        :label="$t('nav.myProfile')"
      />
      <TButton
        v-else
        allow-guests
        type="primary"
        :to="localePath('/signin')"
        :label="$t('auth.signin')"
      />
      <TQrCodeButton label="Share" />
    </nav>
    <div
      class="font-sans leading-normal tracking-normal antialiased flex flex-col mx-auto max-w-xl bg-white rounded shadow"
    >
      <TAuthPopup />

      <div
        v-if="isMenuOpen"
        class="fixed w-full h-full top-0 left-0 bg-black opacity-50 z-50"
        @click="isMenuOpen = false"
      />
      <transition name="slide">
        <div
          v-if="isMenuOpen"
          class="bg-white fixed left-0 w-56 bottom-0 top-0 z-50 shadow-lg md:hidden"
        >
          <MainNavigation :uid="uid" :username="username" />
        </div>
      </transition>

      <THamburger v-model="isMenuOpen" class="absolute mt-2 md:hidden" />

      <div>
        <nuxt class="w-full" />
      </div>
    </div>
  </div>
</template>

<script>
import features from 'platform-detect'
import ls from 'local-storage'
import { ref, watch } from '@nuxtjs/composition-api'
import { version } from '../package.json'
import { useAuth } from '~/use/auth'
import { useApp } from '~/use/app'
import { analytics, track } from '~/plugins/firebase'
import { useCities } from '~/use/cities'

export default {
  name: 'DefaultLayout',
  props: {
    noContainer: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isMenuOpen: false,
    isSearchShown: false,
    query: '',
  }),
  computed: {
    isHome() {
      return this.$route.name === 'index'
    },
  },
  watch: {
    '$route.path': 'onPageView',
    'profile.username': 'onProfileLoad',
    loading: 'checkOnboarding',
  },
  mounted() {
    this.onPageView()

    this.checkOnboarding()
  },
  methods: {
    checkOnboarding() {
      if (!this.profileLoaded) {
        return
      }

      if (this.uid && !this.profile?.username) {
        this.$router.push('/onboarding')
      }
    },
    showSearch() {
      this.isSearchShown = true
    },
    onProfileLoad() {
      const name = this.account?.name || this.profile?.name || ''
      const names = name.split(' ')

      const contact = {
        email: this.account?.email,
        phone: this.account?.phone,
        uid: this.uid,
        username: this.profile?.username,
        firstname: names[0] || '',
        lastname: names[1] || '',
        community: this.getCity(this.profile?.place),
        facebook: this.profile?.facebook || '',
        instagram: this.profile?.instagram || '',
        telegram: this.profile?.telegram || '',
        type: this.profile?.type || '',
        partner: this.profile?.partner || '',
        teacher: this.profile?.teacher || '',
      }

      const _hsq = (window._hsq = window._hsq || [])
      _hsq.push(['identify', contact])

      this.$posthog.identify(this.uid, {
        email: contact.email,
        username: contact.username,
        type: contact.type,
        community: contact.community,
        gender: this.profile?.gender,
      })

      this.$sentry.setUser({
        email: contact.email,
        username: contact.username,
        id: contact.uid,
      })

      if (analytics) {
        analytics.setUserId(contact.uid)
        analytics.setUserProperties({
          community: contact.community,
          type: this.profile?.type,
          gender: this.profile?.gender,
          visibility: this.profile?.visibility,
          partner: this.profile?.partner,
          teacher: this.profile?.teacher,
        })
      }
    },
    onPageView() {
      this.isMenuOpen = false

      setTimeout(() => {
        const _hsq = (window._hsq = window._hsq || [])
        _hsq.push(['setPath', this.$route.path])
        _hsq.push(['trackPageView'])

        const screen = {
          app_name: features.pwa ? 'pwa' : 'web',
          screen_name: document.title,
          screen_view: this.$route.name,
          app_version: version,
        }

        track('page_view')
        track('screen_view', screen)
      }, 500)
    },
  },
  head() {
    return this.$nuxtI18nSeo()
  },
  setup() {
    const {
      uid,
      account,
      profile,
      username,
      isAdmin,
      profileLoaded,
      updateProfile,
      loading,
    } = useAuth()
    const { getCity } = useApp()
    const { city } = useCities()

    const bannerNps = ref(ls('bannerNps'))
    watch(bannerNps, (val) => {
      updateProfile({ bannerNps: val })
      ls('bannerNps', val)
    })

    const bannerV3Beta = ref(ls('bannerV3Beta'))

    watch(bannerV3Beta, (val) => {
      updateProfile({ bannerV3Beta: val })
      ls('bannerV3Beta', val)
    })

    return {
      bannerNps,
      bannerV3Beta,
      username,
      account,
      profile,
      uid,
      isAdmin,
      getCity,
      city,
      loading,
      profileLoaded,
    }
  },
}
</script>
