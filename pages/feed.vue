<template>
  <div>
    <THeader title="Feed" />
    <div>
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
    </div>
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
