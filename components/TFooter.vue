<template>
  <div>
    <div class="text-xs flex flex-col gap-2">
      <NuxtLink class="hover:underline" :to="localePath('/about')">{{
        $t('footer.about')
      }}</NuxtLink>
      <NuxtLink class="hover:underline" :to="localePath('/organize')"
        >For Organizers</NuxtLink
      >
      <NuxtLink class="hover:underline" :to="localePath('/promoter')"
        >For Promoters</NuxtLink
      >
      <NuxtLink class="hover:underline" :to="localePath('/partners')"
        >Partners</NuxtLink
      >
      <NuxtLink class="hover:underline" :to="localePath('/dance')">
        {{ $t('nav.dance') }}
      </NuxtLink>
      <NuxtLink class="hover:underline" :to="localePath('/posts')"
        >Blog</NuxtLink
      >
      <NuxtLink class="hover:underline" :to="localePath('/get-involved')">
        {{ $t('footer.getInvolved') }}
      </NuxtLink>
      <NuxtLink class="hover:underline" :to="localePath('/support')">{{
        $t('footer.support')
      }}</NuxtLink>
      <NuxtLink class="hover:underline" :to="localePath('/privacy')">{{
        $t('footer.privacy')
      }}</NuxtLink>
      <NuxtLink class="hover:underline" :to="localePath('/terms')">{{
        $t('footer.terms')
      }}</NuxtLink>
      <NuxtLink class="hover:underline" :to="localePath('/coc')">{{
        $t('footer.coc')
      }}</NuxtLink>
      <NuxtLink class="hover:underline" :to="localePath('/faq')">{{
        $t('footer.faq')
      }}</NuxtLink>
      <NuxtLink class="hover:underline" :to="localePath('/nfc')"
        >WeDance Card</NuxtLink
      >
      <NuxtLink class="hover:underline" :to="localePath('/reviews')"
        >Local Tips</NuxtLink
      >
      <NuxtLink class="hover:underline" :to="localePath('/where-can-i-dance')"
        >Where can I dance?</NuxtLink
      >
      <a
        href="https://github.com/we-dance/platform/releases"
        target="_blank"
        class="hover:underline"
        >v{{ version }}</a
      >
    </div>
    <div class="mt-4 text-xs">
      © WeDance 2024 – {{ $t('footer.copyright') }}
    </div>
  </div>
</template>

<script>
import { version } from '~/package.json'

export default {
  setup() {
    return {
      version,
    }
  },
}
</script>
