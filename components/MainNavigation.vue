<template>
  <nav
    class="p-4 flex flex-col space-y-2 text-dark h-screen overflow-y-scroll sticky top-0"
  >
    <TButton
      to="/"
      icon="logo-horizontal-dark"
      class="md:hidden mb-4"
      type="void"
    />

    <TButton to="/" icon="fire" :label="$t('posts.title')" type="nav" />
    <TButton
      to="/community"
      icon="people"
      :label="$t('profiles.title')"
      type="nav"
    />
    <TButton to="/events" icon="event" :label="$t('events.title')" type="nav" />

    <template v-if="uid">
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
      type="nav-admin"
      label="Shares"
    />
    <TButton
      v-if="isAdmin()"
      to="/admin/accounts"
      type="nav-admin"
      label="Accounts"
    />
    <TButton
      v-if="isAdmin()"
      to="/admin/cities"
      type="nav-admin"
      label="Cities"
    />
    <TButton
      v-if="isAdmin()"
      to="/admin/reports"
      type="nav-admin"
      label="Reports"
    />
    <TButton
      v-if="isAdmin()"
      to="/admin/matches"
      type="nav-admin"
      label="Matches"
    />
    <TButton
      v-if="isAdmin()"
      to="/admin/emails"
      type="nav-admin"
      label="Emails"
    />
    <TButton
      v-if="isAdmin()"
      to="/admin/templates"
      type="nav-admin"
      label="Templates"
    />
  </nav>
</template>

<script>
import useAuth from '~/use/auth'

export default {
  setup() {
    const { isAdmin, isEditor } = useAuth()
    return { isAdmin, isEditor }
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
