<template>
  <div
    class="container mx-auto font-sans leading-normal tracking-normal antialiased"
  >
    <header>
      <div class="md:flex items-center justify-between flex-wrap p-4">
        <div class="flex items-center justify-start">
          <router-link to="/feed" class="flex items-center">
            <TIcon class="w-6 h-6 mt-2 mr-2" name="icon" />
            <TIcon class="h-4 w-32" name="logo-text" />
          </router-link>
        </div>

        <nav
          class="fixed bottom-0 left-0 right-0 md:relative md:mt-6 flex md:mt-0 items-center justify-evenly md:justify-end p-2 md:p-0 border-t shadow-lg md:shadow-none md:border-0 text-gray-700 bg-white"
        >
          <router-link
            to="/feed"
            class="block p-2 md:px-4 flex flex-col justify-center"
          >
            <TIcon class="w-8 h-8" name="news" />
            <span class="hidden md:block">Feed</span>
          </router-link>
          <router-link
            to="/people"
            class="block p-2 md:px-4 flex flex-col justify-center"
          >
            <TIcon class="w-8 h-8" name="friends" />
            <span class="hidden md:block">Network</span>
          </router-link>
          <router-link
            to="/events"
            class="block p-2 md:px-4 flex flex-col justify-center"
          >
            <TIcon class="w-8 h-8" name="calendar" />
            <span class="hidden md:block">Calendar</span>
          </router-link>
          <router-link
            to="/posts/-/edit"
            class="block p-2 md:px-4 flex flex-col justify-center"
          >
            <TIcon class="w-8 h-8" name="plus" />
            <span class="hidden md:block">Add</span>
          </router-link>

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
                  <TButton to="/reports" type="nav-admin">
                    Reports
                  </TButton>
                  <TButton to="/tags" type="nav-admin">
                    Tags
                  </TButton>
                  <TButton to="/profiles" type="nav-admin">
                    Profiles
                  </TButton>
                </div>
                <TButton
                  v-if="getProfile(uid).username"
                  type="nav"
                  :to="`/u/${getProfile(uid).username}`"
                >
                  My Profile
                </TButton>
                <TButton type="nav" to="/settings">
                  Settings
                </TButton>
                <TButton type="nav" to="/?tour=intro">
                  About
                </TButton>
                <TButton type="nav" to="/signout">
                  Logout
                </TButton>
              </div>
            </template>
          </TMenu>
        </nav>
      </div>
    </header>

    <div class="p-4 mx-auto max-w-xl mb-16">
      <nuxt />
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useCollection from '~/use/collection'
import useProfiles from '~/use/profiles'

export default {
  name: 'DefaultLayout',
  props: {
    hideMenu: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isMenuOpen: false
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
    const tags = computed(() =>
      tagDocs.value.map((doc) => ({ key: doc.id, label: doc.id }))
    )

    return {
      account,
      getProfile,
      uid,
      tags,
      isAdmin
    }
  }
}
</script>

<style>
nav .nuxt-link-exact-active {
  @apply text-blue-500;
}
</style>
