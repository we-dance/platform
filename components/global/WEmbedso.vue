<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'right'
    }
  },
  mounted() {
    window.EMBED_SO_CONFIG = {
      id: this.id,
      position: this.position
    }

    const script = document.createElement('script')
    script.setAttribute('src', 'https://embed.so/js/embed.js')
    script.async = true

    document.head.appendChild(script)
  }
}
</script>
