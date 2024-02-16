<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <TButton
      allow-guests
      :to="localePath('/explore')"
      icon="place"
      :label="profile.name"
      class="m-4 border-b"
    />

    <div class="overflow-x-auto ">
      <TwTabs
        :tabs="[
          {
            name: global ? 'Festivals' : $t('explore.nav.parties'),
            to: localePath(`/explore/${slug}`),
            current: view === 'parties',
          },
          {
            name: $t('explore.nav.classes'),
            to: localePath(`/explore/${slug}/classes`),
            current: view === 'classes',
          },
          {
            name: $t('explore.nav.groups'),
            to: localePath(`/explore/${slug}/groups`),
            current: view === 'groups',
            hidden: global,
          },
          {
            name: global ? 'Ask Experts' : $t('explore.nav.tips'),
            to: localePath(`/explore/${slug}/tips`),
            current: view === 'tips',
          },
        ]"
        class="border-b"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TCityHeader',
  props: {
    profile: {
      type: Object,
      required: true,
    },
    view: {
      type: String,
      default: 'parties',
    },
    global: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    slug() {
      return this.global ? 'global' : this.profile.username
    },
  },
}
</script>
