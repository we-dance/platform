<template>
  <div ref="postRef" class="border-b">
    <div class="flex items-start p-4">
      <div class="w-10 flex-shrink-0">
        <TAvatar photo size="md" :uid="item.createdBy" />
      </div>
      <div class="flex-grow">
        <div class="block text-sm leading-tight">
          <div class="flex space-x-1 text-xs">
            <NuxtLink
              :to="`/${item.username}`"
              class="font-bold hover:underline"
              >{{ item.username }}</NuxtLink
            >
            <span>•</span>
            <div>
              <NuxtLink :to="`/posts/${item.id}`" class="hover:underline">{{
                dateDiff(item.createdAt)
              }}</NuxtLink>
            </div>
            <template v-if="item.region">
              <span>•</span>
              <div>{{ item.region.name }}</div>
            </template>
          </div>
          <h4 v-if="item.title" class="font-bold">{{ item.title }}</h4>
          <TPreview :excerpt="!show" :content="item.description" />
          <div
            v-if="item.description && item.description.length > 140"
            @click="show = !show"
            class="p-2 text-blue-700 cursor-pointer underline hover:no-underline text-xs text-center mb-2"
          >
            {{ show ? 'Show less' : 'Show more' }}
          </div>
        </div>
      </div>

      <TDropdown
        v-if="!item.hideMeta || can('edit', 'posts', item)"
        title="report or share"
        class="-mr-4"
      >
        <TButton
          v-if="can('edit', 'posts', item) && item.type !== 'event'"
          type="context"
          icon="edit"
          :to="`/posts/${item.id}/edit`"
          label="Edit"
        />
        <TButton
          v-if="can('edit', 'posts', item) && item.type === 'event'"
          type="context"
          icon="edit"
          :to="`/events/${item.id}/edit`"
          label="Edit"
        />
        <TButton
          v-if="can('edit', 'posts', item)"
          type="context"
          icon="delete"
          label="Delete"
          @click="remove(item.id)"
        />
        <TCardActions
          :id="item.id"
          collection="posts"
          :item="item"
          type="context"
        />
        <TButtonShare
          :id="item.id"
          collection="posts"
          :file="item.socialCover"
          :file-name="item.id"
          :url="`https://wedance.vip/posts/${item.id}`"
          :text="item.description"
          type="context"
          label="Share"
        />
      </TDropdown>
    </div>
    <div v-if="!hideMedia">
      <NuxtLink
        v-if="item.type === 'event'"
        :to="`/events/${item.id}`"
        class="hover:opacity-75"
      >
        <TSharePreviewPost
          :username="item.username"
          collection="events"
          :title="item.name"
          :type="item.type"
          :description="getEventDescription(item)"
          :extra="item.locality"
          :photo="item.cover"
          :styles="item.styles"
          size="sm"
        />
      </NuxtLink>

      <TCardPoll v-else-if="item.type === 'poll'" :node="item" />

      <TCardLink v-else-if="item.url" :url="item.url" :show="show" />
    </div>

    <div v-if="!hideComments && !item.hideComments" class="border-t p-4">
      <NuxtLink
        v-if="item.commentsCount > 1"
        :to="`/posts/${item.id}`"
        class="p-2 text-blue-700 cursor-pointer underline hover:no-underline text-xs text-center mb-2 block"
      >
        Show all {{ item.commentsCount - 1 }} comments
      </NuxtLink>
      <div
        v-if="item.commentsCount < 0"
        class="text-xs text-gray-900 p-2 text-center mb-2"
      >
        There are no replies yet.
      </div>
      <div
        v-if="item.commentsCount > 0"
        class="flex text-xs space-x-1 text-gray-900 p-2 overflow-hidden"
      >
        <div>
          <TAvatar photo name :uid="item.commentsLast.createdBy">
            <span>•</span>
            <div>{{ dateDiff(item.commentsLast.createdAt) }} ago</div>
          </TAvatar>
          <div class="mt-1">{{ item.commentsLast.body }}</div>
        </div>
      </div>
      <div>
        <textarea
          v-model="newReply"
          rows="1"
          :placeholder="`Reply to ${item.username}`"
          class="w-full border p-2 text-xs text-gray-900"
          @keyup.enter="sendReply"
        ></textarea>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
import { computed, ref } from 'vue-demi'
import { useApp } from '~/use/app'
import { dateDiff, getEventDescription } from '~/utils'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { trackNodeView } from '~/use/tracking'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    hideMedia: {
      type: Boolean,
      default: false,
    },
    hideComments: {
      type: Boolean,
      default: false,
    },
    showAll: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (!this.$refs.postRef) {
      return
    }

    const options = {
      rootMargin: '0px',
      threshold: 1.0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          this.onView()
        }
      })
    }, options)

    observer.observe(this.$refs.postRef)
  },
  setup(props) {
    const { can, username } = useAuth()
    const { getCity } = useApp()
    const { remove, softUpdate } = useDoc('posts')
    const { create } = useDoc('comments')
    const newReply = ref('')
    const show = ref(props.showAll)

    const onView = () => {
      if (!props.item?.id) {
        return
      }

      trackNodeView(props.item.id, props.item.viewsCount || 0)
    }

    const isHidden = computed(() => {
      return !!props.item.hide?.list[username.value]
    })

    const sendReply = async () => {
      const body = newReply.value

      if (!body) {
        return
      }

      const watchCount = props.item.watch?.count || 0
      const isWatching = !!props.item.watch?.list[username.value]

      newReply.value = ''

      const commentDocRef = await create({
        postId: props.item.id,
        commentId: '',
        body,
      })

      const commentsLast = await (await commentDocRef.get()).data()

      softUpdate(props.item.id, {
        commentsCount: props.item.commentsCount + 1,
        commentsLast,
        [`watch.count`]: isWatching ? watchCount : watchCount + 1,
        [`watch.list.${username.value}`]: true,
      })
    }

    return {
      dateDiff,
      getCity,
      newReply,
      sendReply,
      getEventDescription,
      can,
      remove,
      isHidden,
      show,
      onView,
    }
  },
}
</script>
