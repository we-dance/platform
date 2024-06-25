<template>
  <div>
    <div class="flex justify-center pt-4">
      <TIcon name="undraw_online_ad" />
    </div>
    <div class="p-4">
      <h1 class="text-3xl font-extrabold text-center">
        Grow Your Dance Business
      </h1>
      <div class="text-center text-lg text-gray-700">
        Enhance your online visibility and attract more students with our
        tailored consultation services and comprehensive video content.
      </div>
      <div class="flex flex-col sm:flex-row justify-center py-4 gap-4">
        <TButton
          type="primary"
          href="https://calendly.com/razbakov/grow-your-dance-school/"
          >Schedule Free Call</TButton
        >
        <TButton type="tertiery" to="/organize">Boost Your Event</TButton>
      </div>
      <section class="mt-16 border-t border-primary">
        <h3 class="uppercase text-xs text-primary font-extrabold py-4">
          Get Your Free Consultation Call
        </h3>
        <div class="text-lg text-gray-700">
          Follow these simple steps to receive a personalized consultation:
          <ul class="list-decimal ml-6 mt-2 typo">
            <li>
              <strong
                >Sign Up on <router-link to="/">WeDance</router-link>:</strong
              >
              Join our vibrant community by creating your profile on WeDance.
              Connect with other dance enthusiasts and stay updated with the
              latest events and tips.
            </li>
            <li>
              <strong
                >Fill Out Our
                <a target="_blank" href="https://forms.gle/UkYNb8eNizZ8KCQc9"
                  >Survey</a
                >:</strong
              >
              Help us understand your needs better by completing a short survey.
              This will allow us to tailor our consultation to your specific
              goals and challenges.
            </li>
            <li>
              <strong
                >Schedule Your
                <a
                  target="_blank"
                  href="https://calendly.com/razbakov/grow-your-dance-school/"
                  >Call</a
                >:</strong
              >
              Book your free consultation call through Calendly. Choose a time
              that works best for you, and get ready to elevate your dance
              school's online presence.
            </li>
          </ul>
        </div>
      </section>
      <section class="mt-16 border-t border-primary">
        <h3 class="uppercase text-xs text-primary font-extrabold py-4">
          Personalized SEO Consultation
        </h3>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <SearchCircleIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">
              Unlock SEO Secrets
            </div>
            <div class="text-sm text-gray-700 typo">
              <p>
                Improve your search engine ranking with one-on-one
                consultations. Our experts analyze your current strategy and
                provide actionable insights to boost your online presence.
              </p>
              <p>
                Want to see the magic in action? Experience a detailed,
                user-friendly audit by our Custom Chat-GPT service
                <a
                  target="_blank"
                  href="https://chatgpt.com/g/g-G5npqOMZ7-dance-website-auditor"
                  >Dance Website Auditor</a
                >.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="mt-16 border-t border-primary">
        <h3 class="uppercase text-xs text-primary font-extrabold py-4">
          Exclusive Video Content
        </h3>
        <div class="flex gap-4 items-start mb-4">
          <div>
            <GiftIcon class="mt-1 text-primary w-6" />
          </div>
          <div>
            <div class="text-lg font-bold">Engaging and Educational Videos</div>
            <div class="text-sm text-gray-700 typo">
              Subscribe to our
              <a
                target="_blank"
                href="https://www.youtube.com/channel/UC2mobjHVt1AxUDTTh9f3iMg"
                >YouTube channel</a
              >
              for essential strategies, practical advice, and reviews of top
              marketing tools. Learn key techniques to dominate online search
              and enhance your marketing efforts.
            </div>
          </div>
        </div>
      </section>
      <section class="mt-16">
        <div class="text-center text-lg text-gray-700">
          Ready to elevate your dance school? Join our community of successful
          dance school owners. Get started with a consultation today.
        </div>
        <div class="flex justify-center py-4">
          <TButton
            type="primary"
            to="https://calendly.com/razbakov/grow-your-dance-school/"
            >Schedule Free Call</TButton
          >
        </div>
      </section>
    </div>
    <HubspotChat />
  </div>
</template>

<script>
import { SearchCircleIcon, GiftIcon } from '@vue-hero-icons/outline'

export default {
  layout: 'full',
  components: {
    SearchCircleIcon,
    GiftIcon,
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
