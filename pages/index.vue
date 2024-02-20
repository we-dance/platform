<template>
  <div class="font-noto bg-white min-h-screen">
    <THeader show-logo class="md:hidden" />
    <main>
      <LandingHero
        :header="$t('home.hero.header')"
        :subheader="$t('home.hero.subheader')"
        :cta-label="$t('home.hero.action')"
        :cta-link="localePath('/explore')"
      >
        <TPreview
          :content="$t('home.hero.bottom')"
          no-typo
          class="mt-2 text-xs text-center mx-4"
        />
      </LandingHero>
      <div class="px-4 mt-4 grid grid-cols-1 gap-4">
        <LandingFeature
          image="/img/event-calendar.svg"
          :title="$t('home.features.explore.title')"
          :description="$t('home.features.explore.description')"
          :cta-label="$t('home.features.explore.action')"
          :cta-link="localePath('/explore')"
        />
        <LandingFeature
          image="/img/dance-travel.svg"
          :title="$t('home.features.travel.title')"
          :description="$t('home.features.travel.description')"
          :cta-label="$t('home.features.travel.action')"
          :cta-link="localePath('/explore')"
        />
        <LandingFeature
          image="/img/dance-partners.svg"
          :title="$t('home.features.partner.title')"
          :description="$t('home.features.partner.description')"
          :cta-label="$t('home.features.partner.action')"
          :cta-link="localePath('/find-partner/start')"
        />
      </div>
      <LandingNumbers class="mt-8" />
      <LandingWhyWeDance class="mt-8" />
      <LandingFollowUs />
    </main>
  </div>
</template>

<script>
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
}
</script>
