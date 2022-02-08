<template>
  <div
    class="flex min-h-screen flex-col font-sans leading-normal tracking-normal antialiased"
  >
    <div class="flex-grow">
      <nuxt />
    </div>

    <TFooter>
      <div class="mb-8 flex flex-wrap items-center justify-between">
        <div class="flex items-center justify-start">
          <NuxtLink to="/" class="flex items-center pb-2">
            <TIcon class="mr-2 h-6 w-6 pt-1" name="icon" />
            <TIcon
              class="hidden h-4 w-32 text-white md:block"
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
