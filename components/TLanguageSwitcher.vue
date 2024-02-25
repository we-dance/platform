<template>
  <TInputSelect v-model="lang" :options="localesDropdown" class="text-dark" />
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
