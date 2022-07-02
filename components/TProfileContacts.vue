<template>
  <TDropdown v-if="filledFields.length" :label="title" :type="type" icon="">
    <TButton
      v-if="profile.email"
      allow-guests
      :href="`mailto:${profile.email}`"
      label="email"
      type="context"
    />
    <TButton
      v-else
      :to="`/chat/${profile.username}`"
      label="email"
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
  <div v-else></div>
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
