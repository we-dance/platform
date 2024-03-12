<template>
  <div>
    <THeader show-logo class="md:hidden" />
    <div class="flex justify-center pt-4">
      <TIcon name="undraw_super_woman" />
    </div>
    <div class="p-4">
      <h1 class="text-3xl font-extrabold text-center">
        Promote & Earn
      </h1>
      <div class="text-center text-lg text-gray-700">
        If you're a dancer, influencer, or just love sharing your passion for
        dance, this is your chance to shine and earn.
      </div>
      <div class="flex justify-center py-4">
        <TButton type="primary" href="https://forms.gle/ynbu291s5w75rVQt7"
          >Join as Promoter</TButton
        >
      </div>
      <section class="mt-16 border-t border-primary">
        <h3 class="uppercase text-xs text-primary font-extrabold py-4">
          Referral Rewards
        </h3>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <ShareIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">
              Simple Sharing
            </div>
            <div class="text-sm text-gray-700 has-links">
              Utilize the "share" button on event pages to create a custom
              referral link.
            </div>
          </div>
        </div>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <ChartBarIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Track Success</div>
            <div class="text-sm text-gray-700 has-links">
              Keep an eye on how many people engage with your shared links.
            </div>
          </div>
        </div>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <CashIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Profit Per Ticket</div>
            <div class="text-sm text-gray-700 has-links">
              Earn a commission for each ticket sold through your referral,
              celebrating your contribution to the dance community.
            </div>
          </div>
        </div>
      </section>
      <section class="mt-16 border-t border-primary">
        <h3 class="uppercase text-xs text-primary font-extrabold py-4">
          Influencer Opportunities
        </h3>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <ChartPieIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Select Your Scene</div>
            <div class="text-sm text-gray-700">
              Browse through a variety of campaigns posted by organizers and
              pick ones that align with your style.
            </div>
          </div>
        </div>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <CalculatorIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Transparent Terms</div>
            <div class="text-sm text-gray-700">
              Understand each campaign's rules and rewards upfront.
            </div>
          </div>
        </div>

        <div class="flex gap-4 items-start mb-4">
          <div>
            <BeakerIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Creative Challenges</div>
            <div class="text-sm text-gray-700">
              Engage in unique and creative tasks set by organizers, showcase
              your influence, and earn rewards.
            </div>
          </div>
        </div>
      </section>
      <section class="mt-16">
        <div class="text-center text-lg text-gray-700">
          Become a WeDance Promoter and connect with a world of opportunities to
          celebrate and share the joy of dance, while earning for your passion
          and influence. Let's dance, promote, and prosper together!
        </div>
        <div class="flex justify-center py-4">
          <TButton type="primary" href="https://forms.gle/ynbu291s5w75rVQt7"
            >Join as Promoter</TButton
          >
        </div>
      </section>
    </div>
    <HubspotChat />
  </div>
</template>

<script>
import {
  ShareIcon,
  ChartBarIcon,
  CashIcon,
  BeakerIcon,
  CalculatorIcon,
  ChartPieIcon,
} from '@vue-hero-icons/outline'

export default {
  layout: 'full',
  components: {
    ShareIcon,
    ChartPieIcon,
    ChartBarIcon,
    CashIcon,
    CalculatorIcon,
    BeakerIcon,
  },
}
</script>

<style scoped>
.has-links a {
  @apply text-primary underline;
}

.has-links a:hover {
  @apply no-underline;
}
</style>
