<template>
  <TLoader v-if="loading" />
  <div v-else class="flex flex-col h-full">
    <THeader
      :title="$t('conversation.userName', { username: receiver.username })"
    />
    <div v-if="!chat || !chat.createdAt" class="p-16 text-xs text-center">
      {{ $t('conversation.empty') }}
    </div>
    <div v-else class="overflow-y-scroll flex-grow">
      <div
        v-for="item in chat.messages"
        :key="item.createdAt"
        class="border-b p-4 flex items-start"
      >
        <div class="w-12 flex-shrink-0">
          <TAvatar photo size="md" :uid="item.createdBy" />
        </div>
        <div class="flex-grow">
          <div class="text-xs space-x-1 text-gray-900 flex">
            <TAvatar name :uid="item.createdBy" />
            <span>•</span>
            <div>{{ dateDiff(item.createdAt) }}</div>
          </div>

          <TPreview class="text-sm leading-tight" :content="item.text" />
          <TPost v-if="item.post" :item="item.post" />
        </div>
      </div>
      <div class="text-xs p-4 text-center">
        <div v-if="chat.lastSeen[receiverUid]">
          <NuxtLink
            :to="localePath(`/${receiver.username}`)"
            class="underline"
            >{{ receiver.username }}</NuxtLink
          >
          {{ $t('conversation.lastSeen') }}
          {{ dateDiff(chat.lastSeen[receiverUid]) }}
        </div>
        <div v-else>
          <NuxtLink
            :to="localePath(`/${receiver.username}`)"
            class="underline"
            >{{ receiver.username }}</NuxtLink
          >
          {{ $t('conversation.unread') }}
        </div>
      </div>
    </div>
    <div>
      <textarea
        v-model="newMessage"
        cols="30"
        rows="2"
        :placeholder="$t('conversation.newMessage.placeholder')"
        class="w-full p-4 border-t border-b"
        @keyup.enter="send"
      ></textarea>
      <div class="flex justify-end">
        <TButton @click="send">
          {{ $t('conversation.newMessage.submit') }}</TButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { onMounted, onUnmounted, ref } from 'vue-demi'
import { dateDiff } from '~/utils'
import { useAuth } from '~/use/auth'
import { useRouter } from '~/use/router'
import { useDoc } from '~/use/doc'
import { useFirestore } from '~/use/collection'

export default {
  name: 'ChatDialogue',
  middleware: ['auth'],
  setup() {
    const { params } = useRouter()
    const { uid } = useAuth()
    const { doc: receiver, id: receiverUid, find, loading } = useDoc('profiles')
    const db = useFirestore()
    const chatId = ref('')
    const newMessage = ref('')
    const chat = ref({})
    let unsubscribe = null

    async function getLinked(message) {
      const link = message.match(
        /https:\/\/wedance.vip\/stories\/[a-zA-Z0-9]+/g
      )

      if (!link) {
        return null
      }

      const story = await db
        .collection('stories')
        .doc(link[0].split('/').pop())
        .get()

      return { ...story.data(), id: story.id }
    }

    onMounted(async () => {
      await find('username', params.slug)

      chatId.value = getChatId()

      unsubscribe = db
        .collection('chats')
        .doc(chatId.value)
        .onSnapshot(async (snapshot) => {
          const data = snapshot.data()

          if (data?.messages) {
            // go over messages and load linked stories
            for (const messageIndex in data.messages) {
              const message = data.messages[messageIndex]
              if (message.text.includes('https://wedance.vip/stories/')) {
                data.messages[messageIndex].post = await getLinked(message.text)
              }
            }
          }

          chat.value = data
        })

      setTimeout(markAsRead, 2000)
    })

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })

    async function markAsRead() {
      if (chat.value?.createdAt) {
        await db
          .collection('chats')
          .doc(chatId.value)
          .update({
            [`lastSeen.${uid.value}`]: Date.now(),
          })
      }
    }

    async function send() {
      const timeSent = Date.now()

      const message = {
        text: newMessage.value,
        createdBy: uid.value,
        createdAt: timeSent,
      }

      newMessage.value = ''

      if (!chat.value) {
        await db
          .collection('chats')
          .doc(chatId.value)
          .set({
            createdAt: timeSent,
            createdBy: uid.value,
            lastMessage: message.text,
            lastMessageBy: uid.value,
            lastMessageAt: timeSent,
            members: {
              [uid.value]: true,
              [receiverUid.value]: true,
            },
            users: [uid.value, receiverUid.value],
            lastSeen: {
              [uid.value]: timeSent,
              [receiverUid.value]: 0,
            },
            messages: [message],
          })
      } else {
        await db
          .collection('chats')
          .doc(chatId.value)
          .update({
            lastMessage: message.text,
            lastMessageBy: uid.value,
            lastMessageAt: timeSent,
            [`lastSeen.${uid.value}`]: timeSent,
            messages: firebase.firestore.FieldValue.arrayUnion(message),
          })
      }
    }

    function getChatId() {
      const list = [receiverUid.value, uid.value]
      return list.sort((a, b) => ('' + a).localeCompare(b)).join('-')
    }

    return {
      chatId,
      receiver,
      receiverUid,
      dateDiff,
      loading,
      chat,
      newMessage,
      send,
    }
  },
  head() {
    return {
      title: 'WeDance Chat',
    }
  },
}
</script>
