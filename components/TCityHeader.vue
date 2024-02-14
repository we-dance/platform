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

    <div class="overflow-x-auto">
      <TwTabs
        :tabs="[
          {
            name: 'Parties',
            to: `/explore/${profile.username}`,
            current: view === 'parties',
          },
          {
            name: 'Classes',
            to: `/explore/${profile.username}/classes`,
            current: view === 'classes',
          },
          {
            name: 'Groups',
            to: `/explore/${profile.username}/groups`,
            current: view === 'groups',
          },
          {
            name: `Ask Locals`,
            to: `/explore/${profile.username}/tips`,
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
