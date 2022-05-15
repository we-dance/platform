<template>
  <div>
    <THeader :title="$t('feed.title')" />
    <div class="border-b p-4">
      <div class="text-sm mb-4 text-center">
        We are working on a new version of the platform. Would you like to be
        the first one to see it?
      </div>
      <div class="text-center">
        <button
          data-tf-slider="Flh9wptJ"
          data-tf-width="550"
          data-tf-iframe-props="title=Dance Content"
          data-tf-medium="snippet"
          class="rounded-full bg-primary text-white px-4 py-2"
        >
          Request Beta
        </button>
      </div>
      <script src="https://embed.typeform.com/next/embed.js"></script>
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
  name: 'Feed',
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
