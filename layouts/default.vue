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
          <TButton to="/posts/-/edit">Write a post</TButton>
        </div>
      </div>
    </header>

    <div class="md:flex">
      <nav
        class="p-4 md:w-64 bg-white absolute left-0 top-0 w-full min-h-screen h-full md:block md:relative"
        :class="{
          hidden: !isMenuOpen,
          'md:hidden': hideMenu,
          'z-40': isMenuOpen
        }"
      >
        <TButton v-if="!uid" to="/signin">Sign In</TButton>
        <TButton
          v-else-if="!account || !account.username"
          to="/account?tab=settings"
          >Create Profile</TButton
        >
        <router-link
          v-else
          class="flex hover:bg-gray-300 p-2 w-56"
          :to="`/u/${account.username}`"
        >
          <img class="w-10 h-10 rounded-full" :src="account.photo" />
          <div class="ml-2">
            <div class="font-bold">{{ account.name }}</div>
            <div>@{{ account.username }}</div>
          </div>
        </router-link>

        <div class="mt-4 text-sm">
          <router-link to="/" class="block p-2 hover:bg-gray-300">
            <span class="w-2">📰</span> Feed
          </router-link>
          <router-link to="/people" class="block p-2 hover:bg-gray-300">
            <span class="w-2">🕺🏼</span> People
          </router-link>
          <router-link to="/groups" class="block p-2 hover:bg-gray-300">
            <span class="w-2">👯‍♀️</span> Groups
          </router-link>
          <router-link to="/events" class="block p-2 hover:bg-gray-300">
            <span class="w-2">🎷</span> Events
          </router-link>
          <router-link to="/artists" class="block p-2 hover:bg-gray-300">
            <span class="w-2">👩‍🎨</span> Artists
          </router-link>
          <router-link to="/venues" class="block p-2 hover:bg-gray-300">
            <span class="w-2">🏘</span> Venues
          </router-link>
          <router-link to="/videos" class="block p-2 hover:bg-gray-300">
            <span class="w-2">📺</span> Videos
          </router-link>
          <router-link to="/music" class="block p-2 hover:bg-gray-300">
            <span class="w-2">🎶</span> Music
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
      <div class="flex-grow p-4 bg-gray-200 rounded mx-4">
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
    const { uid, account } = useAuth()
    const { docs: tagDocs } = useCollection('tags')
    const tags = computed(() =>
      tagDocs.value.map((doc) => ({ key: doc.id, label: doc.id }))
    )

    return {
      account,
      uid,
      tags
    }
  }
}
</script>

<style>
nav .nuxt-link-exact-active {
  @apply font-bold bg-gray-200;
}
</style>
