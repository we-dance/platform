<template>
  <div
    class="mx-auto flex min-h-screen max-w-2xl flex-col border-r font-sans leading-normal tracking-normal antialiased"
  >
    <TPopup
      v-if="showAuthPopup"
      :title="$t('popup.auth.title')"
      @close="showAuthPopup = false"
    >
      <div class="my-4 flex w-64 flex-col justify-center text-center">
        <div class="p-4">
          {{ $t('popup.auth.body', { action: showAuthPopup }) }}
        </div>
        <TButton
          allow-guests
          class="mt-2"
          type="primary"
          :to="`/signin?target=${$route.path}`"
          >{{ $t('popup.auth.signin') }}</TButton
        >
      </div>
    </TPopup>

    <div
      v-if="isMenuOpen"
      class="fixed top-0 left-0 z-20 h-full w-full bg-black opacity-50"
      @click="isMenuOpen = false"
    />
    <transition name="slide">
      <div
        v-if="isMenuOpen"
        class="fixed left-0 bottom-0 top-0 z-30 w-56 bg-white shadow-lg md:hidden"
      >
        <MainNavigation :uid="uid" :username="username" />
      </div>
    </transition>

    <THamburger v-model="isMenuOpen" class="absolute mt-2 md:hidden" />

    <div class="flex flex-grow">
      <MainNavigation
        :uid="uid"
        :username="username"
        class="hidden w-64 flex-initial md:block"
      />
      <nuxt class="w-full flex-grow" />
    </div>
  </div>
</template>

<script>
import features from 'platform-detect'
import { version } from '../package.json'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
import { useApp } from '~/use/app'
import { analytics, track } from '~/plugins/firebase'

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
    return {
      htmlAttrs: {
        lang: this.$i18n.locale,
      },
    }
  },
  setup() {
    const { uid, account, profile, username, isAdmin, showAuthPopup } =
      useAuth()
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
