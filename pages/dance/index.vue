<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <div class="p-4 border-b">
      <h1 class="text-2xl font-bold">
        {{ $t('explore.dance.header') }}
      </h1>

      <div class="text-sm">
        {{ $t('explore.dance.subheader') }}
      </div>
    </div>

    <div class="text-center">
      <div v-for="category in categories" :key="category" class="mb-4">
        <h4 class="font-bold text-lg">{{ category }}</h4>
        <div class="text-center">
          <NuxtLink
            v-for="style in subStyles(category)"
            :key="style.id"
            :class="{ 'bg-primary text-white': contains(style.id) }"
            class="rounded px-2 py-1 border m-1 inline-block cursor-pointer"
            :to="localePath(`/dance/${style.id}`)"
          >
            <span>{{ style.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStyles } from '~/use/styles'

export default {
  name: 'TInputStyles',
  setup() {
    const { styles, categories } = useStyles()

    return {
      styles,
      categories,
    }
  },
  props: {
    value: {
      type: [Object, String],
      default: () => ({}),
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    showPopup: false,
  }),
  methods: {
    subStyles(category) {
      return this.styles.filter(
        (item) =>
          item && item.region && item.region === category && !item.familyOnly
      )
    },
    children(parentName) {
      return this.styles.filter(
        (item) =>
          item &&
          item.family &&
          item.family === parentName &&
          parentName !== item.name
      )
    },
    contains(val) {
      if (!this.value) {
        return false
      }
      return this.value[val]
    },
    trigger(val) {
      const newValue = { ...this.value }

      if (newValue[val]?.selected) {
        for (const item of this.children(val)) {
          delete newValue[item.id]
        }

        delete newValue[val]
      } else {
        newValue[val] = {
          selected: true,
          level: 'Interested',
        }
      }

      this.$emit('input', newValue)
    },
  },
  head() {
    const title = this.$t(`explore.dance.title`)
    const description = this.$t(`explore.dance.description`)
    const keywords = this.$t(`explore.dance.keywords`)

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: `https://wedance.vip/explore/global/classes`,
      isPartOf: {
        '@type': 'WebSite',
        name: 'WeDance',
        url: 'https://wedance.vip',
      },
    }

    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: keywords,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'website',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
      ],
      script: [
        {
          hid: 'schema',
          type: 'application/ld+json',
          json: schema,
        },
      ],
    }
  },
}
</script>
