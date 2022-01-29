<template>
  <div
    class="font-sans leading-normal tracking-normal antialiased flex flex-col min-h-screen"
  >
    <div class="flex-grow">
      <nuxt />
    </div>

    <TFooter>
      <div class="flex items-center justify-between flex-wrap mb-8">
        <div class="flex items-center justify-start">
          <NuxtLink to="/" class="flex items-center pb-2">
            <TIcon class="w-6 h-6 pt-1 mr-2" name="icon" />
            <TIcon
              class="h-4 w-32 hidden md:block text-white"
              name="logo-text"
            />
          </NuxtLink>
          <portal-target name="top-left"></portal-target>
        </div>
        <div class="flex space-x-2">
          <TButton type="link" to="/events">Event Calendar</TButton>
          <TButton type="link" to="/community">Find a partner</TButton>
          <TButton type="link" to="/">Dance News</TButton>
        </div>
      </div>
    </TFooter>
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'

export default {
  name: 'PublicLayout',
  setup() {
    const { uid } = useAuth()

    return {
      uid,
    }
  },
}
</script>
