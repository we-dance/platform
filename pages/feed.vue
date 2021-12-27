<template>
  <div>
    <THeader title="Feed" />
    <div class="border-b p-4 flex items-start">
      <div class="w-10 flex-shrink-0">
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
        <div class="flex justify-between">
          <TInputSelect
            v-model="postType"
            icon="add"
            type="simple"
            :options="postTypeList"
          />
          <TButton @click="send" title="post a message">Send</TButton>
        </div>
      </div>
    </div>

    <div class="border-b p-4 flex">
      <TInputSelect v-model="filterType" :options="filterTypeList" />
    </div>

    <TPostList v-bind="filter" />
  </div>
</template>

<script>
import { computed, ref } from 'vue-demi'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
import { useDoc } from '~/use/doc'
import { useApp } from '~/use/app'
import { getUrlFromText } from '~/utils'
import { postTypeList } from '~/use/posts'
import TInputSelect from '~/components/TInput/TInputSelect.vue'

export default {
  components: { TInputSelect },
  setup() {
    const { uid, username } = useAuth()
    const { currentCity } = useCities()
    const { getPlace } = useApp()
    const newMessage = ref('')
    const postType = ref('')

    const filterTypeList = [
      { label: 'Newest', value: 'Newest' },
      { label: 'Hot', value: 'Hot' },
      { label: 'Popular', value: 'Popular' },
      { label: 'Unpopular', value: 'Unpopular' },
      { label: 'Watching', value: 'Watching' },
      { label: 'Starred', value: 'Starred' },
      { label: 'Archived', value: 'Archived' },
      { label: 'Yours', value: 'Authored' },
    ]

    const filterType = ref('Newest')
    const { create } = useDoc('posts')

    const filter = computed(() => {
      const map = {
        Newest: { orderBy: 'createdAt' },
        Hot: { orderBy: 'watch.count' },
        Popular: { orderBy: 'star.count' },
        Unpopular: { orderBy: 'hide.count' },
        Watching: { filter: { [`watch.list.${username.value}`]: true } },
        Starred: { filter: { [`star.list.${username.value}`]: true } },
        Archived: { filter: { [`hide.list.${username.value}`]: true } },
        Authored: { filter: { username: username.value } },
      }

      return map[filterType.value]
    })

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
        type: postType.value,
        url,
        commentsCount: 0,
        commentsLast: null,
        watchersCount: 0,
        viewsCount: 0,
      }

      create(post)
    }

    return {
      currentCity,
      uid,
      newMessage,
      send,
      filterType,
      filter,
      postType,
      filterTypeList,
      postTypeList,
    }
  },
}
</script>
