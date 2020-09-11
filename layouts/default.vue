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
                city
                  ? 'text-white h-4 w-32 hidden md:block'
                  : 'h-4 w-32 text-white'
              "
              name="logo-text"
            />
          </router-link>
          <TInputCity
            v-if="city"
            class="text-black ml-2"
            :value="city"
            @input="selectCity"
          />
        </div>

        <nav
          class="fixed z-40 bottom-0 left-0 right-0 md:relative md:mt-6 flex md:mt-0 items-center justify-evenly md:justify-end p-2 md:p-0 border-t shadow-lg md:shadow-none md:border-0 text-gray-700 bg-white md:bg-dark md:text-white"
        >
          <router-link
            to="/feed"
            class="block p-2 md:px-4 flex flex-col justify-center"
          >
            <TIcon class="w-8 h-8 mx-auto" name="news" />
            <span class="hidden md:block">Feed</span>
          </router-link>
          <router-link
            to="/people"
            class="block p-2 md:px-4 flex flex-col justify-center"
          >
            <TIcon class="w-8 h-8 mx-auto" name="friends" />
            <span class="hidden md:block">Community</span>
          </router-link>
          <router-link
            to="/events"
            class="block p-2 md:px-4 flex flex-col justify-center"
          >
            <TIcon class="w-8 h-8 mx-auto" name="calendar" />
            <span class="hidden md:block">Calendar</span>
          </router-link>
          <router-link
            to="/posts/-/edit"
            class="block p-2 md:px-4 flex flex-col justify-center"
          >
            <TIcon class="w-8 h-8 mx-auto" name="plus" />
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
                  <TButton to="/admin/matches" type="nav-admin">
                    Matches
                  </TButton>
                  <TButton to="/admin/reports" type="nav-admin">
                    Reports
                  </TButton>
                  <TButton to="/admin/tags" type="nav-admin">
                    Tags
                  </TButton>
                  <TButton to="/admin/profiles" type="nav-admin">
                    Profiles
                  </TButton>
                  <TButton to="/admin/accounts" type="nav-admin">
                    Accounts
                  </TButton>
                  <TButton to="/admin/emails" type="nav-admin">
                    Emails
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

    <div v-if="city" class="container p-4 mx-auto max-w-xl mb-16">
      <nuxt />
    </div>
    <div v-else class="flex-grow flex flex-col">
      <div
        class="bg-dark-gradient text-real-white py-16 flex-grow items-center justify-center"
      >
        <div class="p-4 mx-auto max-w-2xl text-center">
          <h1 class="text-5xl font-bold leading-tight">
            Exclusive for <span class="text-light">Dancers.</span>
          </h1>
          <p class="mt-2 text-xl">
            Salsa, Bachata, Kizomba, Tango, Zouk and more.
          </p>
          <div class="text-black mt-4 flex justify-center text-xl">
            <div>
              <TInputCity :value="city" @input="selectCity" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="border rounded mx-4 my-16 p-4 md:mx-auto max-w-2xl text-center"
      >
        <p>
          Become a member of WeDance Community to get unlimited access to full
          dance events calendar, dance partner search, dance chat.
        </p>
      </div>

      <div class="bg-black pb-16 md:pb-0 text-white text-sm">
        <div
          class="p-4 py-8 container mx-auto grid grid-flow-cols grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div class="flex items-center">
            <p>
              © WeDance 2020 – All rights reserved. Created by
              <a
                class="underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
                href="https://razbakov.com/"
                >Aleksey Razbakov</a
              >.
              <a
                class="underline hover:no-underline"
                rel="noopener noreferrer"
                href="mailto:WeDanceMunich@razbakov.com"
                >Contact&nbsp;us</a
              >.
            </p>
          </div>
          <div class="grid grid-flow-col grid-cols-4 grid-rows-1 gap-4">
            <a
              target="_blank"
              class="flex justify-center hover:opacity-50"
              href="https://instagram.com/WeDanceMunich"
              rel="noopener noreferrer"
            >
              <TIcon name="instagram" class="h-10 w-10" />
            </a>
            <a
              target="_blank"
              class="flex justify-center hover:opacity-50"
              href="https://fb.com/WeDanceMunich"
              rel="noopener noreferrer"
            >
              <TIcon name="facebook" class="h-10 w-10" />
            </a>
            <a
              target="_blank"
              class="flex justify-center hover:opacity-50"
              href="https://www.youtube.com/channel/UCcoW0f6TqLrGJRUubcaemLw"
              rel="noopener noreferrer"
            >
              <TIcon name="youtube" class="h-10 w-10" />
            </a>
            <a
              target="_blank"
              class="flex justify-center hover:opacity-50"
              href="https://twitter.com/WeDanceMunich"
              rel="noopener noreferrer"
            >
              <TIcon name="twitter" class="h-10 w-10" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ls from 'local-storage'
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
    isMenuOpen: false,
    city: ''
  }),
  computed: {
    isHome() {
      return this.$route.name === 'index'
    }
  },
  watch: {
    $route() {
      this.updateMenu()
    },
    city(city) {
      ls('city', city)

      if (city && this.$route.path === '/') {
        this.$router.push('/people')
      }
    }
  },
  mounted() {
    this.updateMenu()

    const routedCity = this.$route.query.city

    if (routedCity) {
      this.city = {
        locality: routedCity
      }
    } else {
      this.city = ls('city')
    }
  },
  methods: {
    updateMenu() {
      this.isMenuOpen = false
    },
    selectCity(val) {
      this.city = val
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
  @apply text-secondary;
}
</style>
