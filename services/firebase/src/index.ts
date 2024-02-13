import axios from 'axios'
import * as Sentry from '@sentry/node'
import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'
import * as Handlebars from 'handlebars'
import sendEmail from './lib/sendEmail'
import { screenshot } from './lib/screenshot'
import {
  eventForApi,
  eventToAlgolia,
  initIndex,
  profileToAlgolia,
  removeObject,
} from './lib/algolia'
import { generateSocialCover, updateEventPoster } from './lib/migrations'
import { firestore as db, admin, firestore } from './firebase'
import { notifySlackAboutEvents, notifySlackAboutUsers } from './lib/slack'
import { wrap } from './sentry'
import { announceEventIG2, importInstagramProfile } from './lib/instagram'
import { getFacebookEvent } from './lib/facebook_import'
import { syncCalendar } from './lib/ical_import'

require('dotenv').config()

Sentry.init({
  dsn: String(process.env.SENTRY_DSN),
  tracesSampleRate: 1.0,
  serverName: 'firebase-functions',
})

const app = express()
app.use(cors({ origin: true }))

app.get('/redirect', async (req, res) => {
  const { url } = req.query

  if (!url) {
    res.json({
      success: false,
    })
    return
  }

  const response = await axios.get(url as string)

  res.json({
    success: true,
    url: response.request.res.responseUrl,
  })

  return
})

app.get('/events', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10)

  const eventDocs = (
    await firestore
      .collection('posts')
      .where('startDate', '>', today)
      .get()
  ).docs

  const data = []

  for (const doc of eventDocs) {
    const event = {
      id: doc.id,
      ...doc.data(),
    } as any

    data.push(eventForApi(event))
  }

  res.json({
    success: true,
    data,
  })
})

app.post('/track/:action', async (req, res) => {
  const vars = req.body['event-data']['user-variables']

  const campaignId = vars.campaignId
  const type = vars.type
  const uid = vars.uid
  const action = req.params.action

  if (!campaignId || !uid || !action) {
    return
  }

  if (type === 'matchNotification') {
    await db
      .collection('matches')
      .doc(campaignId)
      .update({
        [`recipients.${uid}.${action}`]: admin.firestore.Timestamp.now(),
      })
  } else if (type === 'chatNotification') {
    await db.collection('chatNotifications').add({
      uid,
      action,
      chatId: campaignId,
      date: admin.firestore.Timestamp.now(),
    })
  } else if (type === 'commentNotification') {
    await db.collection('commentNotifications').add({
      uid,
      action,
      commentId: campaignId,
      date: admin.firestore.Timestamp.now(),
    })
  } else if (type === 'welcomeEmail') {
    await db
      .collection('templates')
      .doc(campaignId)
      .update({
        [`recipients.${uid}.${action}`]: admin.firestore.Timestamp.now(),
      })
  } else {
    await db
      .collection('emails')
      .doc(campaignId)
      .update({
        [`recipients.${uid}.${action}`]: admin.firestore.Timestamp.now(),
      })
  }

  res.json({
    success: true,
    message: 'Action tracked',
  })
})

app.get('/share/*', async (req, res) => {
  const path = (req.params as string[])[0]
  const timezone = req.query.timezone as string

  try {
    const imageBuffer = await screenshot(
      `https://wedance.vip/${path}/share`,
      timezone
    )

    const bucket = admin.storage().bucket()
    const filePath = 'share/' + path + '.png'
    const file = bucket.file(filePath)

    await file.save(imageBuffer, {
      public: true,
    })

    const [metadata] = await file.getMetadata()

    const url = metadata.mediaLink

    return res.json({
      success: true,
      url,
    })
  } catch (e) {
    return res.json({
      success: false,
      error: (e as Error).message,
    })
  }
})

type RecipientList = {
  [key: string]: {
    name: string
    email: string
  }
}

export const hooks = functions
  .runWith({ memory: '1GB' })
  .https.onRequest(wrap(app))

const render = (templateString: string, data: Object) => {
  const templator = Handlebars.compile(templateString)
  return templator({ data })
}

function wasChanged(prev: any, next: any, fields: string[]) {
  if (!prev || !next) {
    return true
  }

  return !fields.every((field: string) => prev[field] === next[field])
}

export const onCalendarUpdate = functions.firestore
  .document('calendars/{calendarId}')
  .onWrite(async (change) => {
    const calendarRef = change.after
    const calendar = calendarRef.data() as any

    if (calendar.state === 'queued') {
      await syncCalendar(calendarRef)
    }
  })

