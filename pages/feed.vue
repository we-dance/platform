<template>
  <div>
    <THeader :title="$t('feed.title')" />
    <div class="border-b p-4 flex items-start">
      <div class="w-10 flex-shrink-0">
        <TAvatar photo size="md" :uid="uid" />
      </div>
      <div class="w-full">
        <textarea
          v-model="newMessage"
          cols="30"
          rows="2"
          :placeholder="$t('feed.newMessage.input')"
          class="w-full p-4 border text-sm"
        ></textarea>
        <div class="flex justify-between">
          <TInputSelectSmall v-model="postType" :options="postTypeList" />
          <TButton @click="send" :title="$t('feed.newMessage.intent')">{{
            $t('feed.newMessage.submit')
          }}</TButton>
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
import { usePosts } from '~/use/posts'

export default {
  setup() {
    const { uid, username } = useAuth()
    const { currentCity } = useCities()
    const { getPlace } = useApp()
    const newMessage = ref('')
    const postType = ref('')
    const { postTypeList, filterTypeList } = usePosts()

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
        Authored: {
          orderBy: 'createdAt',
          filter: { username: username.value },
        },
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
        watch: {
          count: 1,
          list: {
            [username.value]: true,
          },
        },
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
