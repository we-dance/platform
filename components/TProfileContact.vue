<template>
  <div>
    <TButton
      v-if="myUid"
      type="primary"
      @click="
        message = ''
        isWritingMessage = true
      "
      >Message</TButton
    >
    <TButton v-else @click="showPopup = true">Message</TButton>

    <TPopup
      v-if="isWritingMessage"
      :title="`Message to ${profile.name}`"
      @close="isWritingMessage = false"
    >
      <div class="my-4 flex flex-col justify-center">
        <div
          v-if="!myProfile.bio || !myProfile.photo || !myProfile.languages"
          class="mb-4 p-4 rounded border"
        >
          <p class="font-bold">Your profile is the best introduction:</p>
          <ul class="list-disc ml-4">
            <li
              class="text-red-500"
              :class="{ 'text-green-500': myProfile.photo }"
            >
              Photo
            </li>
            <li
              class="text-red-500"
              :class="{ 'text-green-500': myProfile.bio }"
            >
              About me
            </li>
            <li
              class="text-red-500"
              :class="{ 'text-green-500': myProfile.languages }"
            >
              Languages
            </li>
          </ul>
          <TButton class="mt-4" to="/settings?tab=profile"
            >Edit my profile</TButton
          >
        </div>

        <TInputTextarea v-model="message" placeholder="Write a message" />

        <div class="flex mt-2 justify-end">
          <TButton class="mr-2" @click="isWritingMessage = false"
            >Cancel</TButton
          >
          <TButton type="primary" @click="sendMessage">Send</TButton>
        </div>
      </div>
    </TPopup>

    <TPopup v-if="showPopup">
      <div class="flex justify-between border-b pb-2 mb-4">
        <div class="font-bold">Members only</div>
        <button class="cursor-pointer" @click="showPopup = false">
          <TIcon name="close" class="cursor-pointer w-4 h-4" />
        </button>
      </div>
      <div class="my-4 flex flex-col justify-center">
        <div>You need a profile to send requests</div>
        <TButton class="mt-2" to="/signin?target=/people"
          >Create Profile</TButton
        >
      </div>
    </TPopup>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useProfiles from '~/use/profiles'

export default {
  name: 'TProfileContact',
  props: {
    uid: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { getProfile } = useProfiles()
    const profile = getProfile(props.uid)

    const { create } = useDoc('matches')
    const { uid: myUid, profile: myProfile } = useAuth()
    const showPopup = ref(false)
    const message = ref('')
    const isWritingMessage = ref(false)

    const sendMessage = () => {
      if (!message.value) {
        return
      }

      create({
        from: myUid.value,
        to: props.uid,
        message: message.value,
        status: 'open',
        auto: 'No'
      })

      isWritingMessage.value = false
    }

    return {
      profile,
      myUid,
      showPopup,
      message,
      isWritingMessage,
      sendMessage,
      myProfile
    }
  }
}
</script>
