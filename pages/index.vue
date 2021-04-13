<template>
  <TList
    title="Feed"
    add="Add Post"
    add-url="/posts/-/edit"
    collection="posts"
    :filter-default="{ place: currentCity }"
    :filter-fields="postFilters"
    :tabs="postSorts"
    sort-by="-createdAt"
    list-wrapper="mt-4 grid grid-cols-1 md:grid-cols-2 col-gap-2 row-gap-2"
  >
    <template v-slot:before>
      <div class="md:flex space-y-4 md:space-y-0 md:space-x-4 mb-4">
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
</template>

<script>
import { postFilters, postSorts } from '~/use/posts'
import { useCities } from '~/use/cities'

export default {
  name: 'PostsIndex',
  setup() {
    const { currentCity } = useCities()

    return {
      postFilters,
      postSorts,
      currentCity
    }
  }
}
</script>
