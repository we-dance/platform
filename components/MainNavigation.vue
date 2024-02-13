<template>
  <nav
    class="p-4 flex flex-col space-y-2 text-dark h-screen overflow-y-scroll sticky top-0 border-r"
  >
    <TButton allow-guests :to="localePath('/')" class="mb-8" type="void">
      <TIcon name="logo-horizontal-dark" />
    </TButton>

    <TButton
      allow-guests
      :to="localePath('/search')"
      icon="search"
      :label="$t('nav.search')"
      type="nav"
    />

    <TButton
      allow-guests
      :to="
        currentCity
          ? localePath(`/explore/${city.username}`)
          : localePath('/explore')
      "
      label="Events"
      icon="calendar"
      type="nav"
    />
    <TButton
      allow-guests
      :to="localePath('/Travel')"
      icon="calendar"
      :label="$t('nav.festivals')"
      type="nav"
    />

    <TButton
      allow-guests
      :to="localePath('/find-partner/start')"
      icon="people"
      label="Find Partner"
      type="nav"
    />

    <TButton
      allow-guests
      :to="localePath('/dance')"
      icon="help"
      label="Dance Wiki"
      type="nav"
    />

    <div class="border-b pt-2 text-xs font-bold uppercase">Contribute</div>
    <TButton
      :to="localePath('/events/-/import')"
      icon="plus"
      label="Add Event"
      type="nav"
    />

    <TButton
      :to="localePath('/reviews/add')"
      icon="plus"
      label="Add Tip"
      type="nav"
    />

    <template v-if="uid">
      <div class="border-b pt-2 text-xs font-bold uppercase">My Profile</div>
      <TButton
        :to="localePath('/chat')"
        icon="chat"
        :label="$t('nav.chat')"
        type="nav"
      />
      <TButton :to="localePath(`/${username}`)" type="nav">
        <TProfilePhoto size="xs" :uid="uid" class="mr-1" />
        <span>{{ $t('nav.myProfile') }}</span>
      </TButton>
      <TButton
        :to="localePath('/settings')"
        type="nav"
        :label="$t('nav.settings')"
      />
      <TButton
        :to="localePath('/signout')"
        type="nav"
        :label="$t('auth.signout')"
      />
    </template>
    <template v-else>
      <div class="text-xs mt-4">
        <h4 class="font-bold">{{ $t('home.cta.header') }}</h4>
        <div>{{ $t('home.cta.description') }}</div>
      </div>
      <TButton
        allow-guests
        :to="localePath('/signin')"
        type="nav"
        :label="$t('auth.signin')"
        class="bg-primary border-none text-white hover:bg-dark"
      />
    </template>

    <div class="h-8"></div>

    <div v-if="isAdmin(true)" class="border-b pt-2 text-xs font-bold uppercase">
      Administration
    </div>
    <TButton
      v-if="isAdmin(true)"
      :label="`Admin ${isAdmin() ? 'ON' : 'OFF'}`"
      type="nav"
      @click="toggleAdmin()"
    />

    <TButton
      v-if="isAdmin()"
      to="/admin/feed"
      type="nav"
      class="text-gray-700"
      label="Feed"
    />

    <TButton
      v-if="isAdmin()"
      to="/admin/cities"
      type="nav"
      class="text-gray-700"
      label="Cities"
    />
    <TButton
      v-if="isAdmin()"
      to="/admin/reports"
      type="nav"
      class="text-gray-700"
      label="Reports"
    />
    <TButton
      v-if="isAdmin()"
      to="/admin/suspended"
      type="nav"
      class="text-gray-700"
      label="Suspended"
    />
    <TButton
      v-if="isAdmin()"
      to="/admin/emails"
      type="nav"
      class="text-gray-700"
      label="Emails"
    />
    <TButton
      v-if="isAdmin()"
      to="/admin/templates"
      type="nav"
      class="text-gray-700"
      label="Templates"
    />

    <TFooter />
  </nav>
</template>

<script>
import ls from 'local-storage'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
import { useRouter } from '~/use/router'

export default {
  setup() {
    const { isAdmin, isEditor } = useAuth()
    const { city, currentCity } = useCities()
    const { router } = useRouter()

    function toggleAdmin() {
      const val = ls('admin') || false
      ls('admin', !val)
      router.go()
    }

    return { isAdmin, isEditor, city, currentCity, toggleAdmin }
  },
  props: {
    uid: {
      type: String,
      default: '',
    },
    username: {
      type: String,
      default: '',
    },
  },
}
</script>

<style>
nav .nuxt-link-exact-active {
  @apply text-primary border-primary;
}
</style>
