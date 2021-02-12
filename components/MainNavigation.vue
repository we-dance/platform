<template>
  <nav class="p-4 flex flex-col space-y-2 text-dark">
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
      <TButton to="/signin" type="nav" :label="$t('nav.signin')" />
      <TButton
        to="/register"
        type="nav"
        :label="$t('nav.signup')"
        class="bg-primary border-none text-white hover:bg-dark"
      />
    </template>

    <template v-if="isAdmin">
      <div class="h-8"></div>
      <TButton to="/admin/matches" type="nav-admin" label="Matches" />
      <TButton to="/admin/reports" type="nav-admin" label="Reports" />
      <TButton to="/admin/tags" type="nav-admin" label="Tags" />
      <TButton to="/admin/accounts" type="nav-admin" label="Accounts" />
      <TButton to="/admin/cities" type="nav-admin" label="Cities" />
      <TButton to="/admin/templates" type="nav-admin" label="Templates" />
      <TButton to="/admin/emails" type="nav-admin" label="Emails" />
    </template>
  </nav>
</template>

<script>
export default {
  props: {
    uid: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      default: ''
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
nav .nuxt-link-exact-active {
  @apply text-primary border-primary;
}
</style>
