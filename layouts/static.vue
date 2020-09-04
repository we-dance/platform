<template>
  <div
    class="font-sans leading-normal tracking-normal antialiased flex flex-col min-h-screen"
  >
    <header class="container mx-auto bg-white">
      <div class="flex items-center justify-between flex-wrap p-4">
        <div class="flex items-center justify-start">
          <router-link to="/" class="flex items-center">
            <TIcon class="w-6 h-6 mt-2 mr-2" name="icon" />
            <TIcon class="h-4 w-32" name="logo-text" />
          </router-link>
          <portal-target name="logo"></portal-target>
        </div>
        <TButton v-if="uid" class="mt-4" type="secondary" to="/feed"
          >Sign in</TButton
        >
        <TButton v-else class="mt-4" type="secondary" to="/signin"
          >Sign in</TButton
        >
      </div>
    </header>

    <div class="flex-grow">
      <nuxt />
    </div>

    <div class="bg-black text-white text-sm">
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
</template>

<script>
import useAuth from '~/use/auth'

export default {
  setup() {
    const { uid } = useAuth()

    return {
      uid
    }
  }
}
</script>
