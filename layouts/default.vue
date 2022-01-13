<template>
  <div
    class="font-sans leading-normal tracking-normal antialiased min-h-screen flex flex-col mx-auto max-w-2xl border-r"
  >
    <TPopup
      v-if="showAuthPopup"
      title="Members only"
      @close="showAuthPopup = false"
    >
      <div class="my-4 w-64 flex flex-col justify-center text-center">
        <div class="p-4">Sign in to {{ showAuthPopup }}</div>
        <TButton class="mt-2" type="primary" to="/signin">Sign in</TButton>
      </div>
    </TPopup>

    <div
      v-if="isMenuOpen"
      class="fixed w-full h-full top-0 left-0 bg-black opacity-50 z-20"
      @click="isMenuOpen = false"
    />
    <transition name="slide">
      <div
        v-if="isMenuOpen"
        class="bg-white fixed left-0 w-56 bottom-0 top-0 z-30 shadow-lg md:hidden"
      >
        <MainNavigation :uid="uid" :username="username" />
      </div>
    </transition>

    <THamburger v-model="isMenuOpen" class="absolute mt-2 md:hidden" />

    <div class="flex-grow flex">
      <MainNavigation
        :uid="uid"
        :username="username"
        class="hidden md:block flex-initial w-64"
      />
      <nuxt class="flex-grow w-full" />
    </div>
  </div>
</template>

<script>
import features from 'platform-detect'
import { version } from '../package.json'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
import { useApp } from '~/use/app'

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
  },
  mounted() {
    this.onPageView()

    window &&
      window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault()
        window.deferredPrompt = event
      })

    const routedCity = this.$route.query.city

    if (routedCity) {
      this.changeCityByName(routedCity)
    }
  },
  methods: {
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

      this.$sentry.setUser({
        email: contact.email,
        username: contact.username,
        id: contact.uid,
      })

      this.$fire.analytics.setUserId(contact.uid)
      this.$fire.analytics.setUserProperties({
        community: contact.community,
        type: this.profile?.type,
        gender: this.profile?.gender,
        visibility: this.profile?.visibility,
        partner: this.profile?.partner,
        teacher: this.profile?.teacher,
      })
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

        this.$fire.analytics.logEvent('page_view')
        this.$fire.analytics.logEvent('screen_view', screen)
      }, 500)
    },
  },
  head() {
    return {
      htmlAttrs: {
        lang: this.$i18n.locale,
      },
    }
  },
  setup() {
    const {
      uid,
      account,
      profile,
      username,
      isAdmin,
      showAuthPopup,
    } = useAuth()
    const { changeCityByName } = useCities()
    const { getCity } = useApp()

    return {
      username,
      account,
      profile,
      uid,
      isAdmin,
      getCity,
      changeCityByName,
      showAuthPopup,
    }
  },
}
</script>
