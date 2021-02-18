<template>
  <div
    class="font-sans leading-normal tracking-normal antialiased min-h-screen flex flex-col"
  >
    <header class="border-b p-4">
      <div v-if="isSearchShown" class="flex">
        <TInput
          v-model="query"
          auto-focus
          placeholder="Search dancers, workshops, parties and more"
          class="w-full"
        />
        <button class="-ml-8" @click="isSearchShown = false">
          <TIcon
            name="close"
            class="w-8 h-8 rounded-full cursor-pointer hover:text-primary p-1 mr-1"
          />
        </button>
      </div>
      <div v-else class="flex items-center justify-between">
        <div class="flex flex-no-wrap items-center">
          <div class="mt-1 md:hidden">
            <THamburger v-model="isMenuOpen" />
          </div>
          <portal-target name="title">
            <router-link to="/">
              <TIcon name="logo-horizontal-dark" />
            </router-link>
          </portal-target>
        </div>
        <div class="flex-grow"></div>
        <button @click="showSearch()">
          <TIcon
            name="search"
            class="w-8 h-8 rounded-full cursor-pointer hover:text-primary p-1"
          />
        </button>
      </div>
    </header>

    <TPopup v-if="showAuthPopup">
      <div class="flex justify-between border-b pb-2 mb-4">
        <div class="font-bold">Members only</div>
        <button class="cursor-pointer" @click="showAuthPopup = false">
          <TIcon name="close" class="cursor-pointer w-6 h-6" />
        </button>
      </div>
      <div class="my-4 flex flex-col justify-center">
        <div>You need a profile to write posts</div>
        <TButton class="mt-2" to="/signin">Create Profile</TButton>
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
        <MainNavigation :uid="uid" :username="getProfile(uid).username" />
      </div>
    </transition>

    <div class="flex-grow flex">
      <MainNavigation
        :uid="uid"
        :username="getProfile(uid).username"
        class="hidden md:block flex-initial"
      />
      <div class="flex-grow p-4 mx-auto w-full max-w-xl">
        <nuxt />
      </div>
    </div>

    <TFooter />
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import features from 'platform-detect'
import { version } from '../package.json'
import useAuth from '~/use/auth'
import useCollection from '~/use/collection'
import useProfiles from '~/use/profiles'
import useCities from '~/use/cities'

export default {
  name: 'DefaultLayout',
  props: {
    noContainer: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isMenuOpen: false,
    isSearchShown: false,
    showAuthPopup: false,
    query: ''
  }),
  computed: {
    isHome() {
      return this.$route.name === 'index'
    }
  },
  watch: {
    '$route.path': 'onPageView',
    'profile.username': 'onProfileLoad'
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
      this.currentCity = routedCity
    }
  },
  methods: {
    showSearch() {
      this.isSearchShown = true
    },
    onProfileLoad() {
      const name = this.account?.name || this.profile?.name
      const names = name.split(' ')

      const contact = {
        email: this.account?.email,
        uid: this.uid,
        username: this.profile?.username,
        firstname: names[0] || '',
        lastname: names[1] || '',
        community: this.profile?.community
      }

      const _hsq = (window._hsq = window._hsq || [])
      _hsq.push(['identify', contact])

      this.$sentry.setUser({
        email: contact.email,
        username: contact.username,
        id: contact.uid
      })

      this.$fire.analytics.setUserId(contact.uid)
      this.$fire.analytics.setUserProperties({
        community: contact.community,
        type: this.profile?.type,
        gender: this.profile?.gender,
        visibility: this.profile?.visibility,
        partner: this.profile?.partner,
        teacher: this.profile?.teacher
      })
    },
    onPageView() {
      this.isMenuOpen = false

      const _hsq = (window._hsq = window._hsq || [])
      _hsq.push(['setPath', this.$route.path])
      _hsq.push(['trackPageView'])

      setTimeout(() => {
        const screen = {
          app_name: features.pwa ? 'pwa' : 'web',
          screen_name: document.title,
          screen_view: this.$route.name,
          app_version: version
        }

        this.$fire.analytics.logEvent('page_view')
        this.$fire.analytics.logEvent('screen_view', screen)
      }, 500)
    }
  },
  head() {
    return {
      htmlAttrs: {
        lang: this.$i18n.locale
      }
    }
  },
  setup() {
    const { uid, account, profile, isAdmin } = useAuth()
    const { docs: tagDocs } = useCollection('tags')
    const { getProfile } = useProfiles()
    const { currentCity } = useCities()
    const tags = computed(() =>
      tagDocs.value.map((doc) => ({ key: doc.id, label: doc.id }))
    )

    return {
      account,
      profile,
      getProfile,
      uid,
      tags,
      isAdmin,
      currentCity
    }
  }
}
</script>
