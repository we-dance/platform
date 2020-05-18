<template>
  <div class="font-sans leading-normal tracking-normal antialiased">
    <header>
      <nav class="md:flex items-center justify-between flex-wrap p-6">
        <router-link
          to="/"
          class="no-underline flex items-center justify-center leading-none hover:no-underline font-bold"
        >
          <TIcon name="logo-text" />
        </router-link>

        <div class="mt-6 md:flex md:mt-0 items-center">
          <TButton type="primary" class="md:mr-4" to="/posts/-/edit"
            >Write a post</TButton
          >
          <TButton v-if="!uid" type="link" class="mt-4 md:mt-0" to="/signin"
            >Sign In</TButton
          >
          <TButton
            v-if="uid && account"
            type="link"
            class="mt-4 md:mt-0"
            to="/account"
            >{{ account.name }}</TButton
          >
        </div>
      </nav>
    </header>
    <div class="container mx-auto md:max-w-lg">
      <nuxt />
    </div>
    <footer class="md:flex text-center p-4 justify-between items-center">
      <div class="md:flex mt-8 md:mt-0">
        <div v-if="Object.keys(social).length" class="m-3 text-md font-bold">
          Follow us
        </div>
        <div v-if="social.twitter" class="m-3">
          <a
            class="underline hover:no-underline hover:text-blue-500"
            :href="`https://twitter.com/${social.twitter}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
        </div>
        <div v-if="social.instagram" class="m-3">
          <a
            class="underline hover:no-underline hover:text-pink-500"
            :href="`https://instagram.com/${social.instagram}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
        <div v-if="social.facebook" class="m-3">
          <a
            class="underline hover:no-underline hover:text-blue-500"
            :href="`https://facebook.com/${social.facebook}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import TIcon from '~/components/TIcon'
import TButton from '~/components/TButton'

export default {
  components: {
    TIcon,
    TButton
  },
  data: () => ({
    isMenuOpen: false
  }),
  setup() {
    const { uid, account } = useAuth()

    const app = process.env.app
    const social = app.social

    return {
      uid,
      account,
      app,
      social
    }
  },
  watch: {
    $route() {
      this.isMenuOpen = false
    }
  }
}
</script>
