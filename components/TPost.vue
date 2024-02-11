<template>
  <div ref="postRef" class="border-b pb-4">
    <div class="flex items-start p-4">
      <div class="w-10 flex-shrink-0">
        <TAvatar photo size="md" :uid="item.createdBy" />
      </div>
      <div class="flex-grow">
        <div class="block text-sm leading-tight">
          <div class="flex space-x-1 text-xs">
            <TAvatar
              name
              size="md"
              :uid="item.createdBy"
              :username="item.username"
            />
            <span>•</span>
            <div>
              <NuxtLink
                v-if="item.type === 'event' || item.type === 'import_event'"
                :to="localePath(`/events/${item.id}`)"
                class="hover:underline"
                >{{ dateDiff(item.createdAt) }}</NuxtLink
              >
              <NuxtLink
                v-else
                :to="`#/stories/${item.id}`"
                class="hover:underline"
                >{{ dateDiff(item.createdAt) }}</NuxtLink
              >
            </div>
            <template v-if="item.region">
              <span>•</span>
              <div>{{ item.region.name }}</div>
            </template>
          </div>
          <div
            v-if="item.type === 'event' || item.type === 'import_event'"
            class="text-xs"
          >
            announced an event
          </div>
          <div v-else-if="item.type === 'review'" class="text-xs">
            recommended
            <span v-if="item.place">in <TCityLink :place="item.place"/></span>
            <span v-if="item.style"
              >for <strong class="font-bold">{{ item.style }}</strong></span
            >
          </div>
          <div
            v-else-if="item.type === 'ask-for-recommendations'"
            class="text-xs"
          >
            asking
            <span v-if="item.style"
              >for <strong class="font-bold">{{ item.style }}</strong></span
            >
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
          v-if="can('edit', 'posts', item) && item.type !== 'event'"
          type="context"
          icon="edit"
          :to="localePath(`/posts/${item.id}/edit`)"
          :label="$t('post.edit')"
        />
        <TButton
          v-if="can('edit', 'posts', item) && item.type === 'event'"
          type="context"
          icon="edit"
          :to="localePath(`/events/${item.id}/edit`)"
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
          :label="$t('share.title')"
        />
      </TDropdown>
    </div>
    <div v-if="item.type === 'review'">
      <div class="p-4">
        <div class="flex justify-left w-full h-fit items-center gap-2">
          <TRatingItem :value="item.stars" />
          <div v-if="item.link">
            <a :href="item.link" target="_blank" class="text-primary text-xs">
              {{
                item.link.includes('facebook.com')
                  ? 'Posted on Facebook'
                  : 'Posted on Google'
              }}
            </a>
          </div>
        </div>
        <TPreview :content="item.description" />
        <WProfile
          v-if="item.receiver && !hideReceiver"
          :username="item.receiver.username"
          class="border rounded shadow"
        />
      </div>
    </div>
    <div v-else>
      <h1 v-if="item.title" class="px-4 font-bold text-xl">{{ item.title }}</h1>
      <TPreview :content="item.description" class="p-4 w-auto" />
      <div v-if="!hideMedia">
        <TEventText2
          v-if="item.type === 'event'"
          :item="item"
          show-date
          class="p-4 border m-4 rounded shadow"
        />

        <TCardPoll v-else-if="item.type === 'poll'" :node="item" />

        <TCardLink v-else-if="item.url" :url="item.url" :show="show" />
      </div>
    </div>
    <div class="flex gap-2 px-4">
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
        :to="`/reviews/add?city=${item.place}&style=${item.style}`"
        variant="primary"
        label="Reply"
      />
    </div>
    <slot />
  </div>
</template>

<script>
import { ref } from 'vue-demi'
import { useApp } from '~/use/app'
import { dateDiff, getEventDescription } from '~/utils'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
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
      can,
      remove,
      show,
    }
  },
}
</script>