export const onProfileChange = functions.firestore
  .document('profiles/{profileId}')
  .onWrite(async (change, context) => {
    const snapshot = change.after
    const oldProfile = change.before.data()
    const profile = snapshot.data()
    const profileId = context.params.profileId

    const wasDeleted = oldProfile?.username && !profile?.username
    const wasCreated = !oldProfile?.username && profile?.username
    const becameUnlisted =
      profile?.visibility === 'Unlisted' &&
      oldProfile?.visibility !== 'Unlisted'

    if (wasDeleted || becameUnlisted) {
      await removeObject('profiles', profileId)
    }

    if (!profile || !profile.username) {
      return
    }

    if (profile.import === 'requested') {
      await importInstagramProfile(snapshot)
      return
    }

    if (wasCreated) {
      const message = `New dancer - https://wedance.vip/${profile.username}\n\nUID:${profileId}`
      await notifySlackAboutUsers(message)
    }

    const index = initIndex('profiles')

    if (profile.visibility !== 'Unlisted') {
      await index.saveObject(
        await profileToAlgolia({
          ...profile,
          id: profileId,
        })
      )
    }

    const canBoost =
      profile.permission === 'Yes' &&
      profile.photo &&
      profile.styles &&
      profile.bio &&
      profile.type

    if (canBoost && oldProfile?.photo !== profile.photo) {
      await generateSocialCover(profile)
    }
  })

export const accountCreated = functions.firestore
  .document('accounts/{accountId}')
  .onCreate(async (snapshot, context) => {
    const account = snapshot.data() as any
    const accountId = context.params.accountId

    let emailTemplate: any
    let emailTemplateId: any

    const emailTemplates = await db
      .collection('templates')
      .where('name', '==', 'welcome')
      .get()

    emailTemplates.forEach((currentEmailTemplate) => {
      emailTemplate = currentEmailTemplate.data()
      emailTemplateId = currentEmailTemplate.id
    })

    if (
      !emailTemplate ||
      !emailTemplate.from ||
      !emailTemplate.subject ||
      !emailTemplate.content
    ) {
      return
    }

    const data = {
      account,
    }

    const recipients = {
      [accountId]: {
        name: account.name,
        email: account.email,
      },
    }

    const emailData = {
      from: render(emailTemplate.from, data),
      subject: render(emailTemplate.subject, data),
      content: render(emailTemplate.content, data),
      recipients,
      type: 'welcomeEmail',
      id: emailTemplateId,
    }

    await db
      .collection('templates')
      .doc(emailTemplate.id)
      .update({
        [`recipients.${accountId}`]: recipients[accountId],
      })

    return await sendEmail(emailData)
  })

export const eventChanged = functions.firestore
  .document('posts/{eventId}')
  .onWrite(async (change, context) => {
    const oldEvent = change.before.data() as any
    const eventId = context.params.eventId
    const event = { ...change.after.data(), id: eventId } as any

    const wasDeleted = oldEvent?.name && !event?.name

    if (wasDeleted) {
      await removeObject('events', eventId)
      return
    }

    if (event.type === 'import_event') {
      const eventData = await getFacebookEvent(event.facebook)

      if (event.facebookId) {
        eventData.facebookId = event.facebookId
      }

      if (event.startDate) {
        eventData.startDate = event.startDate
      }

      if (event.endDate) {
        eventData.endDate = event.endDate
      }

      await firestore
        .collection('posts')
        .doc(eventId)
        .update(eventData)

      return
    }

    if (wasChanged(oldEvent, event, ['updatedAt', 'type'])) {
      const index = initIndex('events')

      if (!event?.id && oldEvent.id) {
        await index.deleteObject(oldEvent.id)
      }

      if (event?.type === 'event') {
        await index.saveObject(
          eventToAlgolia({
            ...event,
            id: eventId,
          })
        )
      }
    }

    if (
      wasChanged(oldEvent, event, ['cover']) &&
      event?.type === 'event' &&
      !event?.socialCover
    ) {
      await updateEventPoster(event)
      return
    }

    if (
      wasChanged(oldEvent, event, ['promotion']) &&
      event?.promotion === 'requested'
    ) {
      try {
        const ig = (await announceEventIG2(event)) as any

        await db
          .collection('posts')
          .doc(eventId)
          .update({
            'instagram.state': 'published',
            'instagram.publishedAt': +new Date(),
            'instagram.messageId': ig.messageId,
            'instagram.messageUrl': ig.messageUrl,
            promotion: 'completed',
            promotionError: '',
          })
      } catch (e) {
        await db
          .collection('posts')
          .doc(eventId)
          .update({
            promotion: 'failed',
            promotionError: (e as Error).message,
          })
      }
    }
  })

export const eventCreated = functions.firestore
  .document('posts/{eventId}')
  .onCreate(async (snapshot, context) => {
    const eventId = context.params.eventId
    const event = snapshot.data() as any

    if (event.type !== 'event') {
      return
    }

    const cache = (
      await db
        .collection('app')
        .doc('v2')
        .get()
    ).data() as any

    const cityName = cache.cities[event.place]?.name || 'International'
    const promoter = cache.profiles[event.createdBy]?.username || 'Unknown'
    const startDate = new Date(event.startDate)

    const index = initIndex('events')

    await index.saveObject(
      eventToAlgolia({
        ...event,
        id: eventId,
      })
    )

    const lines = []

    if (event.promo === 'Yes') {
      lines.push(`Promote event in ${cityName}`)
    } else {
      lines.push(`New event in ${cityName}`)
    }

    lines.push(event.name)
    lines.push(startDate)

    lines.push(`Organised by ${event.org?.username}`)
    lines.push(`Promoted by ${promoter}`)

    lines.push(`https://wedance.vip/events/${eventId}`)

    await notifySlackAboutEvents(lines.join('\n'))
  })

