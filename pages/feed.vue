<template>
  <div>
    <THeader title="Feed" />
    <div class="border-b p-4 flex items-start">
      <div class="w-12 flex-shrink-0">
        <TAvatar photo size="md" :uid="uid" />
      </div>
      <div class="w-full">
        <textarea
          v-model="newMessage"
          cols="30"
          rows="2"
          placeholder="Ask or share something about dance..."
          class="w-full p-4 border text-sm"
          @keyup.enter="send"
        ></textarea>
        <div class="flex justify-end">
          <TButton @click="send">Send</TButton>
        </div>
      </div>
    </div>
    <TPostList />
  </div>
</template>

<script>
import { ref } from 'vue-demi'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'

export default {
  setup() {
    const { uid } = useAuth()
    const { currentCity } = useCities()
    const newMessage = ref('')

    const send = () => {}

    return { currentCity, uid, newMessage, send }
  },
}
</script>
