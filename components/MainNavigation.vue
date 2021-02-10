<template>
  <nav class="p-4 flex flex-col space-y-2 text-dark">
    <router-link to="/" class="md:hidden mb-4">
      <TIcon name="logo-horizontal-dark" />
    </router-link>

    <div
      v-if="uid"
      class="w-full px-4 py-2 items-center flex rounded-full border hover:border-purple-500 hover:text-purple-500 my-1"
    >
      <TMenu>
        <template slot="button">
          <div class="flex cursor-pointer rounded-full">
            <TProfilePhoto size="lg" :uid="uid" />
          </div>
        </template>
        <template slot="menu">
          <div class="w-32 py-2 bg-white rounded-lg shadow-xl border">
            <div v-if="isAdmin" class="text-red">
              <TButton to="/admin/matches" type="nav-admin">Matches</TButton>
              <TButton to="/admin/reports" type="nav-admin">Reports</TButton>
              <TButton to="/admin/tags" type="nav-admin">Tags</TButton>
              <TButton to="/admin/accounts" type="nav-admin">Accounts</TButton>
              <TButton to="/admin/cities" type="nav-admin">Cities</TButton>
              <TButton to="/admin/templates" type="nav-admin"
                >Templates</TButton
              >
              <TButton to="/admin/emails" type="nav-admin">Emails</TButton>
            </div>
            <TButton v-if="username" type="nav" :to="`/u/${username}`"
              >My Profile</TButton
            >
            <TButton type="nav" to="/settings">Settings</TButton>
            <TButton type="nav" href="/about" target="_blank">About</TButton>
            <TButton
              type="nav"
              href="mailto:support@wedance.vip"
              target="_blank"
              >Support</TButton
            >
            <TButton type="nav" to="/signout">Log out</TButton>
          </div>
        </template>
      </TMenu>
    </div>

    <router-link
      to="/"
      class="w-full px-4 py-2 items-center flex rounded-full border hover:border-purple-500 hover:text-purple-500"
    >
      <TIcon class="w-4 h-4 mr-2" name="pin" />
      <span>Pins</span>
    </router-link>

    <router-link
      to="/people"
      class="w-full px-4 py-2 items-center flex rounded-full border hover:border-purple-500 hover:text-purple-500"
    >
      <TIcon class="w-4 h-4 mr-2" name="spotlight" />
      <span>Scene</span>
    </router-link>

    <router-link
      to="/events"
      class="w-full px-4 py-2 items-center flex rounded-full border hover:border-purple-500 hover:text-purple-500"
    >
      <TIcon class="w-4 h-4 mr-2" name="event" />
      <span>Events</span>
    </router-link>
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
