<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <div class="flex gap-2 p-4">
      <TButton
        allow-guests
        :to="localePath('/explore')"
        icon="place"
        :label="profile.name"
        class="border-b flex-grow"
      />
      <select v-if="!global" v-model="radius">
        <option value="5">+5 km</option>
        <option value="50">+50 km</option>
        <option value="100">+100 km</option>
        <option value="500">+500 km</option>
        <option value="1000">+1000 km</option>
      </select>
    </div>

    <div class="overflow-x-auto ">
      <TwTabs
        :tabs="[
          {
            name: global
              ? $t('explore.nav.festivals')
              : $t('explore.nav.parties'),
            to: localePath(`/explore/${slug}`),
            current: view === 'parties' || view === 'festivals',
          },
          {
            name: global ? $t('explore.nav.online') : $t('explore.nav.classes'),
            to: localePath(`/explore/${slug}/classes`),
            current: view === 'classes',
          },
          {
            name: $t('explore.nav.profiles'),
            to: localePath(`/explore/${slug}/groups`),
            current: view === 'groups',
            hidden: global,
          },
          {
            name: global ? $t('explore.nav.experts') : $t('explore.nav.tips'),
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
import { ref, watch } from '@nuxtjs/composition-api'

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
  setup(props, { root }) {
    const radius = ref(root.$route.query.radius || 50)

    watch(radius, (value) => {
      root.$router.push({
        query: { radius: value },
      })
    })

    return { radius }
  },
}
</script>
