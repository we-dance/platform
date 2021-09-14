<template>
  <a class="gumroad-button" :href="href" target="_blank">{{ label }}</a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: 'Register',
    },
  },
  mounted() {
    const script = document.createElement('script')
    script.setAttribute('src', 'https://gumroad.com/js/gumroad.js')
    script.async = true

    document.head.appendChild(script)
  },
}
</script>
