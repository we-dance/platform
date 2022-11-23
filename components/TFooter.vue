<template>
  <div>
    <div class="flex justify-start mb-4">
      <TInputSelect
        v-model="lang"
        :options="localesDropdown"
        class="text-dark"
      />
    </div>

    <div class="flex flex-wrap gap-4 text-xs">
      <a
        href="https://github.com/we-dance/platform/releases"
        target="_blank"
        class="hover:underline"
        >v{{ version }}</a
      >
      <NuxtLink class="hover:underline" to="/about">{{
        $t('footer.about')
      }}</NuxtLink>
      <NuxtLink class="hover:underline" to="/get-involved">
        {{ $t('footer.getInvolved') }}
      </NuxtLink>
      <NuxtLink class="hover:underline" to="/support">{{
        $t('footer.support')
      }}</NuxtLink>
      <NuxtLink class="hover:underline" to="/privacy">{{
        $t('footer.privacy')
      }}</NuxtLink>
      <NuxtLink class="hover:underline" to="/terms">{{
        $t('footer.terms')
      }}</NuxtLink>
      <NuxtLink class="hover:underline" to="/coc">{{
        $t('footer.coc')
      }}</NuxtLink>
      <NuxtLink class="hover:underline" to="/faq">{{
        $t('footer.faq')
      }}</NuxtLink>
    </div>
    <div class="mt-4 text-xs">
      © WeDance 2022 – {{ $t('footer.copyright') }}
    </div>
  </div>
</template>

<script>
import { version } from '~/package.json'

export default {
  computed: {
    lang: {
      get() {
        return this.$i18n.locale
      },
      set(val) {
        this.$i18n.setLocale(val)
      },
    },
    localesDropdown() {
      return this.$i18n.locales.map((locale) => ({
        value: locale.code,
        label: locale.name,
      }))
    },
  },
  setup() {
    return {
      version,
    }
  },
}
</script>
