<template>
  <div>
    <TButton @click="showPopup = true"> Edit Profile </TButton>
    <TPopup v-if="showPopup" title="Edit Profile" @close="showPopup = false">
      <div class="max-w-md mx-auto py-4 h-64 overflow-y-scroll">
        <TForm
          v-model="profile"
          :fields="profileFields"
          show-cancel
          class="space-y-4"
          @save="save"
          @cancel="cancel"
        />
      </div>
    </TPopup>
  </div>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import { useProfiles } from '~/use/profiles'
import { useDoc } from '~/use/doc'

export default {
  name: 'TButtonEditProfile',
  props: {
    uid: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { profileFields, getProfile } = useProfiles()
    const { update } = useDoc('profiles')
    const profile = ref({})
    const showPopup = ref(false)

    onMounted(() => {
      profile.value = getProfile(props.uid)
    })

    const cancel = () => {
      showPopup.value = false
    }

    const save = (data) => {
      update(props.uid, data)
      cancel()
    }

    return {
      profileFields,
      save,
      cancel,
      showPopup,
      profile,
    }
  },
}
</script>
