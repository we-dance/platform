<template>
  <a
    v-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :class="classes"
    v-on="$listeners"
  >
    <slot>
      <div class="flex items-center">
        <TIcon v-if="icon" :size="iconSize" :name="icon" />
        <span v-if="label" class="ml-1">{{ label }}</span>
      </div>
    </slot>
  </a>
  <router-link v-else-if="to" :class="classes" :to="to" v-on="$listeners">
    <slot>
      <div class="flex items-center">
        <TIcon v-if="icon" :size="iconSize" :name="icon" />
        <span v-if="label" class="ml-1">{{ label }}</span>
      </div>
    </slot>
  </router-link>
  <button v-else type="button" :class="classes" v-on="$listeners">
    <slot>
      <div class="flex items-center">
        <TIcon v-if="icon" :size="iconSize" :name="icon" />
        <span v-if="label" class="ml-1">{{ label }}</span>
      </div>
    </slot>
  </button>
</template>

<script>
import TIcon from '~/components/TIcon'

export default {
  components: {
    TIcon
  },
  props: {
    icon: {
      type: String,
      default: ''
    },
    iconSize: {
      type: String,
      default: '4'
    },
    to: {
      type: String,
      default: ''
    },
    href: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'simple'
    },
    label: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  },
  computed: {
    classes() {
      const map = {
        round:
          'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-4 border border-gray-400 rounded-full shadow',
        icon: 'rounded-full hover:text-primary p-2',
        simple:
          'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-full shadow',
        primary:
          'bg-primary no-underline text-white font-semibold py-2 px-4 rounded-full hover:text-white hover:bg-black shadow',
        success:
          'bg-green-500 no-underline text-white font-semibold py-2 px-4 rounded-full hover:text-white hover:bg-green-700 shadow',
        danger:
          'bg-red-500 no-underline text-white font-semibold py-2 px-4 rounded-full hover:text-white hover:bg-red-700 shadow',
        base:
          'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-4 border border-gray-400 rounded-full shadow',
        secondary:
          'bg-transparent text-primary font-semibold py-2 px-4 border border-primary rounded-full no-underline hover:bg-primary hover:text-white hover:border-transparent',
        link: 'underline font-semibold hover:no-underline',
        context:
          'text-left w-full px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white',
        nav:
          'w-full px-4 py-2 items-center flex rounded-full border hover:border-indigo-500 hover:text-indigo-500',
        'nav-admin':
          'w-full px-4 py-2 items-center text-gray-200 flex rounded-full border border-gray-200 hover:border-indigo-500 hover:text-indigo-500',
        void: ''
      }

      let classes =
        map[this.type] +
        'cursor-pointer outline-none focus:outline-none inline-block'

      if (this.color) {
        classes += ` text-${this.color} border-${this.color} hover:bg-${this.color} hover:text-white`
      }

      return classes
    }
  }
}
</script>
