<template>
  <div>RSVP</div>
</template>

<script>
import useRSVP from '~/use/rsvp'

export default {
  middleware: ['auth', 'account'],
  mounted() {
    const id = this.$route.params.id
    const rsvp = this.$route.query.rsvp
    const collection = this.$route.query.collection
    const back = this.$route.query.back

    this.updateRsvp(id, collection, rsvp)
    this.$router.replace(back)
  },
  setup() {
    const { updateRsvp } = useRSVP()

    return {
      updateRsvp
    }
  }
}
</script>
