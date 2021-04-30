<template>
  <div>
    <portal to="title">
      <h1 class="ml-1 font-lato text-lg font-bold">
        Messages
      </h1>
    </portal>

    <TPostList />
  </div>
</template>

<script>
import { postFilters } from '~/use/posts'
import { useCities } from '~/use/cities'

export default {
  name: 'PostsIndex',
  setup() {
    const { currentCity } = useCities()

    return {
      postFilters,
      currentCity
    }
  }
}
</script>
