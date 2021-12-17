<template>
  <div>
     <THeader :title="$t('feed.title')">
      <TButton type="nav" icon="plus" to="/posts/-/edit" />
    </THeader>
    <TList
      collection="posts"
      :filter-default="{ place: currentCity }"
      :filter-fields="postFilters"
      sort-by="-createdAt"
      list-wrapper="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2"
    >
      <template v-slot:before>
        <div class="grid grid-cols-2">
          <WTeaser
            :title="$t('teaser.partner.title')"
            :description="$t('teaser.partner.description')"
            :button="$t('teaser.partner.btn')"
            url="/community"
            class="flex-1"
          />
          <WTeaser
            :title="$t('teaser.events.title')"
            :description="$t('teaser.events.description')"
            :button="$t('teaser.events.btn')"
            url="/events"
            class="flex-1"
          />
        </div>
      </template>
      <template v-slot:item="{ item }">
        <router-link :to="`/posts/${item.id}`" class="hover:opacity-75">
          <TSharePreviewPost
            type="Post"
            collection="posts"
            :username="item.createdByUsername"
            :title="item.title"
            :photo="item.cover"
            :styles="item.styles"
            align="center"
            size="sm"
            :likes="item.savedByCount"
          />
        </router-link>
      </template>
    </TList>
  </div>
</template>

<script>
import { postFilters } from '~/use/posts'
import { useCities } from '~/use/cities'
import { useAuth } from '~/use/auth'

export default {
  name: 'PostsIndex',
  setup() {
    const { currentCity } = useCities()
    const { uid } = useAuth()

    return {
      postFilters,
      currentCity,
      uid,
    }
  },
  head() {
    return {
      title: 'WeDance Feed',
    }
  },
}
</script>
