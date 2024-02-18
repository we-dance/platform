<template>
  <div class="font-noto bg-white min-h-screen">
    <THeader show-logo class="md:hidden" />
    <main>
      <LandingHero />
      <div class="px-4 mt-4 grid grid-cols-1 gap-4">
        <LandingFeature
          image="/img/event-calendar.svg"
          title="Socials, Classes, Festivals"
          description="Say goodbye to chaotic chats!"
          cta-label="Explore Events"
          :cta-link="localePath('/explore')"
        />
        <LandingFeature
          image="/img/dance-travel.svg"
          title="Recommendations"
          description="Wondering where to find the best socials in a new city?"
          cta-label="Ask Locals"
          :cta-link="localePath('/explore')"
        />
        <LandingFeature
          image="/img/dance-partners.svg"
          title="Dance Partners"
          :description="$t('features.dancePartners.description')"
          cta-label="Find Partner"
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
export default {}
</script>
