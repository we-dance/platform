<template>
  <div
    class="font-sans leading-normal tracking-normal antialiased min-h-screen flex flex-col"
  >
    <header class="bg-dark text-white">
      <div
        class="container mx-auto md:flex items-center justify-between flex-wrap p-4"
      >
        <div class="flex items-center justify-start">
          <router-link to="/" class="flex items-center pb-2">
            <TIcon class="w-6 h-6 pt-1 mr-2" name="icon" />
            <TIcon
              :class="
                currentCity
                  ? 'text-white h-4 w-32 hidden md:block'
                  : 'h-4 w-32 text-white'
              "
              name="logo-text"
            />
          </router-link>
          <TInputCity
            v-if="currentCity"
            v-model="currentCity"
            hide-global
            class="text-black ml-2"
          />
        </div>

        <nav
          v-if="currentCity"
          class="fixed z-40 bottom-0 left-0 right-0 md:relative md:mt-6 flex md:mt-0 items-center justify-evenly md:justify-end p-2 md:p-0 border-t shadow-lg md:shadow-none md:border-0 text-gray-700 bg-white md:bg-dark md:text-white"
        >
          <router-link
            to="/events"
            class="block p-2 md:px-4 flex flex-col justify-center"
          >
            <TIcon class="w-8 h-8 mx-auto" name="calendar" />
            <span class="hidden md:block">Calendar</span>
          </router-link>
          <router-link
            to="/people"
            class="block p-2 md:px-4 flex flex-col justify-center"
          >
            <TIcon class="w-8 h-8 mx-auto" name="friends" />
            <span class="hidden md:block">Community</span>
          </router-link>
          <router-link
            to="/feed"
            class="block p-2 md:px-4 flex flex-col justify-center"
          >
            <TIcon class="w-8 h-8 mx-auto" name="news" />
            <span class="hidden md:block">News</span>
          </router-link>
          <button
            v-if="!uid"
            class="block p-2 md:px-4 flex flex-col justify-center"
            @click="showAuthPopup = true"
          >
            <TIcon class="w-8 h-8 mx-auto" name="plus" />
            <span class="hidden md:block">Add</span>
          </button>
          <TMenu v-else>
            <template slot="button">
              <div
                class="block p-2 md:px-4 flex flex-col justify-center cursor-pointer"
              >
                <TIcon class="w-8 h-8 mx-auto" name="plus" />
                <span class="hidden md:block">Add</span>
              </div>
            </template>
            <template slot="menu">
              <div class="w-32 py-2 bg-white rounded-lg shadow-xl border">
                <TButton type="nav" to="/posts/-/edit">Add post</TButton>
                <TButton type="nav" to="/events/-/edit">Add event</TButton>
              </div>
            </template>
          </TMenu>

          <TButton v-if="!uid" to="/signin" class="md:ml-2">Sign In</TButton>
          <TMenu v-else>
            <template slot="button">
              <div
                class="flex cursor-pointer rounded-full border-2 border-gray-200 hover:border-blue-500 p-1"
              >
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
        </nav>
      </div>
    </header>

    <TPopup v-if="showAuthPopup">
      <div class="flex justify-between border-b pb-2 mb-4">
        <div class="font-bold">Members only</div>
        <button class="cursor-pointer" @click="showAuthPopup = false">
          <TIcon name="close" class="cursor-pointer w-4 h-4" />
        </button>
      </div>
      <div class="my-4 flex flex-col justify-center">
        <div>You need a profile to write posts</div>
        <TButton class="mt-2" to="/signin">Create Profile</TButton>
      </div>
    </TPopup>

    <div
      class="flex-grow flex flex-col"
      :class="noContainer ? '' : 'p-4 mx-auto container max-w-xl mb-16'"
    >
      <nuxt />
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
    showAuthPopup: false
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
  @apply text-secondary;
}
</style>
