<template>
  <div class="flex justify-center">
    <div class="grid grid-cols-3 md:flex border-l border-t">
      <TButton
        v-if="!hideWebsite && profile.website"
        allow-guests
        :href="profile.website"
        type="void"
        class="cursor-pointer border-r border-b p-1"
      >
        <TIcon name="c_website" size="6" />
      </TButton>
      <TButton
        v-if="profile.email"
        allow-guests
        :href="`mailto:${profile.email}`"
        type="void"
        class="cursor-pointer border-r border-b p-1"
      >
        <TIcon name="email" size="6" />
      </TButton>
      <TButton
        v-for="field in filledFields"
        :key="field"
        allow-guests
        :href="profile[field]"
        :icon="field"
        type="void"
        class="cursor-pointer border-r border-b p-1"
      >
        <TIcon :name="field" size="6" />
      </TButton>
    </div>
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
      'linkedin',
      'whatsapp',
      'telegram',
      'twitter',
      'youtube',
      'instagram',
      'tiktok',
      'facebook',
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
