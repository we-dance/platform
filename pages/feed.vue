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

    <div class="border-b p-4">
      <TInputButtons
        v-model="orderBy"
        :options="[
          { label: 'Newest', value: 'createdAt' },
          { label: 'Hot', value: 'watch.count' },
          { label: 'Popular', value: 'star.count' },
          { label: 'Unpopular', value: 'hide.count' },
        ]"
      />
    </div>

    <TPostList :orderBy="orderBy" />
  </div>
</template>

<script>
import { ref } from 'vue-demi'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
import { useDoc } from '~/use/doc'
import { useApp } from '~/use/app'
import { getUrlFromText } from '~/utils'

export default {
  setup() {
    const { uid } = useAuth()
    const { currentCity } = useCities()
    const { getPlace } = useApp()
    const newMessage = ref('')
    const orderBy = ref('createdAt')
    const { create } = useDoc('posts')

    const send = () => {
      let description = newMessage.value

      if (!description) {
        return
      }

      const url = getUrlFromText(description)
      description = description.replace(url, '').trim()

      const region = getPlace(currentCity.value)

      newMessage.value = ''

      const post = {
        region,
        description,
        type: 'post',
        url,
        commentsCount: 0,
        commentsLast: null,
        watchersCount: 0,
        viewsCount: 0,
      }

      create(post)
    }

    return { currentCity, uid, newMessage, send, orderBy }
  },
}
</script>
