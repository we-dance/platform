<template>
  <TDropdown :label="title" :type="type" icon="">
    <TButton
      v-if="profile.website"
      allow-guests
      :href="profile.website"
      label="website"
      type="context"
    />
    <TButton
      v-if="profile.email"
      allow-guests
      :href="`mailto:${profile.email}`"
      label="email"
      type="context"
    />
    <TButton
      v-if="profile.id === profile.createdBy"
      :to="`/chat/${profile.username}`"
      label="chat"
      type="context"
    />
    <TButton
      v-for="field in filledFields"
      :key="field"
      allow-guests
      :href="profile[field]"
      :label="field"
      :icon="field"
      type="context"
    />
  </TDropdown>
</template>

<script>
export default {
  props: {
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
    shortFields: ['instagram', 'facebook'],
    longFields: [
      'couchsurfing',
      'airbnb',
      'blablacar',
      'whatsapp',
      'telegram',
      'instagram',
      'tiktok',
      'youtube',
      'twitter',
      'facebook',
    ],
  }),
  computed: {
    filledFields() {
      const fields = this.short ? this.shortFields : this.longFields
      return fields.filter((f) => this.profile[f])
    },
  },
}
</script>
