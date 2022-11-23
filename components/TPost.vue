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
          <h1 v-if="item.title" class="font-bold text-xl">{{ item.title }}</h1>
          <TPreview :excerpt="!show" :content="item.description" />
          <div
            v-if="item.description && item.description.length > 140"
            class="p-2 text-blue-700 cursor-pointer underline hover:no-underline text-xs text-center mb-2"
            @click="show = !show"
          >
            {{ show ? $t('TPost.showLess') : $t('TPost.showMore') }}
          </div>
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
    <div v-if="!hideMedia">
      <NuxtLink
        v-if="item.type === 'event'"
        :to="`/events/${item.id}`"
        class="hover:opacity-75"
      >
        <TSharePreviewPost
          :username="item.org ? item.org.username : ''"
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