export const eventConfirmation = functions.firestore
  .document('participants/{rsvpId}')
  .onWrite(async (snapshot, context) => {
    const rsvp = snapshot.after.data() as any
    const rsvpId = context.params.rsvpId

    if (rsvp.rsvp !== 'up' || rsvp.collection !== 'posts') {
      return
    }

    const recipients: RecipientList = {}

    const guest = rsvp.participant

    if (!guest.name || !guest.email) {
      return
    }

    recipients[rsvpId] = {
      name: guest.name,
      email: guest.email,
    }

    const event: any = (
      await db
        .collection('posts')
        .doc(rsvp.eventId)
        .get()
    ).data()

    const subject = event.name
    const content = event.confirmation

    if (!content) {
      return
    }

    const data = {
      guest,
      event,
    }

    const email = {
      from: 'WeDance <noreply@wedance.vip>',
      recipients,
      subject,
      content: render(content, data),
      type: 'eventConfirmation',
      id: rsvpId,
    }

    await sendEmail(email)
  })

async function getAccountByUsername(username: string) {
  const profiles = await db
    .collection('profiles')
    .where('username', '==', username)
    .get()

  if (profiles.docs.length !== 1) {
    return null
  }

  const id = profiles.docs[0].id

  const account: any = (
    await db
      .collection('accounts')
      .doc(id)
      .get()
  ).data()

  account.id = id

  return account
}

export const commentNotification = functions.firestore
  .document('comments/{commentId}')
  .onWrite(async (change, context) => {
    const comment = change.after.data() as any
    const commentId = context.params.commentId

    const post: any = (
      await db
        .collection('posts')
        .doc(comment.postId)
        .get()
    ).data()

    if (!post.watch) {
      return
    }

    const watchList = post.watch.list
    const watchUsernames = Object.keys(watchList)

    const recipients: RecipientList = {}

    for (const username of watchUsernames) {
      const account = await getAccountByUsername(username)

      if (!account) {
        continue
      }

      if (comment.createdBy === account.id) {
        continue
      }

      recipients[account.id] = {
        name: username,
        email: account.email,
      }
    }

    const content = `
**${comment.username} replied:**

${comment.body}

**on post ${post.title || ''}**

${post.description}

[View comment](https://wedance.vip/posts/${post.id}#comment-${commentId})
`

    const email = {
      from: 'WeDance <noreply@wedance.vip>',
      recipients,
      subject: 'New comment on post you are watching',
      content,
      type: 'commentNotification',
      id: commentId,
    }

    await sendEmail(email)
  })

export const matchNotification = functions.firestore
  .document('chats/{chatId}')
  .onWrite(async (change, context) => {
    const after = change.after.data() as any
    const before = change.before.data() as any

    if (after?.lastMessageBy === before?.lastMessageBy) {
      return
    }

    delete after.members[after.lastMessageBy]
    const to = Object.keys(after.members)[0]

    const toAccount = (
      await db
        .collection('accounts')
        .doc(to)
        .get()
    ).data()

    if (!toAccount) {
      throw new Error('toAccount not found')
    }

    const subject = 'You’ve got a new message'

    const recipients: RecipientList = {}

    recipients[to] = {
      name: toAccount.name,
      email: toAccount.email,
    }

    const content = `#### You’ve got a new message

    You have a message. Visit WeDance to see it now.

[View message](https://wedance.vip/chat)
`

    const from = 'WeDance <noreply@wedance.vip>'

    const data = {
      from,
      recipients,
      subject,
      content,
      type: 'chatNotification',
      id: change.after.id,
    }

    await sendEmail(data)
  })

// export const taskRunner = functions
//   .runWith({ memory: '2GB' })
//   .pubsub.schedule('* * * * *')
//   .onRun(async () => {
//     const now = admin.firestore.Timestamp.now()

//     const query = db
//       .collection('emails')
//       .where('scheduledAt', '<=', now)
//       .where('status', '==', 'scheduled')

//     const tasks = await query.get()

//     const jobs: Promise<any>[] = []

//     tasks.forEach((snapshot) => {
//       const data = {
//         ...snapshot.data(),
//         id: snapshot.id,
//       }
//       const job = sendEmail(data)
//         .then(() =>
//           snapshot.ref.update({
//             status: 'sent',
//             processedAt: admin.firestore.Timestamp.now(),
//             error: '',
//           })
//         )
//         .catch((err) =>
//           snapshot.ref.update({
//             status: 'error',
//             processedAt: admin.firestore.Timestamp.now(),
//             error: err.message,
//           })
//         )

//       jobs.push(job)
//     })

//     return await Promise.all(jobs)
//   })
