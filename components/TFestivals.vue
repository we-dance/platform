<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <div class="p-4">
      <h1 class="text-2xl font-bold">
        Dance Festivals Worldwide
      </h1>
      <TProfileStats :profile="profile" />
      <div class="text-sm">
        Dance Calendar for Travelers. Plan your holidays and weekends to dance
        Salsa, Bachata, Kizomba, Zouk and 130 other dances around the world.
      </div>
    </div>

    <TFestivalsCalendar class="mt-4 w-full border-t pt-4 pb-8" />

    <WTeaser
      v-if="profile.website"
      :allow-guests="false"
      :title="$t('teaser.chat.title')"
      :description="$t('teaser.chat.description')"
      :button="$t('teaser.chat.btnChatExists')"
      :href="profile.website"
      class="w-full mt-4"
    />

    <WTeaser
      v-if="!profile.website"
      :allow-guests="false"
      :title="$t('teaser.chat.title')"
      :description="$t('teaser.chat.description')"
      :button="$t('teaser.chat.btnChatMissing')"
      :href="internationalChatLink"
      class="w-full mt-4"
    />

    <div v-if="profile.instagram" class="bg-gray-100 py-4 flex justify-center">
      <div class="max-w-md py-4 space-y-1">
        <div class="flex justify-center"></div>
        <h3 class="text-2xl font-extrabold text-center">
          {{ $t('profile.follow.title') }}
        </h3>
        <p class="text-center">
          {{ $t('profile.follow.description') }}
        </p>
        <div class="p-4 flex flex-wrap gap-2 items-center justify-center">
          <TButton
            v-if="profile.youtube"
            allow-guests
            icon="youtube"
            type="round"
            icon-size="6"
            :href="profile.youtube"
          />
          <TButton
            v-if="profile.instagram"
            allow-guests
            icon="instagram"
            type="round"
            icon-size="6"
            :href="profile.instagram"
          />
          <TButton
            v-if="profile.telegram"
            allow-guests
            icon="telegram"
            type="round"
            icon-size="6"
            :href="profile.telegram"
          />
          <TButton
            v-if="profile.twitter"
            allow-guests
            icon="twitter"
            type="round"
            icon-size="6"
            :href="profile.twitter"
          />
          <TButton
            v-if="profile.tiktok"
            allow-guests
            icon="tiktok"
            type="round"
            icon-size="6"
            :href="profile.tiktok"
          />
          <TButton
            v-if="profile.facebook"
            allow-guests
            icon="facebook"
            type="round"
            icon-size="6"
            :href="profile.facebook"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue-demi'
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { getExcerpt, getProfileMeta } from '~/utils'

export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  head() {
    return getProfileMeta(this.profile)
  },
  setup(props) {
    const internationalChatLink = 'https://t.me/+Vxw15sDG-dWpqHDj'
    const { uid, isAdmin, can } = useAuth()
    const { profileFields } = useProfiles()

    const subscribersCount = computed(() => {
      return props.profile?.watch?.usernames?.length || 0
    })

    return {
      internationalChatLink,
      uid,
      can,
      getExcerpt,
      profileFields,
      isAdmin,
      subscribersCount,
    }
  },
}
</script>
