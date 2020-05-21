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
      <div class="flex">
        <TIcon v-if="icon" :name="icon" />
        <span v-if="label" class="ml-1">{{ label }}</span>
      </div>
    </slot>
  </a>
  <router-link v-else-if="to" :class="classes" :to="to" v-on="$listeners">
    <slot>
      <div class="flex">
        <TIcon v-if="icon" :name="icon" />
        <span v-if="label" class="ml-1">{{ label }}</span>
      </div>
    </slot>
  </router-link>
  <button v-else type="button" :class="classes" v-on="$listeners">
    <slot>
      <div class="flex">
        <TIcon v-if="icon" :name="icon" />
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
        simple:
          'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow',
        primary:
          'bg-blue-500 no-underline text-white font-semibold py-2 px-4 rounded hover:text-white hover:bg-black shadow',
        danger:
          'bg-red-500 no-underline text-white font-semibold py-2 px-4 rounded hover:text-white hover:bg-red-700 shadow',
        base:
          'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-4 border border-gray-400 rounded shadow',
        secondary:
          'bg-transparent text-blue-500 font-semibold py-2 px-4 border border-blue-500 rounded no-underline hover:bg-blue-500 hover:text-white hover:border-transparent',
        link: 'underline font-semibold py-2 px-4 hover:no-underline',
        nav:
          'block text-left w-full px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white',
        icon: ''
      }

      let classes = 'cursor-pointer outline-none focus:outline-none'

      if (!this.icon) {
        classes = map[this.type] + ' inline-block text-center'
      }

      if (this.color) {
        classes += ` text-${this.color} border-${this.color} hover:bg-${this.color} hover:text-white`
      }

      return classes
    }
  }
}
</script>
