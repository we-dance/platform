<template>
  <TLoader v-if="loading" />
  <div v-else class="flex h-full flex-col">
    <THeader
      :title="$t('conversation.userName', { username: receiver.username })"
    />
    <div v-if="!chat || !chat.createdAt" class="p-16 text-center text-xs">
      {{ $t('conversation.empty') }}
    </div>
    <div v-else class="flex-grow overflow-y-scroll">
      <div
        v-for="item in chat.messages"
        :key="item.createdAt"
        class="flex items-start border-b p-4"
      >
        <div class="w-12 flex-shrink-0">
          <TAvatar photo size="md" :uid="item.createdBy" />
        </div>
        <div class="flex-grow">
          <div class="flex space-x-1 text-xs text-gray-900">
            <TAvatar name :uid="item.createdBy" />
            <span>•</span>
            <div>{{ dateDiff(item.createdAt) }}</div>
          </div>

          <TPreview class="text-sm leading-tight" :content="item.text" />
        </div>
      </div>
      <div class="p-4 text-center text-xs">
        <div v-if="chat.lastSeen[receiverUid]">
          <NuxtLink :to="`/${receiver.username}`" class="underline">{{
            receiver.username
          }}</NuxtLink>
          {{ $t('conversation.lastSeen') }}
          {{ dateDiff(chat.lastSeen[receiverUid]) }}
        </div>
        <div v-else>
          <NuxtLink :to="`/${receiver.username}`" class="underline">{{
            receiver.username
          }}</NuxtLink>
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
        class="w-full border-t border-b p-4"
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

    onMounted(async () => {
      await find('username', params.slug)

      chatId.value = getChatId()

      unsubscribe = db
        .collection('chats')
        .doc(chatId.value)
        .onSnapshot((snapshot) => {
          chat.value = snapshot.data()
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
