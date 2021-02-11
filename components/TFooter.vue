<template>
  <div class="bg-dark pb-16 md:pb-0 text-white text-sm">
    <div class="p-4 md:py-8 container mx-auto">
      <slot />

      <div class="md:flex space-y-2 justify-between">
        <div class="flex flex-col">
          <p>
            © WeDance 2021 – All rights reserved.
          </p>
          <p class="md:flex space-x-2">
            <router-link class="underline hover:no-underline" to="/about">{{
              $t('footer.about')
            }}</router-link>
            <router-link class="underline hover:no-underline" to="/support">{{
              $t('footer.support')
            }}</router-link>
            <router-link class="underline hover:no-underline" to="/privacy">{{
              $t('footer.privacy')
            }}</router-link>
            <router-link class="underline hover:no-underline" to="/terms">{{
              $t('footer.terms')
            }}</router-link>
            <router-link class="underline hover:no-underline" to="/coc">{{
              $t('footer.coc')
            }}</router-link>
            <router-link class="underline hover:no-underline" to="/faq">{{
              $t('footer.faq')
            }}</router-link>
          </p>
        </div>

        <div class="text-dark">
          <TInputSelect v-model="lang" :options="localesDropdown" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    lang: {
      get() {
        return this.$i18n.locale
      },
      set(val) {
        this.$i18n.setLocale(val)
      }
    },
    localesDropdown() {
      return this.$i18n.locales.map((locale) => ({
        value: locale.code,
        label: locale.name
      }))
    }
  }
}
</script>
