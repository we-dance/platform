<template>
  <div class="space-y-2">
    <div
      v-for="lang in getSelected()"
      :key="lang.value"
      class="flex items-center"
    >
      <div class="flex-grow">
        {{ lang.label }}
      </div>
      <TButton
        icon="close"
        type="icon"
        class="ml-1"
        @click="remove(lang.value)"
      />
    </div>

    <t-rich-select
      v-model="newLanguage"
      placeholder="Add language"
      :options="languages"
      @change="add(newLanguage)"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import languages from '~/assets/languages'

export default {
  name: 'TInputLanguages',
  props: {
    value: {
      type: [Object, String],
      default: () => ({}),
    },
  },
  data: () => ({
    newLanguage: '',
  }),
  computed: {
    languages() {
      return languages
    },
  },
  methods: {
    add(lang) {
      if (!lang) {
        return
      }

      const val = this.value || {}
      Vue.set(val, lang, true)

      this.$emit('input', val)
      this.newLanguage = ''
    },
    remove(lang) {
      if (!lang) {
        return
      }

      const val = this.value

      Vue.delete(val, lang)
      this.$emit('input', val)
    },
    getLanguage(lang) {
      return languages.find((l) => l.value === lang)
    },
    getSelected() {
      if (!this.value) {
        return []
      }

      return Object.keys(this.value).map((lang) => this.getLanguage(lang))
    },
  },
}
</script>
