<template>
  <div>
    <div>
      <div class="mx-auto max-w-4xl divide-y divide-gray-900/10">
        <h2 class="text-lg font-bold leading-10 tracking-tight text-gray-900">
          {{ title }}
        </h2>
        <dl class="space-y-2 divide-y divide-gray-900/10">
          <div v-for="faq in faqs" :key="faq.question" class="pt-2 px-2">
            <dt>
              <div
                class="flex w-full items-start justify-between text-left text-gray-900 cursor-pointer"
                @click="toggle(faq.question)"
              >
                <span class="text-sm font-semibold">{{ faq.question }}</span>
                <span class="ml-6 flex h-7 items-center">
                  <TIcon
                    v-if="!open[faq.question]"
                    name="plus"
                    class="h-6 w-6"
                    aria-hidden="true"
                  />
                  <TIcon
                    v-else
                    name="minus"
                    class="h-6 w-6"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </dt>
            <dd v-show="open[faq.question]" class="mt-2 pr-12 pb-2">
              <TPreview
                :content="faq.answer"
                no-typo
                class="text-gray-600 text-sm"
              />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { ref } from '@nuxtjs/composition-api'

export default {
  props: {
    title: {
      type: String,
      default: 'FAQs',
    },
    faqs: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const open = ref({})

    function toggle(question) {
      Vue.set(open.value, question, !open.value[question])
    }

    return {
      toggle,
      open,
    }
  },
}
</script>
