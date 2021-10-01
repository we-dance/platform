<template>
  <TSharePreview
    :type="event.type"
    collection="events"
    :username="author.username"
    :price="event.locality"
    :title="event.name"
    :description="eventDate"
    :photo="event.cover"
    :styles="event.styles"
  />
</template>

<script>
import { getDay, getDate, getTime, getTimeZone } from '~/utils'
import { addressPart } from '~/use/google'

export default {
  layout: 'empty',
  async asyncData({ app, params, error }) {
    const ref = await app.$fire.firestore
      .collection('events')
      .doc(params.id)
      .get()

    if (!ref.exists) {
      error({ statusCode: 404 })
      return
    }

    const event = ref.data()
    event.locality = addressPart(event.venue, 'locality')

    const authorRef = await app.$fire.firestore
      .collection('profiles')
      .doc(event.createdBy)
      .get()

    const author = authorRef.data()

    return {
      event,
      author,
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

      result += getTime(this.event.endDate) + ' '

      result += getTimeZone(this.event.startDate)

      return result
    },
  },
}
</script>
