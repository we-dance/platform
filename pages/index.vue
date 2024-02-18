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
          description="Get insider tips on the best socials in any city."
          cta-label="Ask Locals"
          :cta-link="localePath('/explore')"
        />
        <LandingFeature
          image="/img/dance-partners.svg"
          title="Dance Partners"
          description="Find dance partners for your dance style and let them find you."
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
export default {
  head() {
    return {
      title: 'Travel. Meet. Dance.',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Discover dance events near you',
        },
      ],
    }
  },
}
</script>
