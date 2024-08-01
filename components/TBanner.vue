<template>
  <div v-if="value"></div>
  <div v-else class="bg-light">
    <div
      ref="target"
      class="mx-auto max-w-2xl text-sm py-3 px-3 sm:px-6 lg:px-8"
    >
      <div class="flex items-center justify-between flex-wrap">
        <div class="w-0 flex-1 flex items-center">
          <span class="flex p-2 rounded-lg bg-light">
            <!-- Heroicon name: outline/speakerphone -->
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          </span>
          <p class="ml-3 font-medium truncate">
            <span class="md:hidden">
              {{ mobile }}
            </span>
            <span class="hidden md:inline">
              {{ desktop }}
            </span>
          </p>
        </div>
        <div
          class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto"
        >
          <TButton
            :href="link"
            :to="to"
            allow-guests
            type="primary"
            :label="action"
            @click="
              $track('banner_yes', { banner: name })
              $emit('input', 'yes')
            "
          />
        </div>
        <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
          <button
            type="button"
            class="-mr-1 flex p-2 rounded-md sm:-mr-2"
            @click="
              $track('banner_no', { banner: name })
              $emit('input', 'no')
            "
          >
            <span class="sr-only">Dismiss</span>
            <!-- Heroicon name: outline/x -->
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from '@nuxtjs/composition-api'
import { useElementVisibility } from '@vueuse/core'

export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    desktop: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    to: {
      type: String,
      default: '',
    },
  },
  setup(props, { root, emit }) {
    const target = ref(null)
    const targetIsVisible = useElementVisibility(target)

    watch(targetIsVisible, (isVisible) => {
      if (isVisible) {
        emit('visible', isVisible)
        root.$track('banner_shown', { name: props.name })
      }
    })

    return {
      target,
      targetIsVisible,
    }
  },
}
</script>
