<template>
  <div class="flex gap-4">
    <div class="grid grid-cols-3 md:flex border-l border-t flex-shrink-0">
      <TButton
        v-if="!hideWebsite && profile.website"
        :to="profile.website"
        allow-guests
        :track="{ event: 'contact', action: 'website' }"
        type="void"
        class="cursor-pointer border-r border-b p-1"
      >
        <TIcon name="c_website" size="6" />
      </TButton>
      <TButton
        v-if="profile.email"
        :to="`mailto:${profile.email}`"
        allow-guests
        :track="{ event: 'contact', action: 'email' }"
        type="void"
        class="cursor-pointer border-r border-b p-1"
      >
        <TIcon name="email" size="6" />
      </TButton>
      <TButton
        v-for="field in filledFields"
        :key="field"
        allow-guests
        :to="profile[field]"
        :icon="field"
        :track="{ event: 'contact', action: field }"
        type="void"
        class="cursor-pointer border-r border-b p-1"
      >
        <TIcon :name="field" size="6" />
      </TButton>
    </div>
    <div v-if="title && filledFields.length" class="text-xs">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    hideWebsite: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'nav',
    },
    profile: {
      type: Object,
      default: () => ({}),
    },
    short: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    fields: [
      'youtube',
      'spotify',
      'tiktok',
      'linkedin',
      'whatsapp',
      'instagram',
      'threads',
      'twitter',
      'facebook',
      'vk',
      'telegram',
      'couchsurfing',
      'airbnb',
      'blablacar',
    ],
  }),
  computed: {
    filledFields() {
      return this.fields.filter((f) => this.profile[f])
    },
  },
}
</script>

<style scoped>
a:hover {
  @apply text-primary;
}
</style>
