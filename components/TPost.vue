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
              <NuxtLink
                v-if="item.type === 'event'"
                :to="`/events/${item.id}`"
                class="hover:underline"
                >{{ dateDiff(item.createdAt) }}</NuxtLink
              >
              <NuxtLink
                v-else
                :to="`/posts/${item.id}`"
                class="hover:underline"
                >{{ dateDiff(item.createdAt) }}</NuxtLink
              >
            </div>
            <template v-if="item.region">
              <span>•</span>
              <div>{{ item.region.name }}</div>
            </template>
          </div>
          <div class="text-xs">announced an event</div>
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
          :to="`/posts/${item.id}/edit`"
          :label="$t('post.edit')"
        />
        <TButton
          v-if="can('edit', 'posts', item) && item.type === 'event'"
          type="context"
          icon="edit"
          :to="`/events/${item.id}/edit`"
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
    <h1 v-if="item.title" class="font-bold text-xl">{{ item.title }}</h1>
    <TExpand v-if="item.description" class="p-4 w-auto">
      <TPreview :content="item.description" />
    </TExpand>
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
  setup(props) {
    const { can } = useAuth()
    const { getCity } = useApp()
    const { remove } = useDoc('posts')

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
