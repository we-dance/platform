<script>
export default {
  name: 'TResizable',
  mounted() {
    this.$nextTick(() => {
      this.$el.setAttribute('style', 'height', `${this.$el.scrollHeight}px`)
    })
  },
  methods: {
    resize(event) {
      event.target.style.height = 'auto'
      event.target.style.height = `${event.target.scrollHeight}px`
    },
  },
  render() {
    return this.$scopedSlots.default({
      resize: this.resize,
    })
  },
}
</script>
