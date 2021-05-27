<template>
  <nav
    class="p-4 flex flex-col space-y-2 text-dark h-screen overflow-y-scroll sticky top-0 border-r"
  >
    <TButton to="/" icon="logo-horizontal-dark" class="mb-8" type="void" />

    <template v-if="uid">
      <TButton to="/feed" icon="news" label="Feed" type="nav" />
      <TButton to="/community" icon="people" label="Community" type="nav" />
      <TButton to="/events" icon="calendar" label="Events" type="nav" />
      <TButton to="/chat" icon="chat" label="Chat" type="nav" />
      <TButton :to="`/${username}`" type="nav">
        <TProfilePhoto size="xs" :uid="uid" class="mr-1" />
        <span>{{ $t('myprofile.title') }}</span>
      </TButton>
      <TButton to="/settings" type="nav" :label="$t('settings.title')" />
      <TButton to="/signout" type="nav" :label="$t('signout')" />
    </template>
    <template v-else>
      <TButton to="/signin" type="nav" :label="$t('signin')" />
      <TButton
        to="/register"
        type="nav"
        :label="$t('signup')"
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
      to="/admin/matches"
      type="nav"
      class="text-gray-700"
      label="Matches"
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
    const { city } = useCities()

    return { isAdmin, isEditor, city }
  },
  props: {
    uid: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
nav .nuxt-link-exact-active {
  @apply text-primary border-primary;
}
</style>
