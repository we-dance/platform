<template>
  <div>
    <THeader>
      <TButton
        slot="left"
        allow-guests
        :to="localePath('/cities')"
        icon="place"
        :label="profile.name"
      />

      <TButton
        allow-guests
        type="nav"
        icon="search"
        :to="localePath('/search')"
      />
      <TDropdown>
        <TPopupEdit
          v-if="isAdmin()"
          type="context"
          :fields="profileFields"
          :label="$t('Edit')"
          collection="profiles"
          singular="profile"
          :item="profile"
        />
        <TCardActions
          :id="profile.id"
          collection="profiles"
          :item="profile"
          type="context"
        />
        <TButtonShare
          :id="profile.id"
          collection="profiles"
          :place="profile.place"
          :file="profile.socialCover"
          :file-name="profile.username"
          :url="`https://wedance.vip/${profile.username}`"
          :text="profile.name"
          type="context"
          :label="$t('share.title')"
        />
        <TButton
          v-if="isAdmin()"
          type="context"
          icon="delete"
          :label="$t('Delete')"
          @click="remove(profile.id)"
        />
        <TButton
          v-if="isAdmin()"
          type="context"
          icon="upload"
          label="Instagram"
          @click="softUpdate(profile.id, { import: 'requested' })"
        />
      </TDropdown>
    </THeader>

    <div class="p-2 border-b text-center">
      <a
        href="https://bit.ly/49cYPoB"
        target="_blank"
        class="underline text-primary hover:no-underline"
        >Become a Dance Promoter – Get Discounts!</a
      >
    </div>

    <div class="grid grid-cols-4 gap-4 p-4">
      <div>
        <img
          v-if="profile.photo"
          :src="profile.photo"
          :alt="profile.username"
          class="w-full rounded-full"
        />
      </div>

      <div class="col-span-3">
        <h1 class="leading-tight font-bold">{{ profile.name }}</h1>
        <TExpand class="text-sm mb-4">
          <TPreview :content="profile.bio" />
        </TExpand>

        <div class="text-xs text-gray-500">
          {{ $tc('views', profile.viewsCount, { count: profile.viewsCount }) }}
          ·
          {{
            $tc('subscribers', subscribersCount, {
              count: subscribersCount,
            })
          }}
        </div>

        <div class="flex space-x-2 mt-4">
          <TButton
            :to="localePath('/events/-/import')"
            type="primary"
            icon="plus"
            label="Add Event"
          />
          <TReaction
            :label="$t('Subscribe')"
            :toggled-label="$t('Unsubscribe')"
            field="watch"
            icon="BellIcon"
            hide-count
            :item="profile"
            collection="profiles"
          />
        </div>
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
