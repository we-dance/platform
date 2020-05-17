<template>
  <a
    v-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :class="classes"
    v-on="$listeners"
  >
    <slot />
  </a>
  <router-link v-else-if="to" :class="classes" :to="to" v-on="$listeners">
    <slot />
  </router-link>
  <button v-else type="button" :class="classes" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
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
          'bg-blue-500 no-underline text-white font-semibold py-2 px-4 rounded hover:text-white hover:bg-black',
        base:
          'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-4 border border-gray-400 rounded shadow',
        secondary:
          'bg-transparent text-blue-500 font-semibold py-2 px-4 border border-blue-500 rounded no-underline hover:bg-blue-500 hover:text-white hover:border-transparent',
        link: 'underline font-semibold py-2 px-4 hover:no-underline',
        nav: 'w-full text-left block font-semibold py-2 px-4 hover:bg-black'
      }

      let classes =
        map[this.type] + ' outline-none focus:outline-none cursor-pointer'

      if (this.color) {
        classes += ` text-${this.color} border-${this.color} hover:bg-${this.color} hover:text-white`
      }

      return classes
    }
  }
}
</script>
