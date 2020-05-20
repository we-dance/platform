import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useRouter from '~/use/router'
import useCollection from '~/use/collection'

export default () => {
  const { uid, account, confirmedAccount } = useAuth()
  const { router, route } = useRouter()

  const { docs, loading } = useCollection('participants')
  const { update, create } = useDoc('participants')

  const getRsvp = (eventId) =>
    docs.value.find(
      (item) => item.eventId === eventId && item.uid === uid.value
    )

  const getRsvpResponse = (eventId) =>
    (uid.value && getRsvp(eventId)?.rsvp) ?? null

  const getFeedback = (eventId) =>
    (uid.value && getRsvp(eventId)?.feedback) ?? null

  function getList(eventId, rsvp) {
    return docs.value
      .filter((item) => item.eventId === eventId && item.rsvp === rsvp)
      .map((item) => item.participant)
  }

  function getListRsvps(eventId, rsvp = 'yes') {
    return docs.value.filter(
      (item) => item.eventId === eventId && item.rsvp === rsvp
    )
  }

  const getEvents = (userId, collection, rsvp = 'yes') => {
    if (collection === 'meetups') {
      return docs.value
        .filter(
          (item) =>
            item.uid === userId &&
            ((item.event && item.event.date) ||
              item.collection === collection) &&
            item.rsvp === rsvp
        )
        .map((item) => item.eventId)
    }

    return docs.value
      .filter(
        (item) =>
          item.uid === userId &&
          item.collection === collection &&
          item.rsvp === rsvp
      )
      .map((item) => item.eventId)
  }

  const getCount = (eventId, rsvp) => getList(eventId, rsvp).length

  async function updateRsvp(eventId, collection, rsvp, extra) {
    if (!confirmedAccount.value) {
      router.push(
        `/rsvp/${eventId}/?rsvp=${rsvp}&back=${route.fullPath}&collection=${collection}`
      )

      return
    }

    let rsvpObject = getRsvp(eventId)

    if (!rsvpObject) {
      rsvpObject = {
        uid: uid.value
      }
    }

    rsvpObject = {
      ...rsvpObject,
      participant: account.value,
      rsvp,
      eventId,
      collection,
      ...extra
    }

    if (rsvpObject.id) {
      await update(rsvpObject.id, rsvpObject)
    } else {
      await create(rsvpObject)
    }
  }

  return {
    getRsvp,
    getRsvpResponse,
    updateRsvp,
    getCount,
    getList,
    getEvents,
    getFeedback,
    getListRsvps,
    loading
  }
}
