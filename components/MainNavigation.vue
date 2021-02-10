<template>
  <nav class="p-4 flex flex-col space-y-2 text-dark">
    <router-link to="/" class="md:hidden mb-4">
      <TIcon name="logo-horizontal-dark" />
    </router-link>

    <TButton to="/" type="nav">
      <TIcon class="w-4 h-4 mr-2" name="fire" />
      <span>Trends</span>
    </TButton>

    <TButton to="/people" type="nav">
      <TIcon class="w-4 h-4 mr-2" name="people" />
      <span>Community</span>
    </TButton>

    <TButton to="/events" type="nav">
      <TIcon class="w-4 h-4 mr-2" name="event" />
      <span>Events</span>
    </TButton>

    <template v-if="uid">
      <TButton :to="`/u/${username}`" type="nav">
        <TProfilePhoto size="xs" :uid="uid" class="mr-2" />
        <span>My Profile</span>
      </TButton>

      <TButton to="/settings" type="nav">Settings</TButton>
      <TButton to="/about" type="nav">About</TButton>
      <TButton href="mailto:support@wedance.vip" target="_blank" type="nav"
        >Support</TButton
      >
      <TButton type="nav" to="/signout">Log out</TButton>
    </template>

    <template v-if="isAdmin">
      <div class="h-8"></div>
      <TButton to="/admin/matches" type="nav-admin">Matches</TButton>
      <TButton to="/admin/reports" type="nav-admin">Reports</TButton>
      <TButton to="/admin/tags" type="nav-admin">Tags</TButton>
      <TButton to="/admin/accounts" type="nav-admin">Accounts</TButton>
      <TButton to="/admin/cities" type="nav-admin">Cities</TButton>
      <TButton to="/admin/templates" type="nav-admin">Templates</TButton>
      <TButton to="/admin/emails" type="nav-admin">Emails</TButton>
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
