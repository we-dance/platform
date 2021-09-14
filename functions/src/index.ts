import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'
import * as Handlebars from 'handlebars'
import sendEmail from './lib/sendEmail'
import { screenshot } from './lib/screenshot'
import { initIndex, profileToAlgolia, removeObject } from './lib/algolia'
import { generateSocialCover } from './lib/migrations'
import { firestore as db, admin } from './firebase'

const app = express()
app.use(cors({ origin: true }))

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
  const path = req.params[0]
  const timezone = req.query.timezone as string

  try {
    const imageBuffer = await screenshot(
      `https://wedance.vip/${path}/share`,
      timezone,
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
      error: e.message,
    })
  }
})

export const hooks = functions.runWith({ memory: '1GB' }).https.onRequest(app)

const render = (templateString: string, data: Object) => {
  const templator = Handlebars.compile(templateString)
  return templator({ data })
}

function wasChanged(prev: any, next: any, fields: string[]) {
  return !fields.every((field: string) => prev[field] === next[field])
}

function pick(object: any, fields: string[]) {
  const result = {} as any

  fields.forEach((field: string) => {
    result[field] = object[field] || ''
  })

  return result
}

export const onProfileChange = functions.firestore
  .document('profiles/{profileId}')
  .onWrite(async (change, context) => {
    const snapshot = change.after
    const oldProfile = change.before.data()
    const profile = snapshot.data()
    const profileId = context.params.profileId

    const wasDeleted = oldProfile?.username && !profile?.username
    const becameUnlisted =
      profile?.visibility === 'Unlisted' &&
      oldProfile?.visibility !== 'Unlisted'

    if (wasDeleted || becameUnlisted) {
      await removeObject(profileId)
    }

    if (!profile || !profile.username || !profile.place) {
      return
    }

    const cacheFields = [
      'username',
      'photo',
      'height',
      'weight',
      'bio',
      'community',
      'locales',
    ]

    const needsCacheUpdate = wasChanged(oldProfile, profile, cacheFields)

    if (needsCacheUpdate) {
      const profileCache = pick(profile, cacheFields)

      await db
        .collection('app')
        .doc('v2')
        .update({ [`profiles.${profileId}`]: profileCache })
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

    const cache = (await db.collection('app').doc('v2').get()).data() as any

    const index = initIndex('profiles')

    if (profile.visibility !== 'Unlisted') {
      await index.saveObject(
        profileToAlgolia(
          {
            ...profile,
            id: profileId,
          },
          cache,
        ),
      )
    }

    if (oldProfile?.place === profile.place) {
      return
    }

    const account = (
      await db.collection('accounts').doc(profileId).get()
    ).data()

    if (!account) {
      throw Error(`Account ${profileId} not found`)
    }

    const rsvps = await db
      .collection('participants')
      .where('participant.email', '==', account.email)
      .get()

    const accountInfo = {
      name: '',
      phone: '',
    }

    rsvps.forEach(async (currentRsvp) => {
      const rsvp = currentRsvp.data()

      if (rsvp && rsvp.participant && rsvp.participant.name) {
        accountInfo.name = rsvp.participant.name
      }

      if (rsvp && rsvp.participant && rsvp.participant.phone) {
        accountInfo.phone = rsvp.participant.phone
      }

      await currentRsvp.ref.update({ uid: profileId })
    })

    await db.collection('accounts').doc(profileId).update(accountInfo)

    const cities = await db
      .collection('cities')
      .where('location.place_id', '==', profile.place)
      .get()

    let city: any

    cities.forEach((currentCity) => {
      city = currentCity.data()
    })

    if (!city || !city.name) {
      throw Error(`City ${profile.place} not found for ${profile.username}`)
    }

    if (!city.telegram) {
      await db.collection('errors').add({
        uid: profileId,
        username: profile.username,
        context: {
          city: city.name,
        },
        error: 'No chat for city',
      })

      throw Error(`City ${city.name} has no chat`)
    }

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
      throw Error(`Email template welcome not found`)
    }

    const data = {
      profile,
      account,
      city,
    }

    const recipients = {
      [profileId]: {
        name: account.name || account.name,
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
        [`recipients.${profileId}`]: recipients[profileId],
      })

    return await sendEmail(emailData)
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

    const toAccount = (await db.collection('accounts').doc(to).get()).data()

    if (!toAccount) {
      throw Error('toAccount not found')
    }

    const subject = 'You’ve got a new message'

    type RecipientList = {
      [key: string]: {
        name: string
        email: string
      }
    }

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

export const taskRunner = functions
  .runWith({ memory: '2GB' })
  .pubsub.schedule('* * * * *')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now()

    const query = db
      .collection('emails')
      .where('scheduledAt', '<=', now)
      .where('status', '==', 'scheduled')

    const tasks = await query.get()

    const jobs: Promise<any>[] = []

    tasks.forEach((snapshot) => {
      const data = {
        ...snapshot.data(),
        id: snapshot.id,
      }
      const job = sendEmail(data)
        .then(() =>
          snapshot.ref.update({
            status: 'sent',
            processedAt: admin.firestore.Timestamp.now(),
            error: '',
          }),
        )
        .catch((err) =>
          snapshot.ref.update({
            status: 'error',
            processedAt: admin.firestore.Timestamp.now(),
            error: err.message,
          }),
        )

      jobs.push(job)
    })

    return await Promise.all(jobs)
  })
