<template>
  <div class="font-noto bg-white min-h-screen">
    <main>
      <LandingHero
        :header="$t('home.hero.header')"
        :subheader="$t('home.hero.subheader')"
      >
        <TButton
          allow-guests
          :label="$t('home.hero.action')"
          :to="localePath('/explore')"
          type="void"
          class="mt-8 w-full text-gray-900 bg-white hover:bg-gray-100 font-semibold py-2 px-4 border border-gray-200 rounded-full shadow"
          ><TIcon name="place" class="w-4 h-4 text-primary"
        /></TButton>
        <TPreview
          :content="$t('home.hero.bottom')"
          no-typo
          class="mt-2 text-xs text-center mx-4"
        />
      </LandingHero>
      <div class="px-4 mt-4 grid grid-cols-1 gap-4">
        <div class="flex justify-center">
          <a
            href="https://www.producthunt.com/posts/wedance?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-wedance"
            target="_blank"
            ><img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=445120&theme=light"
              alt="WeDance - Travel&#0046;&#0032;Meet&#0046;&#0032;Dance&#0032;–&#0032;Your&#0032;Global&#0032;Dance&#0032;Event&#0032;Hub&#0033; | Product Hunt"
              style="width: 250px; height: 54px;"
              width="250"
              height="54"
          /></a>
        </div>
        <LandingFeature
          image="/img/dance-travel.svg"
          :title="$t('home.features.travel.title')"
          :description="$t('home.features.travel.description')"
          :cta-label="$t('home.features.travel.action')"
          :cta-link="localePath('/where-can-i-dance')"
        />
        <LandingFeature
          image="/img/event-calendar.svg"
          :title="$t('home.features.explore.title')"
          :description="$t('home.features.explore.description')"
          :cta-label="$t('home.features.explore.action')"
          :cta-link="localePath('/explore/global')"
        />
        <LandingFeature
          v-if="featureFindPartner"
          image="/img/dance-partners.svg"
          :title="$t('home.features.partner.title')"
          :description="$t('home.features.partner.description')"
          :cta-label="$t('home.features.partner.action')"
          :cta-link="localePath('/find-partner/start')"
        />
      </div>
      <LandingNumbersLive class="mt-8" />
      <LandingWhyWeDance class="mt-8" />
      <FollowUs
        :title="$t('profile.follow.title')"
        :description="$t('landing.follow.description')"
        :profile="socialMedia"
        class="p-4"
      />
    </main>
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'

export default {
  head() {
    return {
      title: this.$t('home.title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('home.hero.subheader'),
        },
      ],
    }
  },
  setup() {
    const { featureFindPartner } = useAuth()

    const socialMedia = {
      youtube: 'https://www.youtube.com/@wedancestory',
      instagram: 'https://instagram.com/WeDancePlatform',
      telegram: 'https://t.me/WeDancePlatform',
      twitter: 'https://twitter.com/WeDancePlatform',
      facebook: 'https://www.facebook.com/WeDance-109777921433083',
      spotify:
        'https://open.spotify.com/show/7pSbE0qiPpnJ1v0GmnSSkn?si=351061249dd14cb3',
      threads: 'https://threads.net/@WeDancePlatform',
    }

    return { featureFindPartner, socialMedia }
  },
}
</script>
