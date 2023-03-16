<template>
  <button
    v-if="!allowGuests && !uid"
    type="button"
    :title="$t('TButton.title', { action: title })"
    :class="classes"
    @click="showAuthPopup = title"
  >
    <slot>
      <TIcon v-if="icon" :size="iconSize" :name="icon" />
      <span v-if="label !== false">{{ label }}</span>
    </slot>
  </button>
  <a
    v-else-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :class="classes"
    :title="title"
    v-on="$listeners"
  >
    <slot>
      <TIcon v-if="icon" :size="iconSize" :name="icon" />
      <span v-if="label !== false">{{ label }}</span>
    </slot>
  </a>
  <NuxtLink
    v-else-if="to"
    :title="title"
    :class="classes"
    :to="to"
    v-on="$listeners"
  >
    <slot>
      <TIcon v-if="icon" :size="iconSize" :name="icon" />
      <span v-if="label !== false">{{ label }}</span>
    </slot>
  </NuxtLink>
  <button
    v-else
    type="button"
    :title="title"
    :class="classes"
    v-on="$listeners"
  >
    <slot>
      <TIcon v-if="icon" :size="iconSize" :name="icon" />
      <span v-if="label !== false">{{ label }}</span>
    </slot>
  </button>
</template>

<script>
import TIcon from '~/components/TIcon'
import { useAuth } from '~/use/auth'

export default {
  components: {
    TIcon,
  },
  props: {
    allowGuests: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'continue',
    },
    icon: {
      type: String,
      default: '',
    },
    iconSize: {
      type: String,
      default: '4',
    },
    to: {
      type: [String, Object],
      default: '',
    },
    href: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'simple',
    },
    label: {
      type: [String, Number, Boolean],
      default: false,
    },
    color: {
      type: String,
      default: '',
    },
  },
  computed: {
    classes() {
      const xbase =
        'flex justify-start items-center py-2 px-4 font-medium space-x-2 cursor-pointer outline-none focus:outline-none focus:ring-2 focus:ring-offset-2'

      const xrounded =
        xbase + ' text-sm leading-4 justify-center shadow rounded-full'

      const primaryColor =
        ' bg-dark text-white border-gray-900 hover:bg-gray-800'
      const successColor =
        ' bg-green-500 text-white border-green-500 hover:bg-green-800'
      const dangerColor =
        ' bg-red-500 text-white border-red-500 hover:bg-red-800'
      const baseColor =
        ' bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
      const toggledColor =
        ' text-primary border-primary bg-red-100 hover:bg-red-200'

      const map = {
        round: xrounded + baseColor,
        simple: xrounded + baseColor,
        base: xrounded + baseColor,
        secondary: xrounded + baseColor,
        xs: xrounded + baseColor,
        icon: 'rounded-full hover:text-primary',
        toggled: xrounded + toggledColor,
        primary: xrounded + primaryColor,
        success: xrounded + successColor,
        danger: xrounded + dangerColor,
        link: 'underline hover:no-underline font-semibold',
        context: xbase + ' w-full hover:bg-indigo-500 hover:text-white',
        'context-active': xbase + 'w-full bg-indigo-500 text-white',
        nav: xbase + ' rounded-full hover:bg-red-100 hover:text-primary',
        void: xbase,
      }

      return map[this.type]
    },
  },
  setup() {
    const { uid, showAuthPopup } = useAuth()

    return { uid, showAuthPopup }
  },
}
</script>
