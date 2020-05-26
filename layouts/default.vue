<template>
  <div
    class="container mx-auto font-sans leading-normal tracking-normal antialiased"
  >
    <header>
      <div class="md:flex items-center justify-between flex-wrap p-4">
        <div class="flex items-center justify-start">
          <router-link to="/">
            <TIcon name="logo-text" />
          </router-link>
        </div>

        <div
          class="mt-6 flex md:mt-0 items-center justify-center md:justify-end"
        >
          <router-link to="/" class="block p-2">
            <span class="w-2">📰</span>
            <span>News</span>
          </router-link>
          <router-link to="/people" class="block p-2">
            <span class="w-2">🕺🏼</span>
            <span>People</span>
          </router-link>
          <router-link to="/events" class="block p-2">
            <span class="w-2">🎷</span>
            <span>Events</span>
          </router-link>
          <router-link to="/trips" class="block p-2">
            <span class="w-2">🚕</span>
            <span>Trips</span>
          </router-link>
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
