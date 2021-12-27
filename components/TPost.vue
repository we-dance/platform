<template>
  <div
    v-if="isHidden"
    class="border-b p-4 text-xs flex justify-between items-center"
  >
    <TPreview
      excerpt
      :content="item.description"
      class="flex-grow-1 text-gray-600"
    />
    <TReaction
      label="Hide"
      toggledLabel="Unhide"
      field="hide"
      icon="EyeOffIcon"
      :item="item"
    />
  </div>
  <div v-else ref="postRef" class="border-b p-4">
    <div class="flex items-start">
      <div v-if="!item.hideMeta" class="w-12 flex-shrink-0">
        <TAvatar photo size="md" :uid="item.createdBy" />
      </div>
      <div class="flex-grow">
        <div class="block text-sm leading-tight">
          <h4 class="font-bold">{{ item.title }}</h4>
          <TPreview :excerpt="showExcerpt" :content="item.description" />
          <div
            v-if="item.description && item.description.length > 140"
            @click="showExcerpt = !showExcerpt"
            class="p-2 text-blue-700 cursor-pointer underline hover:no-underline text-xs text-center mb-2"
          >
            {{ showExcerpt ? 'Show more' : 'Show less' }}
          </div>
        </div>

        <TCardLink v-if="item.url" :url="item.url" class="my-2" />

        <template v-if="item.type === 'event'">
          <TCardEvent v-if="!$route.query.variant" :node="item" class="my-2" />

          <TSharePreviewPost
            v-if="$route.query.variant === '2'"
            :username="item.username"
            collection="events"
            :title="item.name"
            :type="item.type"
            :description="getEventDescription(item)"
            :extra="item.locality"
            :photo="item.cover"
            :styles="item.styles"
            size="sm"
            class="my-2"
          />
        </template>

        <div v-if="!item.hideMeta" class="text-xs space-x-1 text-gray-900 flex">
          <router-link :to="`/${item.username}`" class="hover:underline">{{
            item.username
          }}</router-link>
          <span>•</span>
          <div>{{ dateDiff(item.createdAt) }} ago</div>
          <template v-if="item.region">
            <span>•</span>
            <div>{{ item.region.name }}</div>
          </template>
        </div>

        <div v-if="!item.hideComments" class="border-t mt-4">
          <router-link
            v-if="item.commentsCount > 1"
            :to="`/posts/${item.id}`"
            class="p-2 text-blue-700 cursor-pointer underline hover:no-underline text-xs text-center mb-2 block"
          >
            Show all {{ item.commentsCount - 1 }} comments
          </router-link>
          <div
            v-if="item.commentsCount < 0"
            class="text-xs text-gray-900 p-2 text-center mb-2"
          >
            There are no replies yet.
          </div>
          <div
            v-if="item.commentsCount > 0"
            class="flex text-xs space-x-1 text-gray-900 p-2"
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
      </div>
      <TDropdown v-if="!item.hideMeta || can('edit', 'posts', item)">
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
          v-if="can('delete', 'posts', item)"
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
    <div
      v-if="!item.hideReactions"
      class="flex flex-wrap gap-2 justify-center items-center"
    >
      <TReaction
        label="Watch"
        toggledLabel="Watching"
        field="watch"
        icon="EyeIcon"
        :item="item"
      />
      <TReaction
        label="Star"
        toggledLabel="Starred"
        field="star"
        icon="StarIcon"
        :item="item"
      />
      <TReaction
        label="Hide"
        toggledLabel="Unhide"
        field="hide"
        icon="EyeOffIcon"
        :item="item"
      />
      <div class="text-xs text-gray-500">{{ item.viewsCount }} views</div>
    </div>
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
    const showExcerpt = ref(true)

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
      showExcerpt,
      onView,
    }
  },
}
</script>
