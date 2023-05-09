const { createSSRApp } = require('vue')
const { renderToString } = require('vue/server-renderer')
import mjml2html = require('mjml')
import * as fs from 'fs'
import * as moment from 'moment'
import { firestore } from '../firebase'
import sendEmail from './sendEmail'

export async function renderEmail(type: string, data: any, customUtms = {}) {
  const template = fs.readFileSync(`./src/templates/${type}.mjml`, 'utf8')

  const defaultUtms = {
    campaign: type,
    medium: 'email',
    source: 'newsletter',
  }

  const utm = {
    ...defaultUtms,
    ...customUtms,
  }

  const app = createSSRApp({
    data: () => {
      return data
    },
    template,
    methods: {
      link(url: string, utmContent = '') {
        return (
          url +
          '?utm_campaign=' +
          utm.campaign +
          '&utm_medium=' +
          utm.medium +
          '&utm_source=' +
          utm.source +
          '&utm_content=' +
          utmContent
        )
      },
    },
  })

  app.config.compilerOptions.isCustomElement = (tag: any) =>
    tag.startsWith('mj')

  return mjml2html(await renderToString(app)).html
}

export async function getWeeklyData(city: string) {
  const time = new Date()
  const today = time.toISOString().slice(0, 10)
  time.setDate(time.getDate() + 7)
  const sevenDaysFromNow = time.toISOString().slice(0, 10)

  let cityProfile: any = {}

  const profileDocs = (
    await firestore
      .collection('profiles')
      .where('username', '==', city)
      .get()
  ).docs

  for (const doc of profileDocs) {
    cityProfile = { id: doc.id, ...doc.data() }
  }

  const eventDocs = (
    await firestore
      .collection('posts')
      .where('startDate', '>', today)
      .where('startDate', '<', sevenDaysFromNow)
      .where('place', '==', cityProfile.place)
      .get()
  ).docs

  const days: any = {}

  for (const doc of eventDocs) {
    const event = {
      id: doc.id,
      ...doc.data(),
    } as any

    const group = moment(event.startDate).format('YYYY-MM-DD')

    if (!days[group]) {
      days[group] = {
        day: moment(event.startDate).format('dddd'),
        date: moment(event.startDate).format('D MMM'),
        events: [],
      }
    }

    days[group].events.push({
      title: event.name,
      organizer: event.org.name,
      venue: event.venue?.name,
      format: event.eventType,
      time: moment(event.startDate).format('HH:mm'),
      link: `https://wedance.vip/events/${event.id}`,
      cover: event.cover,
      styles: Object.keys(event.styles),
    })
  }

  const events: any = {
    intro:
      'Hope you had a great weekend and are ready with your dancing shoes on for a fantastic week ahead.',
    title: `${city} Dance Calendar`,
    links: {
      telegram: cityProfile.telegram,
      instagram: cityProfile.instagram,
      facebook: cityProfile.facebook,
      addEvent: 'https://wedance.vip/events/-/edit',
      city: `https://wedance.vip/${city}`,
    },
    days,
  }

  return events
}

export async function getSubscribers(cityProfile: any) {
  const recipients = {} as any

  const subscribers = cityProfile.watch?.usernames || []

  for (let subscriber of subscribers) {
    const profilesOfSubscriber = (
      await firestore
        .collection('profiles')
        .where('username', '==', subscriber)
        .get()
    ).docs

    if (profilesOfSubscriber.length !== 1) {
      // console.log(`Subscriber ${subscriber} not found`)
      continue
    }

    const profileId = profilesOfSubscriber[0].id

    const accountDoc = await firestore
      .collection('accounts')
      .doc(profileId)
      .get()

    if (!accountDoc.exists) {
      // console.log(`Account for ${subscriber} not found`)
      continue
    }

    const account = accountDoc.data()

    recipients[profileId] = {
      name: account?.name,
      email: account?.email,
    }
  }

  return recipients
}

export async function scheduleWeeklyNewsletter() {
  const cityDocs = (
    await firestore
      .collection('profiles')
      .where('username', '==', 'Munich')
      .get()
  ).docs

  for (let cityDoc of cityDocs) {
    const cityProfile = cityDoc.data()

    if (!cityProfile.watch?.usernames) {
      continue
    }

    const weeklyEmailDetails = await getWeeklyData(cityProfile.username)
    const html = await renderEmail('weekly', weeklyEmailDetails)
    const recipients = await getSubscribers(cityProfile)

    const emailDoc: any = {
      status: 'scheduled',
      scheduledAt: moment()
        .hour(18)
        .minute(0)
        .second(0),
      createdAt: Date.now(),
      from: `WeDance <noreply@wedance.vip>`,
      subject: 'Weekly Newsletter',
      recipients,
      html,
    }

    const emailRef = await firestore.collection('emails').add(emailDoc)

    emailDoc.id = emailRef.id

    await sendEmail(emailDoc)

    await firestore
      .collection('emails')
      .doc(emailDoc.id)
      .update({
        status: 'sent',
        processedAt: Date.now(),
        error: '',
      })
  }

  return null
}
