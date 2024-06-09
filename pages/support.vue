<template>
  <div>
    <div class="px-4 my-4 grid grid-cols-1 gap-4">
      <LandingFeature
        title="Feedback & Support"
        description="Share your experiences, report bugs, or ask for help. Engage with our community, discuss new features, and influence future updates."
        button="Join Telegram Chat"
        href="https://t.me/+TFzrNPwFrsT0uPF0"
        alternative="Email Us"
        alternative-url="mailto:support@wedance.vip"
      />

      <TFaqCalendars
        v-for="section of Object.keys($t('mainfaqs._titles'))"
        :key="section"
        class="my-4"
        :title="$t(`mainfaqs._titles.${section}`)"
        :faqs="$t(`mainfaqs.${section}`)"
      />
    </div>

    <HubspotChat />
  </div>
</template>

<script>
export default {
  head() {
    const faqQuestions = Object.entries(this.$t('mainfaqs'))
      .filter(([key]) => !key.startsWith('_'))
      .flatMap(([section, questions]) =>
        questions.map((question) => ({
          '@type': 'Question',
          name: question.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: question.answer,
          },
        }))
      )

    return {
      title: this.$t('mainfaqs._head.title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('mainfaqs._head.description'),
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.$t('mainfaqs._head.keywords'),
        },
      ],
      script: [
        {
          type: 'application/ld+json',
          json: {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqQuestions,
          },
        },
      ],
    }
  },
}
</script>
