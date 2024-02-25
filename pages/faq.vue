<template>
  <div class="p-4">
    <div>
      <h1 class="text-2xl font-bold">
        {{ $t('mainfaqs._head.header') }}
      </h1>
      <div class="text-sm">
        {{ $t('mainfaqs._head.subheader') }}
      </div>
    </div>

    <TFaqCalendars
      v-for="section of Object.keys($t('mainfaqs._titles'))"
      :key="section"
      class="my-4"
      :title="$t(`mainfaqs._titles.${section}`)"
      :faqs="$t(`mainfaqs.${section}`)"
    />
  </div>
</template>

<script>
export default {
  layout: 'full',
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
