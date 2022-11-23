<template>
  <div>
    <THeader :title="doc.title || '...'" />

    <TStyles
      :value="doc.styles"
      hide-level
      class="flex flex-wrap justify-center border-b p-2 text-xs"
    />

    <img v-if="doc.cover" :src="doc.cover" />

    <TPost :item="doc" show-all>
      <TItemCreator :item="doc" full />

      <div class="p-4 text-center bg-dark text-white">
        <div>Discover dancers and dance events near you</div>
        <div class="max-w-lg mx-auto">
          <TButton
            allow-guests
            icon="search"
            label="Find your city"
            to="/cities"
            type="void"
            class="mt-2 w-full text-gray-500 bg-white hover:bg-gray-100 font-semibold py-2 px-4 border border-gray-400 rounded-full shadow"
          />
        </div>
      </div>

      <TCommentsInline :item="doc" class="p-4" autoload />
    </TPost>

    <div
      class="sticky bottom-0 z-50 flex justify-center gap-2 border-b bg-white p-4"
    >
      <a
        href="#comments"
        class="rounded-full inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer outline-none focus:outline-none inline-block font-bold"
        >{{ doc.commentsCount }} comments</a
      >
      <TReaction
        label="Save"
        toggled-label="Saved"
        field="star"
        icon="BookmarkIcon"
        class="rounded-full"
        :item="doc"
      />

      <div
        class="rounded-full inline-flex items-center px-3 py-2 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer outline-none focus:outline-none inline-block font-bold"
      >
        {{ doc.viewsCount || 0 }} views
      </div>
    </div>

    <div class="mt-4 bg-gray-100 py-4 flex justify-center">
      <div class="max-w-md py-4 space-y-1">
        <div class="flex justify-center"></div>
        <h3 class="text-2xl font-extrabold text-center">
          {{ $t('international.title') }}
        </h3>
        <p class="text-center">
          {{ $t('international.description') }}
        </p>
        <div class="p-4 flex flex-wrap gap-2 items-center justify-center">
          <TButton
            allow-guests
            icon="youtube"
            type="round"
            icon-size="6"
            href="https://www.youtube.com/channel/UC1pdWS3nCLrd8LnQyNNSNUw"
          />
          <TButton
            allow-guests
            icon="instagram"
            type="round"
            icon-size="6"
            href="https://instagram.com/WeDancePlatform"
          />
          <TButton
            allow-guests
            icon="telegram"
            type="round"
            icon-size="6"
            href="https://t.me/WeDanceTravel"
          />
          <TButton
            allow-guests
            icon="twitter"
            type="round"
            icon-size="6"
            href="https://twitter.com/WeDancePlatform"
          />
          <TButton
            allow-guests
            icon="tiktok"
            type="round"
            icon-size="6"
            href="https://tiktok.com/@WeDanceVIP"
          />
          <TButton
            allow-guests
            icon="facebook"
            type="round"
            icon-size="6"
            href="https://www.facebook.com/WeDance-109777921433083"
          />
        </div>
      </div>
    </div>

    <div class="bg-dark text-white">
      <TFooter class="p-4 mx-auto max-w-4xl" />
    </div>
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useProfiles } from '~/use/profiles'
import { useRouter } from '~/use/router'
import { getExcerpt, getMeta, loadDoc, getDateTime } from '~/utils'
import { trackView } from '~/use/tracking'

export default {
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
    return getMeta('posts', this.doc)
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
