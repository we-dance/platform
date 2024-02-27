<template>
  <div>
    <THeader :title="$t('chat.title')" />
    <div v-if="!chats.length" class="p-16 text-xs text-center">
      {{ $t('chat.empty') }}
    </div>
    <div v-else>
      <NuxtLink
        v-for="chat in chats"
        :key="chat.id"
        :to="localePath(`/chat/${chat.receiver.username}`)"
        class="border-b p-4 flex items-start hover:bg-gray-100"
        :class="{ 'font-bold': chat.unread }"
      >
        <div class="w-12 flex-shrink-0">
          <TProfilePhoto2 size="md" :src="chat.receiver.photo" />
        </div>
        <div class="flex-grow">
          <div class="text-xs space-x-1 text-gray-900 flex">
            <span>{{
              chat.receiver.username || $t('chat.receiver.deleted')
            }}</span>
            <span>•</span>
            <div>
              {{ dateDiff(chat.lastMessageAt) }}
              <span v-if="chat.lastMessageBy === uid"
                >({{ $t('chat.lastMessage.byYou') }})</span
              >
            </div>
          </div>
          <div class="block text-sm leading-tight">{{ chat.lastMessage }}</div>
        </div>
      </NuxtLink>
      <div ref="target" class="mt-4 p-4 flex justify-center items-center"></div>
    </div>
  </div>
</template>

<script>
import { useElementVisibility } from '@vueuse/core'
import { onMounted, onUnmounted, ref, watch } from 'vue-demi'
import { dateDiff, sortBy } from '~/utils'
import { useAuth } from '~/use/auth'
import { useFirestore } from '~/use/collection'
import { useProfiles } from '~/use/profiles'

export default {
  middleware: ['auth'],
  name: 'ChatIndex',
  setup() {
    const target = ref(null)
    const targetIsVisible = useElementVisibility(target)
    const { uid } = useAuth()
    const db = useFirestore()
    const chats = ref([])
    const { getFullProfile } = useProfiles()
    const lastLoaded = ref(null)
    const unsubscribes = []

    function load() {
      let collection = db
        .collection('chats')
        .where('users', 'array-contains', uid.value)
        .orderBy('lastMessageAt', 'desc')

      if (lastLoaded.value) {
        collection = collection.startAfter(lastLoaded.value)
      }

      const unsubscribe = collection.limit(10).onSnapshot(async (snapshot) => {
        const newChats = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data()
            data.id = doc.id
            const members = { ...data.members }
            delete members[uid.value]

            const receiverUid = Object.keys(members)[0]
            const receiver = await getFullProfile(receiverUid)
            const unread =
              data.lastMessageBy !== uid.value &&
              data.lastMessageAt > data.lastSeen[uid.value]

            return {
              ...data,
              receiver,
              unread,
            }
          })
        )

        // get unique chats and sort
        chats.value = [...chats.value, ...newChats]
          .reduce((acc, chat) => {
            const existing = acc.find((c) => c.id === chat.id)
            if (!existing) {
              acc.push(chat)
            }
            return acc
          }, [])
          .sort(sortBy('-lastMessageAt'))

        lastLoaded.value = snapshot.docs[snapshot.docs.length - 1]
      })

      unsubscribes.push(unsubscribe)
    }

    watch(targetIsVisible, (isVisible) => {
      if (isVisible) {
        load()
      }
    })

    onMounted(load)

    onUnmounted(() => {
      if (unsubscribes.length) {
        unsubscribes.forEach((unsubscribe) => {
          unsubscribe()
        })
      }
    })

    return {
      target,
      chats,
      dateDiff,
      uid,
      load,
    }
  },
  head() {
    return {
      title: 'WeDance Messenger',
    }
  },
}
</script>
