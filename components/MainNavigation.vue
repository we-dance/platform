<template>
  <nav
    class="p-4 flex flex-col space-y-2 text-dark h-screen overflow-y-scroll sticky top-0 border-r"
  >
    <TButton to="/" icon="logo-horizontal-dark" class="mb-8" type="void" />

    <template v-if="uid">
      <TButton
        to="/cities"
        icon="place"
        :label="cityName || $t('cities.choose')"
        type="nav"
      />
      <template v-if="cityName">
        <TButton to="/feed" icon="news" :label="$t('posts.title')" type="nav" />
        <TButton
          to="/community"
          icon="people"
          :label="$t('profiles.title')"
          type="nav"
        />
        <TButton
          to="/events"
          icon="calendar"
          :label="$t('events.title')"
          type="nav"
        />
      </template>
      <TButton to="/chat" icon="chat" :label="$t('chat.title')" type="nav" />
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
import { computed } from 'vue-demi'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'

export default {
  setup() {
    const { isAdmin, isEditor } = useAuth()
    const { city } = useCities()

    const cityName = computed(() => {
      return city.value?.name
    })

    return { isAdmin, isEditor, cityName }
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
