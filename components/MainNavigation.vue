<template>
  <nav
    class="p-4 flex flex-col space-y-2 text-dark h-screen overflow-y-scroll sticky top-0 border-r"
  >
    <TButton allow-guests to="/" class="mb-8" type="void">
      <TIcon name="logo-horizontal-dark" />
    </TButton>
    <TButton
      allow-guests
      to="/Travel"
      icon="directions"
      :label="$t('nav.festivals')"
      type="nav"
    />
    <TButton
      v-if="currentCity"
      allow-guests
      :to="`/${city.username}`"
      icon="calendar"
      :label="$t('nav.calendar')"
      type="nav"
    />
    <TButton
      v-if="!currentCity"
      allow-guests
      to="/cities"
      icon="place"
      :label="$t('nav.chooseCity')"
      type="nav"
    />
    <TButton
      allow-guests
      to="/feed"
      icon="news"
      :label="$t('nav.feed')"
      type="nav"
    />
    <TButton
      allow-guests
      to="/dance"
      icon="fire"
      :label="$t('nav.dance')"
      type="nav"
    />
    <template v-if="uid">
      <TButton to="/chat" icon="chat" :label="$t('nav.chat')" type="nav" />
      <TButton :to="`/${username}`" type="nav">
        <TProfilePhoto size="xs" :uid="uid" class="mr-1" />
        <span>{{ $t('nav.myProfile') }}</span>
      </TButton>
      <TButton to="/settings" type="nav" :label="$t('nav.settings')" />
      <TButton to="/signout" type="nav" :label="$t('auth.signout')" />
    </template>
    <template v-else>
      <div class="text-xs mt-4">
        <h4 class="font-bold">{{ $t('home.cta.header') }}</h4>
        <div>{{ $t('home.cta.description') }}</div>
      </div>
      <TButton
        allow-guests
        to="/signin"
        type="nav"
        :label="$t('auth.signin')"
        class="bg-primary border-none text-white hover:bg-dark"
      />
    </template>

    <div class="h-8"></div>
    <TButton
      v-if="isAdmin() || isEditor()"
      to="/admin/shares"
      type="nav"
      class="text-gray-700"
      label="Shares"
    />
    <TButton
      v-if="isAdmin()"
      to="/admin/accounts"
      type="nav"
      class="text-gray-700"
      label="Accounts"
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
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'

export default {
  setup() {
    const { isAdmin, isEditor } = useAuth()
    const { city, currentCity } = useCities()
    return { isAdmin, isEditor, city, currentCity }
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
nav .nuxt-link-active {
  @apply text-primary border-primary;
}
</style>
