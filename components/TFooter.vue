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
      <router-link class="hover:underline" to="/about">{{
        $t('footer.about')
      }}</router-link>
      <router-link class="hover:underline" to="/get-involved">
        Get Involved
      </router-link>
      <router-link
        class="hover:underline"
        to="/support#hs-chat-open"
        target="_blank"
        >Support</router-link
      >
      <router-link class="hover:underline" to="/privacy"
        >Datenschutzerklärung</router-link
      >
      <router-link class="hover:underline" to="/terms"
        >Impressum/Terms</router-link
      >
      <router-link class="hover:underline" to="/coc">{{
        $t('footer.coc')
      }}</router-link>
      <router-link class="hover:underline" to="/faq">{{
        $t('footer.faq')
      }}</router-link>
    </div>
    <div class="mt-4 text-xs">© WeDance 2021 – All rights reserved.</div>
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
      },
    },
    localesDropdown() {
      return this.$i18n.locales.map((locale) => ({
        value: locale.code,
        label: locale.name,
      }))
    },
  },
}
</script>
