<template>
  <div
    v-if="filledFields.length"
    class="md:flex items-center justify-center space-x-2 space-y-2"
  >
    <div v-if="title" class="pl-2 font-bold">{{ title }}</div>
    <div class="p-4 flex flex-wrap gap-2 items-center justify-center">
      <TButton
        v-for="field in filledFields"
        :key="field"
        allow-guests
        :href="profile[field]"
        :icon="field"
        type="round"
        icon-size="6"
      />
    </div>
  </div>
  <div v-else></div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
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
      'website',
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
      let fields = this.short ? this.shortFields : this.longFields
      return fields.filter((f) => this.profile[f])
    },
  },
}
</script>
