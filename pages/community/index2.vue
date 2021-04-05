<template>
  <TList
    title="Community"
    add="Add Profile"
    add-url="/-/edit"
    collection="profiles"
    :filter-default="{ community: currentCity }"
    :filter-fields="profileFilters"
    :tabs="profileSorts"
    sort-by="-lastLoginAt"
    list-wrapper="mt-4 grid grid-cols-1 md:grid-cols-2 col-gap-2 row-gap-2"
  >
    <template v-slot:before>
      <WTeaser
        v-if="!uid"
        :title="$t('teaser.profile.title')"
        :description="$t('teaser.profile.description')"
        :button="$t('teaser.profile.btn')"
        url="/register"
      />

      <WTeaser
        v-if="uid && currentCity"
        :title="$t('teaser.chat.title')"
        :description="$t('teaser.chat.description')"
        :button="$t('teaser.chat.btn', { city: currentCity })"
        class="mb-4"
        @click="joinChat()"
      />
    </template>
    <template v-slot:item="{ item }">
      <router-link :to="`/${item.username}`" class="hover:opacity-75">
        <TSharePreviewPost
          :type="item.type"
          collection="profiles"
          :username="item.username"
          :description="getExcerpt(item.bio)"
          :color="item.partner === 'Yes' ? 'bg-green-400' : 'bg-red-400'"
          :photo="item.photo"
          :styles="item.styles"
          size="sm"
        />
        <!-- :extra="getDateTime(item.lastLoginAt)" -->
      </router-link>
    </template>
    <template v-slot:after="{ count }">
      <WTeaser
        v-if="uid && !count"
        :title="$t('teaser.involve.title')"
        :description="$t('teaser.involve.description')"
        :button="$t('teaser.involve.btn')"
        href="http://bit.ly/wedance-start"
        class="mt-4"
      />
    </template>
  </TList>
</template>

<script>
import { profileFilters, typeList, profileSorts } from '~/use/profiles'
import { useCities } from '~/use/cities'
import { useAuth } from '~/use/auth'
import { getExcerpt, openURL, getOptions, getDateTime } from '~/utils'

export default {
  name: 'ProfilesIndex',
  methods: {
    async joinChat() {
      await this.$fire.firestore.collection('city_chats').add({
        city: this.currentCity
      })

      this.$fire.analytics.logEvent('join_chat', {
        city: this.currentCity
      })

      if (this.city?.telegram) {
        openURL(this.city.telegram)
      } else {
        openURL('https://t.me/joinchat/Iqif2X0FCXCpqHDj')
      }
    }
  },
  setup() {
    const { uid } = useAuth()
    const { currentCity, city } = useCities()

    return {
      profileFilters,
      typeList,
      getExcerpt,
      currentCity,
      city,
      uid,
      profileSorts,
      getOptions,
      getDateTime
    }
  }
}
</script>
