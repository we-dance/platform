import axios from 'axios'
import * as ical from 'ical'
import { DocumentSnapshot } from 'firebase-functions/v1/firestore'
import {
  getSuggestedStyles,
  getSuggestedType,
  getUrlsFromText,
  isFacebookEvent,
} from './linguist'
import { firestore } from '../firebase'

function getUrlParam(url: string, param: string) {
  const match = RegExp('[?&]' + param + '=([^&]*)').exec(url)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

function getUrlContentId(url?: string): string {
  if (!url) {
    throw new Error('getUrlContentId: no url')
  }

  const result = url
    .replace(/(\?.*)/, '')
    .replace(/\/$/, '')
    .split('/')
    .pop()

  if (!result) {
    throw new Error('Invalid url')
  }

  return result
}

export async function syncDanceEventsInfo() {
  const url = 'https://www.dance-events.info/api/v1/events.json?token=1'

  let res
  try {
    res = await axios(url)
  } catch (e) {}

  if (res?.status !== 200) {
    return
  }

  const now = +new Date()
  let events = res.data.events
  console.log(events.length, 'Total events')
  events = events.filter((e: any) => +new Date(e.startDate) > now)
  console.log(events.length, 'Future events')
  events = events.filter((e: any) => !e.url?.includes('wedance.vip'))
  console.log(events.length, 'New events')
  events = events.filter((e: any) => !!e.url)
  console.log(events.length, 'With urls')
  events = events.filter((e: any) => !!e.image)
  console.log(events.length, 'With images')

  console.log(events.map((e: any) => e.url))
}

export async function syncCalendar(calendarRef: DocumentSnapshot) {
  const calendar = calendarRef.data() as any
  const calendarId = calendarRef.id
  let url = calendar.url
  let pastCount = 0
  let newCount = 0
  let totalCount = 0
  let approvedCount = 0

  if (url.includes('calendar.google.com/calendar/u/0/embed')) {
    const icalId = getUrlParam(url, 'src')
    url = `https://calendar.google.com/calendar/ical/${icalId}/public/basic.ics`
  }

  if (url.includes('https://teamup.com/')) {
    const icalId = getUrlContentId(url)
    url = `https://ics.teamup.com/feed/${icalId}/0.ics`
  }

  let res
  try {
    res = await axios(url)
  } catch (e) {}

  const name = res?.data?.split('X-WR-CALNAME:')[1]?.split('\n')[0] || ''
  const ics = ical.parseICS(res?.data || '')
  const now = +new Date()

  if (res?.status !== 200 || !name) {
    const state = 'failed'
    await calendarRef.ref.update({ state, lastSyncedAt: now, url })
    return
  }

  const events: any[] = []
  for (const id in ics) {
    const vevent = ics[id]

    if (!vevent.uid) {
      continue
    }

    totalCount++

    const startDate = vevent.start ? +vevent.start : 0

    if (startDate < now) {
      pastCount++
      continue
    }

    const styles = getSuggestedStyles(vevent.summary + ' ' + vevent.description)

    let approved = false
    let eventType = ''
    if (Object.keys(styles).length) {
      eventType = getSuggestedType(vevent.summary + ' ' + vevent.description)
      approved = true
      approvedCount++
    }

    let facebookId = ''

    if (vevent.uid?.includes('@facebook.com')) {
      facebookId = vevent.uid?.split('@')[0].replace('e', '') || ''
    }

    if (!calendar?.events?.find((e: any) => e.providerItemId === vevent.uid)) {
      newCount++
    }

    const facebookUrl = getUrlsFromText(vevent.description || '').find((u) =>
      isFacebookEvent(u)
    )

    if (facebookUrl) {
      facebookId = getUrlContentId(facebookUrl)
    }

    const event: any = {
      facebookId,
      provider: `ical`,
      createdAt: now,
      updatedAt: now,
      importedAt: now,
      providerId: calendarId,
      providerItemId: vevent.uid,
      name: vevent.summary,
      description: vevent.description || '',
      providerCreatedAt: vevent.created,
      providerUpdatedAt: vevent.lastmodified || '',
      startDate: vevent.start,
      endDate: vevent.end || '',
      facebook: vevent.url || facebookUrl || '',
      location: vevent.location || '',
      styles,
      eventType,
      approved,
      type: 'import_event',
      username: calendar.username,
      createdBy: calendar.userId,
    }

    if (facebookId) {
      const existingEvents = await firestore
        .collection('posts')
        .where('facebookId', '==', facebookId)
        .get()
      if (!existingEvents.docs.length) {
        const newDocRef = await firestore.collection('posts').add(event)
        event.eventId = newDocRef.id
      } else {
        event.eventId = existingEvents.docs[0].id
      }
    }

    events.push(event)
  }

  const upcomingCount = events.length
  const state = 'processed'

  await calendarRef.ref.update({
    name,
    state,
    lastSyncedAt: now,
    events,
    upcomingCount,
    approvedCount,
    newCount,
    pastCount,
    totalCount,
    url,
  })
}
