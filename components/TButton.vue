<template>
  <button
    v-if="!allowGuests && !uid"
    type="button"
    :title="$t('TButton.title', { action: title })"
    :class="classes"
    @click="showAuthPopup = title"
  >
    <slot>
      <div class="flex items-center justify-center space-x-2">
        <TIcon v-if="icon" :size="iconSize" :name="icon" />
        <span v-if="label !== false">{{ label }}</span>
      </div>
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
      <div class="flex items-center justify-center space-x-2">
        <TIcon v-if="icon" :size="iconSize" :name="icon" />
        <span v-if="label !== false">{{ label }}</span>
      </div>
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
      <div class="flex items-center justify-center space-x-2">
        <TIcon v-if="icon" :size="iconSize" :name="icon" />
        <span v-if="label !== false">{{ label }}</span>
      </div>
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
      <div class="flex items-center justify-center space-x-2">
        <TIcon v-if="icon" :size="iconSize" :name="icon" />
        <span v-if="label !== false">{{ label }}</span>
      </div>
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
      const map = {
        round:
          'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-4 border border-gray-400 rounded-full shadow',
        icon: 'rounded-full hover:text-primary',
        simple:
          'inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        toggled:
          'inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        primary:
          'bg-primary no-underline text-white font-semibold py-2 px-4 rounded-full hover:text-white hover:bg-black shadow',
        success:
          'bg-green-500 no-underline text-white font-semibold py-2 px-4 rounded-full hover:text-white hover:bg-green-700 shadow',
        danger:
          'bg-red-500 no-underline text-white font-semibold py-2 px-4 rounded-full hover:text-white hover:bg-red-700 shadow',
        base:
          'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-full shadow',
        secondary:
          'bg-transparent text-primary font-semibold py-2 px-4 border border-primary rounded-full no-underline hover:bg-primary hover:text-white hover:border-transparent',
        link: 'underline font-semibold hover:no-underline',
        context:
          'text-left w-full px-4 py-2 hover:bg-indigo-500 hover:text-white',
        'context-active': 'text-left w-full px-4 py-2 bg-indigo-500 text-white',
        nav:
          'p-2 font-semibold items-center flex rounded-full hover:bg-red-100 hover:text-primary',
        void: '',
        xs:
          'inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
      }

      let classes =
        map[this.type] +
        ' cursor-pointer outline-none focus:outline-none inline-block'

      if (this.color) {
        classes += ` text-${this.color} border-${this.color} hover:bg-${this.color} hover:text-white`
      }

      return classes
    },
  },
  setup() {
    const { uid, showAuthPopup } = useAuth()

    return { uid, showAuthPopup }
  },
}
</script>
