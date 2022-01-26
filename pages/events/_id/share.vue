<template>
  <TSharePreview
    :type="event.type"
    collection="events"
    :claimed="event.claimed"
    :username="
      (event.claimed === 'Yes' ? event.organiser : event.promoter) ||
        author.username
    "
    :title="event.name"
    :description="eventDate"
    :photo="event.cover"
    :styles="event.styles"
  />
</template>

<script>
import { getDay, getDate, getTime } from '~/utils'
import { addressPart } from '~/use/google'

export default {
  layout: 'empty',
  async asyncData({ app, params, error }) {
    const ref = await app.$fire.firestore
      .collection('posts')
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

      result += getTime(this.event.endDate)

      return result
    },
  },
}
</script>
