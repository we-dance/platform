<template>
  <div>
    <div class="text-xs flex flex-col gap-2">
      <a
        href="https://github.com/we-dance/platform/releases"
        target="_blank"
        class="hover:underline"
        >v{{ version }}</a
      >
      <NuxtLink class="hover:underline" :to="localePath('/about')">{{
        $t('footer.about')
      }}</NuxtLink>
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
        >NFC cards</NuxtLink
      >
      <NuxtLink class="hover:underline" :to="localePath('/reviews')"
        >Reviews</NuxtLink
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
