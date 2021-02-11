<template>
  <TSharePreview
    :type="event.type"
    :username="event.organiser"
    :price="event.price"
    :title="event.name"
    :description="eventDate"
    :photo="event.cover"
    :styles="event.styles"
  />
</template>

<script>
import { getDay, getDate, getTime } from '~/utils'

export default {
  layout: 'empty',
  async asyncData({ app, params, error }) {
    const ref = await app.$fire.firestore
      .collection('events')
      .doc(params.id)
      .get()

    if (!ref.exists) {
      error({ statusCode: 404 })
    }

    const event = ref.data()

    return {
      event
    }
  },
  computed: {
    eventDate() {
      let result =
        getDay(this.event.startDate) +
        ', ' +
        getDate(this.event.startDate) +
        ' ' +
        getTime(this.event.startDate) +
        ' – '

      if (getDate(this.event.startDate) !== getDate(this.event.endDate)) {
        result += getDate(this.event.endDate) + ' '
      }

      result += getTime(this.event.endDate)

      return result
    }
  }
}
</script>
