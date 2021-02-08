<template>
  <div
    class="font-sans leading-normal tracking-normal antialiased min-h-screen flex flex-col"
  >
    <header class="border-b p-4">
      <div class="flex items-center justify-start">
        <THamburger v-model="isMenuOpen" class="md:hidden" />
        <router-link to="/">
          <TIcon name="logo-horizontal-dark" />
        </router-link>
        <div class="flex-grow mx-4">
          <TInput
            v-model="query"
            placeholder="Search dancers, workshops, parties and more"
            class="rounded-full"
          />
        </div>
        <div v-if="!uid">
          <TButton to="/signin">Sign in</TButton>
        </div>
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

    <!-- :class="noContainer ? '' : 'p-4 mx-auto container max-w-xl mb-16'" -->

    <div class="flex-grow flex">
      <nav class="w-20 flex-initial border-r text-xs">
        <!-- :class="isMenuOpen ? '' : 'hidden'" -->

        <div class="block p-2 items-center flex flex-col justify-center my-1">
          <TMenu v-if="uid">
            <template slot="button">
              <div class="flex cursor-pointer rounded-full">
                <TProfilePhoto size="lg" :uid="uid" />
              </div>
            </template>
            <template slot="menu">
              <div class="w-32 py-2 bg-white rounded-lg shadow-xl border">
                <div v-if="isAdmin()" class="text-red">
                  <TButton to="/admin/matches" type="nav-admin"
                    >Matches</TButton
                  >
                  <TButton to="/admin/reports" type="nav-admin"
                    >Reports</TButton
                  >
                  <TButton to="/admin/tags" type="nav-admin">Tags</TButton>
                  <TButton to="/admin/accounts" type="nav-admin"
                    >Accounts</TButton
                  >
                  <TButton to="/admin/cities" type="nav-admin">Cities</TButton>
                  <TButton to="/admin/templates" type="nav-admin"
                    >Templates</TButton
                  >
                  <TButton to="/admin/emails" type="nav-admin">Emails</TButton>
                </div>
                <TButton
                  v-if="getProfile(uid).username"
                  type="nav"
                  :to="`/u/${getProfile(uid).username}`"
                  >My Profile</TButton
                >
                <TButton type="nav" to="/settings">Settings</TButton>
                <TButton type="nav" href="/about" target="_blank"
                  >About</TButton
                >
                <TButton
                  type="nav"
                  href="mailto:support@wedance.vip"
                  target="_blank"
                  >Support</TButton
                >
                <TButton type="nav" to="/signout">Log out</TButton>
              </div>
            </template>
          </TMenu>
        </div>

        <router-link
          to="/"
          class="block p-2 items-center flex flex-col justify-center"
        >
          <TIcon class="w-6 h-6 mx-auto" name="fire" />
          <span class="hidden md:block">Trends</span>
        </router-link>

        <router-link
          to="/people"
          class="block p-2 items-center flex flex-col justify-center"
        >
          <TIcon class="w-6 h-6 mx-auto" name="friends" />
          <span class="hidden md:block">Community</span>
        </router-link>

        <router-link
          to="/events"
          class="block p-2 items-center flex flex-col justify-center"
        >
          <TIcon class="w-6 h-6 mx-auto" name="calendar" />
          <span class="hidden md:block">Events</span>
        </router-link>
      </nav>
      <div class="p-4 flex-initial flex-grow">
        <div class="mx-auto max-w-xl">
          <nuxt />
        </div>
      </div>
    </div>

    <TFooter />
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
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
    showAuthPopup: false,
    query: ''
  }),
  computed: {
    isHome() {
      return this.$route.name === 'index'
    }
  },
  watch: {
    $route() {
      this.updateMenu()
    }
  },
  mounted() {
    this.updateMenu()

    window &&
      window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault()
        window.deferredPrompt = event
      })

    const routedCity = this.$route.query.city

    if (routedCity) {
      this.currentCity = routedCity
    }

    if (
      !this.currentCity &&
      this.$route.fullPath !== '/' &&
      !this.$route.params.slug
    ) {
      this.$router.push('/')
    }
  },
  methods: {
    updateMenu() {
      this.isMenuOpen = false
    }
  },
  setup() {
    const { uid, account, isAdmin } = useAuth()
    const { docs: tagDocs } = useCollection('tags')
    const { getProfile } = useProfiles()
    const { currentCity } = useCities()
    const tags = computed(() =>
      tagDocs.value.map((doc) => ({ key: doc.id, label: doc.id }))
    )

    return {
      account,
      getProfile,
      uid,
      tags,
      isAdmin,
      currentCity
    }
  }
}
</script>

<style>
nav .nuxt-link-exact-active {
  @apply text-primary;
}
</style>
