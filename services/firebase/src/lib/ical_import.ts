import axios from 'axios'
import * as ical from 'ical'
import { DocumentSnapshot } from 'firebase-functions/v1/firestore'
import { getSuggestedStyles, getSuggestedType } from './linguist'
import { firestore } from '../firebase'

export async function syncCalendar(calendarRef: DocumentSnapshot) {
    const calendar = calendarRef.data() as any
      const calendarId = calendarRef.id
      const res = await axios(calendar.url)
      const ics = ical.parseICS(res.data)
      const lastSyncedAt = +new Date()

      const events = []
      for (const id in ics) {
        const vevent = ics[id]

        const styles = getSuggestedStyles(vevent.summary + ' ' + vevent.description)

        let approved = false
        let eventType = ''
        if (Object.keys(styles).length) {
          eventType = getSuggestedType(vevent.summary + ' ' + vevent.description)
          approved = true
        }

        const facebookId = vevent.uid?.split('@')[0].replace('e', '')

        const event: any = {
          facebookId,
          provider: `ical`,
          createdAt: lastSyncedAt,
          updatedAt: lastSyncedAt,
          importedAt: lastSyncedAt,
          providerId: calendarId,
          name: vevent.summary,
          description: vevent.description,
          providerCreatedAt: vevent.created,
          providerUpdatedAt: vevent.lastmodified,
          startDate: vevent.start,
          endDate: vevent.end,
          facebook: vevent.url,
          location: vevent.location,
          styles,
          eventType,
          approved,
          type: 'import_event',
          username: calendar.username,
          createdBy: calendar.userId
        }

        if (approved) {
          const existingEvents = await firestore.collection('posts').where('facebookId', '==', facebookId).get()
          if (!existingEvents.docs.length) {
            const newDocRef = await firestore.collection('posts').add(event)
            event.eventId = newDocRef.id
          } else {
            event.eventId = existingEvents.docs[0].id
          }
        }

        events.push(event)
      }

      const name = res.data.split('X-WR-CALNAME:')[1].split('\n')[0]
      const lastCount = events.length
      const state = 'processed'

      calendarRef.ref.update({ name, state, lastSyncedAt, events, lastCount })
}