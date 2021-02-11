<template>
  <nav class="p-4 flex flex-col space-y-2 text-dark">
    <router-link to="/" class="md:hidden mb-4">
      <TIcon name="logo-horizontal-dark" />
    </router-link>

    <TButton to="/" type="nav">
      <TIcon class="w-4 h-4 mr-2" name="fire" />
      <span>{{ $t('posts.title') }}</span>
    </TButton>

    <TButton to="/community" type="nav">
      <TIcon class="w-4 h-4 mr-2" name="people" />
      <span>{{ $t('profiles.title') }}</span>
    </TButton>

    <TButton to="/events" type="nav">
      <TIcon class="w-4 h-4 mr-2" name="event" />
      <span>{{ $t('events.title') }}</span>
    </TButton>

    <template v-if="uid">
      <TButton :to="`/u/${username}`" type="nav">
        <TProfilePhoto size="xs" :uid="uid" class="mr-2" />
        <span>{{ $t('myprofile.title') }}</span>
      </TButton>

      <TButton to="/settings" type="nav">{{ $t('settings.title') }}</TButton>
      <TButton to="/signout" type="nav">{{ $t('signout') }}</TButton>
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
