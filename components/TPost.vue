<template>
  <div ref="postRef" class="border-b pb-4">
    <div class="flex items-start p-4">
      <div class="w-10 flex-shrink-0">
        <TAvatar photo size="md" :uid="item.createdBy" />
      </div>
      <div class="flex-grow">
        <div class="block text-sm leading-tight">
          <div class="flex flex-wrap space-x-1 text-xs">
            <TAvatar
              name
              size="md"
              :uid="item.createdBy"
              :username="item.username"
            />
            <span>•</span>
            <div>
              <NuxtLink
                v-if="item.type === 'post'"
                :to="localePath(`/posts/${item.id}`)"
                class="hover:underline"
                >{{ dateDiff(item.createdAt) }}</NuxtLink
              >
              <NuxtLink
                v-else
                :to="localePath(`/stories/${item.id}`)"
                class="hover:underline"
                >{{ dateDiff(item.createdAt) }}</NuxtLink
              >
            </div>
          </div>

          <div v-if="item.type === 'review'" class="text-xs">
            posted review
            <span v-if="item.place">in <TCityLink :place="item.place"/></span>
            <span v-if="item.style"
              >for <TDanceLink :dance="item.style" class="fond-bold"
            /></span>
          </div>
          <div
            v-else-if="item.type === 'ask-for-recommendations'"
            class="text-xs"
          >
            asking
            <span v-if="item.style"
              >for <TDanceLink :dance="item.style" class="fond-bold"
            /></span>
            <span v-if="item.place">in <TCityLink :place="item.place"/></span>
          </div>
          <div v-else class="text-xs">published a post</div>
        </div>
      </div>

      <TDropdown
        v-if="!item.hideMeta || can('edit', 'posts', item)"
        :title="$t('TPost.dropdown')"
        class="-mr-4"
      >
        <TButton
          v-if="can('edit', 'posts', item) && item.type === 'post'"
          type="context"
          icon="edit"
          :to="localePath(`/posts/${item.id}/edit`)"
          :label="$t('post.edit')"
        />
        <TButton
          v-else-if="can('edit', 'posts', item) && item.type !== 'event'"
          type="context"
          icon="edit"
          :to="localePath(`/stories/${item.id}/edit`)"
          :label="$t('post.edit')"
        />
        <TButton
          v-if="can('edit', 'posts', item)"
          type="context"
          icon="delete"
          :label="$t('post.delete')"
          @click="remove(item.id)"
        />
        <TCardActions
          :id="item.id"
          collection="stories"
          :item="item"
          type="context"
        />
        <TButtonShare
          :id="item.id"
          collection="posts"
          :file="item.socialCover"
          :file-name="item.id"
          :url="`https://wedance.vip/stories/${item.id}`"
          :text="item.description"
          type="context"
          :label="$t('share.title')"
        />
      </TDropdown>
    </div>
    <div v-if="item.type === 'review'">
      <div class="p-4">
        <WQuestion
          v-if="item.question && !hideReplyFor"
          :story-id="item.question"
          label="Reply for"
          class="text-xs"
        />
        <div class="flex justify-left w-full h-fit items-center gap-2">
          <TRatingItem :value="item.stars" />
          <div v-if="item.sourceFacebook">
            <a
              :href="item.sourceFacebook"
              target="_blank"
              class="text-primary text-xs"
            >
              Review on Facebook
            </a>
          </div>
          <div v-if="item.sourceGoogle">
            <a
              :href="item.sourceGoogle"
              target="_blank"
              class="text-primary text-xs"
            >
              Review on Google
            </a>
          </div>
        </div>
        <TPreview :content="item.description" />
        <WProfile
          v-if="item.receiver && !hideReceiver"
          :username="item.receiver.username"
          hide-role
          class="border rounded shadow"
        />
      </div>
    </div>
    <div v-else>
      <h1 v-if="item.title" class="px-4 font-bold text-xl">{{ item.title }}</h1>

      <TPreview
        v-if="expanded"
        :content="item.description"
        class="p-4 w-auto"
      />
      <TPreview
        v-else
        :content="getExcerpt(item.description)"
        class="p-4 w-auto"
      />

      <div v-if="!hideMedia">
        <TEventText2
          v-if="item.type === 'event'"
          :item="item"
          show-date
          class="p-4 border m-4 rounded shadow"
        />

        <TCardPoll v-else-if="item.type === 'poll'" :node="item" />
      </div>
    </div>
    <t-link-preview v-if="item.url" :url="item.url" class="m-4 mt-0" />
    <t-link-preview v-if="item.link" :url="item.link" class="m-4 mt-0" />
    <t-venue-preview v-if="item.venue" :venue="item.venue" class="m-4 mt-0" />
    <div class="flex flex-wrap gap-2 px-4 items-center">
      <TReaction
        :label="$t('Helpful')"
        field="upvotes"
        :item="item"
        collection="stories"
      />
      <TReaction
        :label="$t('Not Helpful')"
        field="downvotes"
        :item="item"
        collection="stories"
      />
      <TButton
        v-if="item.type === 'ask-for-recommendations'"
        :to="localePath(`/stories/${item.id}`)"
        variant="primary"
        :label="repliesCount ? `${repliesCount} replies` : 'Reply'"
      />
      <TButton
        v-if="item.type === 'post'"
        :to="localePath(`/posts/${item.id}`)"
        type="primary"
        label="Read more"
      />
      <TButton
        v-else-if="item.title && !expanded"
        :to="localePath(`/stories/${item.id}`)"
        type="primary"
        label="Read more"
      />
    </div>
    <slot />
  </div>
</template>

<script>
import { ref } from 'vue-demi'
import { useApp } from '~/use/app'
import { dateDiff, getEventDescription, getExcerpt } from '~/utils'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    hideReplyFor: {
      type: Boolean,
      default: false,
    },
    hideReceiver: {
      type: Boolean,
      default: false,
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
    expanded: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { can } = useAuth()
    const { getCity } = useApp()
    const { remove } = useDoc('stories')

    const show = ref(props.showAll)

    return {
      dateDiff,
      getCity,
      getEventDescription,
      getExcerpt,
      can,
      remove,
      show,
    }
  },
  computed: {
    repliesCount() {
      return this.item.replies?.length || 0
    },
  },
}
</script>
