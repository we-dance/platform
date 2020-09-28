<template>
  <div
    class="font-sans leading-normal tracking-normal antialiased flex flex-col min-h-screen"
  >
    <header class="container mx-auto bg-white">
      <div class="flex items-center justify-between flex-wrap p-4">
        <div class="flex items-center justify-start">
          <router-link to="/" class="flex items-center pb-2">
            <TIcon class="w-6 h-6 pt-1 mr-2" name="icon" />
            <TIcon class="h-4 w-32 hidden md:block" name="logo-text" />
          </router-link>
          <portal-target name="top-left"></portal-target>
        </div>
        <div>
          <TButton v-if="uid" type="link" to="/events"
            >See other events</TButton
          >
          <TButton v-else type="secondary" to="/signin">Sign in</TButton>
        </div>
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
            © WeDance 2020 – All rights reserved.
            <a
              class="underline hover:no-underline"
              rel="noopener noreferrer"
              href="mailto:contact@wedance.vip"
              >Contact&nbsp;us</a
            >.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'

export default {
  name: 'PublicLayout',
  setup() {
    const { uid } = useAuth()

    return {
      uid
    }
  }
}
</script>
