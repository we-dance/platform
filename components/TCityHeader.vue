<template>
  <div>
    <div class="flex gap-2 p-4">
      <TButton
        allow-guests
        :to="localePath('/explore')"
        icon="place"
        :label="profile.name"
        class="border-b flex-grow"
        @click.native="$track('city_explore', { label: profile.name })"
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
        :track="global ? 'global' : 'city'"
        :tabs="[
          {
            name: 'Overview',
            to: localePath(`/explore/global`),
            current: view === 'groups',
            hidden: !global,
            value: 'overview',
          },
          {
            name: 'Overview',
            to: localePath(`/explore/${slug}`),
            current: view === 'groups',
            hidden: global,
            value: 'overview',
          },
          {
            name: $t('explore.nav.parties'),
            to: localePath(`/explore/${slug}/parties`),
            current: view === 'parties',
            hidden: global,
            value: 'parties',
          },
          {
            name: $t('explore.nav.festivals'),
            to: localePath(`/explore/${slug}/festivals`),
            current: view === 'festivals',
            hidden: !global,
            value: 'festivals',
          },
          {
            name: global ? $t('explore.nav.online') : $t('explore.nav.classes'),
            to: localePath(`/explore/${slug}/classes`),
            current: view === 'classes',
            value: 'classes',
          },
          {
            name: global ? $t('explore.nav.experts') : $t('explore.nav.tips'),
            to: localePath(`/explore/${slug}/tips`),
            current: view === 'tips',
            value: 'tips',
          },
        ]"
        class="border-b"
      />
    </div>
  </div>
</template>

<script>
import { ref, useContext, watch } from '@nuxtjs/composition-api'

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
    const { $track } = useContext()
    const radius = ref(root.$route.query.radius || 50)

    watch(radius, (value) => {
      $track('radius_change', {
        radius: value,
      })
      root.$router.push({
        query: { radius: value },
      })
    })

    return { radius }
  },
}
</script>
