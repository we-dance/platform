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
            name: $t('explore.nav.parties'),
            to: localePath(`/explore/${profile.username}`),
            current: view === 'parties',
          },
          {
            name: $t('explore.nav.classes'),
            to: localePath(`/explore/${profile.username}/classes`),
            current: view === 'classes',
          },
          {
            name: $t('explore.nav.groups'),
            to: localePath(`/explore/${profile.username}/groups`),
            current: view === 'groups',
          },
          {
            name: $t('explore.nav.tips'),
            to: localePath(`/explore/${profile.username}/tips`),
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
  },
}
</script>
