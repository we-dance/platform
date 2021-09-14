<template>
  <div>
    <THeader title="Chat" />
    <div v-if="!chats" class="p-16 text-xs text-center">
      Start conversations and they will appear here.
    </div>
    <div v-else>
      <router-link
        v-for="chat in chats"
        :key="chat.receiver.id"
        :to="`/chat/${chat.receiver.username}`"
        class="border-b p-4 flex items-start hover:bg-gray-100"
        :class="{ 'font-bold': chat.unread }"
      >
        <div class="w-12 flex-shrink-0">
          <TProfilePhoto2 size="md" :src="chat.receiver.photo" />
        </div>
        <div class="flex-grow">
          <div class="text-xs space-x-1 text-gray-900 flex">
            <span>{{ chat.receiver.username || 'DELETED' }}</span>
            <span>•</span>
            <div>
              {{ dateDiff(chat.lastMessageAt) }} ago
              <span v-if="chat.lastMessageBy === uid">(by you)</span>
            </div>
          </div>

          <div class="block text-sm leading-tight">{{ chat.lastMessage }}</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue-demi'
import { dateDiff, sortBy } from '~/utils'
import { useAuth } from '~/use/auth'
import { useFirestore } from '~/use/collection'
import { useProfiles } from '~/use/profiles'

export default {
  middleware: ['auth'],
  name: 'ChatIndex',
  setup() {
    const { uid } = useAuth()
    const db = useFirestore()
    const chats = ref([])
    const { getProfile } = useProfiles()
    let unsubscribe = null

    onMounted(() => {
      unsubscribe = db
        .collection('chats')
        .where(`members.${uid.value}`, '==', true)
        .onSnapshot((snapshot) => {
          chats.value = snapshot.docs
            .map((doc) => {
              const data = doc.data()
              const members = data.members
              delete members[uid.value]

              const receiverUid = Object.keys(members)[0]
              const receiver = getProfile(receiverUid)
              const unread =
                data.lastMessageBy !== uid.value &&
                data.lastMessageAt > data.lastSeen[uid.value]

              return {
                ...data,
                receiver,
                unread,
              }
            })
            .sort(sortBy('-lastMessageAt'))
        })
    })

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })

    return {
      chats,
      dateDiff,
      uid,
    }
  },
  head() {
    return {
      title: 'WeDance Messenger',
    }
  },
}
</script>
