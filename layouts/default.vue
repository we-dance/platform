<template>
  <div
    class="container mx-auto font-sans leading-normal tracking-normal antialiased"
  >
    <header>
      <nav class="md:flex items-center justify-between flex-wrap p-4">
        <router-link
          to="/"
          class="no-underline flex items-center justify-center leading-none hover:no-underline font-bold"
        >
          <TIcon name="logo-text" />
        </router-link>

        <div class="mt-6 md:flex md:mt-0 items-center">
          <TButton to="/posts/-/edit">Write a post</TButton>
        </div>
      </nav>
    </header>
    <nuxt />
    <footer
      class="flex text-center p-4 justify-between items-center mt-4 border-t"
    >
      <div class="text-center text-sm text-gray-600">
        <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"
          ><img
            alt="Creative Commons License"
            class="mr-2 inline-block"
            src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"/></a
        >WeDance is licensed under a
        <a
          rel="license"
          class="underline"
          href="http://creativecommons.org/licenses/by-sa/4.0/"
          >Creative Commons Attribution-ShareAlike 4.0 International License</a
        >.
      </div>
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
    const app = process.env.app
    const social = app.social

    return {
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
