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
          to="https://calendly.com/razbakov/grow-your-dance-school/"
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
    </div>
    <HubspotChat />
  </div>
</template>

<script>
export default {
  layout: 'full',
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
