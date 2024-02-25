<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <TPost :item="doc" show-all expanded>
      <TStyles
        v-if="doc.styles && Object.keys(doc.styles).length"
        :value="doc.styles"
        hide-level
        class="flex flex-wrap justify-center p-2 text-xs mt-4 border-t"
      />
      <TCommentsInline :item="doc" class="p-4 border-t mt-4" autoload />
    </TPost>
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useProfiles } from '~/use/profiles'
import { useRouter } from '~/use/router'
import { getExcerpt, getPostMeta, loadDoc, getDateTime } from '~/utils'
import { trackView } from '~/use/tracking'

export default {
  layout: 'full',
  async asyncData(ctx) {
    return await loadDoc(ctx, 'posts')
  },
  computed: {
    author() {
      return this.getProfile(this.doc.createdBy)
    },
    publishedAt() {
      return getDateTime(this.doc?.createdAt)
    },
  },
  watch: {
    item() {
      if (this.item && this.item.title) {
        this.doc = this.item
        trackView('posts', this.item.id, this.item.viewsCount || 0)
      }
    },
  },
  head() {
    return getPostMeta(this.doc)
  },
  setup() {
    const { uid } = useAuth()
    const { getProfile } = useProfiles()
    const { doc: item, sync } = useDoc('posts')
    const { params } = useRouter()

    if (params.id) {
      sync(params.id)
    }

    return {
      uid,
      getProfile,
      getExcerpt,
      item,
    }
  },
}
</script>
