<template>
  <TDropdown v-if="isAdmin()">
    <TPopupEdit
      type="context"
      :fields="profileFields"
      :label="$t('Edit')"
      collection="profiles"
      singular="profile"
      :item="profile"
    />
    <TButton
      type="context"
      icon="delete"
      :label="$t('Delete')"
      @click="removeProfile(profile.id)"
    />
  </TDropdown>
  <span v-else></span>
</template>

<script>
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { useDoc } from '~/use/doc'

export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const { isAdmin } = useAuth()
    const { profileFields } = useProfiles()
    const { remove } = useDoc('profiles')

    async function removeProfile(id) {
      if (!confirm('Are you sure you want to delete this profile?')) {
        return
      }

      await remove('profiles', id)
    }

    return {
      isAdmin,
      profileFields,
      removeProfile,
    }
  },
}
</script>
