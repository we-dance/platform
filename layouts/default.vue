<template>
  <div
    class="container mx-auto font-sans leading-normal tracking-normal antialiased"
  >
    <header>
      <THamburger
        v-model="isMenuOpen"
        class="absolute top-0 right-0 mr-2 mt-4 z-50 md:hidden"
      />
      <div class="md:flex items-center justify-between flex-wrap p-4">
        <div class="flex items-center justify-start">
          <router-link to="/">
            <TIcon name="logo-text" />
          </router-link>
        </div>

        <div
          class="mt-6 flex md:mt-0 items-center justify-center md:justify-end"
        >
          <TButton v-if="!uid" to="/signin">Sign In</TButton>
          <router-link
            v-else
            class="flex rounded-full border-2 border-gray-200 hover:border-blue-500 p-1"
            :to="`/u/${account.username}`"
          >
            <img class="w-8 h-8 rounded-full" :src="account.photo" />
          </router-link>
        </div>
      </div>
    </header>

    <div class="md:flex">
      <nav
        class="p-4 md:pt-0 md:w-64 pr-16 md:pr-4 bg-white absolute left-0 top-0 bottom-0 w-full min-h-screen h-full md:block md:relative overflow-scroll"
        :class="{
          hidden: !isMenuOpen,
          'md:hidden': hideMenu,
          'z-40': isMenuOpen
        }"
      >
        <div class="text-sm">
          <div v-if="isAdmin()" class="border border-red-500 mb-4">
            <router-link to="/reports" class="block p-2 hover:bg-gray-300">
              <span class="w-2">🚩</span> Reports
            </router-link>
            <router-link to="/tags" class="block p-2 hover:bg-gray-300">
              <span class="w-2">🏷</span> Tags
            </router-link>
            <router-link to="/profiles" class="block p-2 hover:bg-gray-300">
              <span class="w-2">🕺🏼</span> Profiles
            </router-link>
          </div>
          <router-link to="/" class="block p-2 hover:bg-gray-300">
            <span class="w-2">📰</span> Feed
          </router-link>
          <router-link to="/people" class="block p-2 hover:bg-gray-300">
            <span class="w-2">🕺🏼</span> People
          </router-link>
          <router-link to="/events" class="block p-2 hover:bg-gray-300">
            <span class="w-2">🎷</span> Events
          </router-link>
          <router-link to="/trips" class="block p-2 hover:bg-gray-300">
            <span class="w-2">🚕</span> Trips
          </router-link>
          <router-link to="/endorsements" class="block p-2 hover:bg-gray-300">
            <span class="w-2">🌶</span> Endorsements
          </router-link>
          <router-link to="/?tour=intro" class="block p-2 hover:bg-gray-300">
            <span class="w-2">🍓</span> What is WeDance?
          </router-link>
        </div>

        <details>
          <summary class="p-2 font-bold mt-4 border-b">
            Musical Genres
          </summary>
          <div>
            <router-link
              to="/"
              class="block p-2 hover:bg-gray-300"
              :class="!$route.query.tag ? 'font-bold' : ''"
            >
              All
            </router-link>
            <router-link
              v-for="tag in tags"
              :key="tag.key"
              :to="`?tag=${tag.key}`"
              class="block p-2 hover:bg-gray-300"
              :class="$route.query.tag === tag.key ? 'font-bold' : ''"
              >#{{ tag.label }}
            </router-link>
          </div>
        </details>

        <div class="p-4 text-xs text-gray-700">
          Content on this site is licensed under a
          <a
            rel="license"
            class="underline"
            href="http://creativecommons.org/licenses/by/4.0/"
            >Creative Commons Attribution 4.0 International license</a
          >.
        </div>
      </nav>
      <div class="flex-grow p-4 bg-gray-200 rounded mb-4 md:mr-4">
        <nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useCollection from '~/use/collection'

export default {
  props: {
    hideMenu: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isMenuOpen: false
  }),
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
    const tags = computed(() =>
      tagDocs.value.map((doc) => ({ key: doc.id, label: doc.id }))
    )

    return {
      account,
      uid,
      tags,
      isAdmin
    }
  }
}
</script>

<style>
nav .nuxt-link-exact-active {
  @apply font-bold bg-gray-200;
}
</style>
