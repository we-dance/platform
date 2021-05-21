import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as cors from 'cors'
import * as Handlebars from 'handlebars'
import sendEmail from './lib/sendEmail'
import { screenshot } from './lib/screenshot'
import { initIndex, profileToAlgolia } from './lib/algolia'
import { generateSocialCover } from './lib/migrations'
import { firestore as db } from './firebase'

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
        [`recipients.${uid}.${action}`]: admin.firestore.Timestamp.now()
      })
  } else if (type === 'welcomeEmail') {
    await db
      .collection('templates')
      .doc(campaignId)
      .update({
        [`recipients.${uid}.${action}`]: admin.firestore.Timestamp.now()
      })
  } else {
    await db
      .collection('emails')
      .doc(campaignId)
      .update({
        [`recipients.${uid}.${action}`]: admin.firestore.Timestamp.now()
      })
  }

  res.json({
    success: true,
    message: 'Action tracked'
  })
})

app.get('/share/*', async (req, res) => {
  const path = req.params[0]
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
      public: true
    })

    const [metadata] = await file.getMetadata()

    const url = metadata.mediaLink

    return res.json({
      success: true,
      url
    })
  } catch (e) {
    return res.json({
      success: false,
      error: e.message
    })
  }
})

export const hooks = functions.runWith({ memory: '1GB' }).https.onRequest(app)

const render = (templateString: string, data: Object) => {
  const templator = Handlebars.compile(templateString)
  return templator({ data })
}

export const onProfileChange = functions.firestore
  .document('profiles/{profileId}')
  .onWrite(async (change, context) => {
    const snapshot = change.after
    const oldProfile = change.before.data()
    const profile = snapshot.data()
    const profileId = context.params.profileId

    if (!profile || !profile.username || !profile.place) {
      return
    }

    const canBoost =
      profile.permission === 'Yes' &&
      profile.photo &&
      profile.styles &&
      profile.bio &&
      profile.type

    if (canBoost) {
      await generateSocialCover(profile)
    }

    const cache = (
      await db
        .collection('app')
        .doc('v2')
        .get()
    ).data() as any

    const index = initIndex('profiles')
    await index.saveObject(
      profileToAlgolia(
        {
          ...profile,
          id: profileId
        },
        cache
      )
    )

    if (oldProfile?.place === profile.place) {
      return
    }

    const account = (
      await db
        .collection('accounts')
        .doc(profileId)
        .get()
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
      phone: ''
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

    await db
      .collection('accounts')
      .doc(profileId)
      .update(accountInfo)

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
          city: city.name
        },
        error: 'No chat for city'
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
      city
    }

    const recipients = {
      [profileId]: {
        name: account.name || account.name,
        email: account.email
      }
    }

    const emailData = {
      from: render(emailTemplate.from, data),
      subject: render(emailTemplate.subject, data),
      content: render(emailTemplate.content, data),
      recipients,
      type: 'welcomeEmail',
      id: emailTemplateId
    }

    await db
      .collection('templates')
      .doc(emailTemplate.id)
      .update({
        [`recipients.${profileId}`]: recipients[profileId]
      })

    return await sendEmail(emailData)
  })

export const matchNotification = functions.firestore
  .document('matches/{matchId}')
  .onWrite(async (change, context) => {
    const snapshot = change.after
    const match = snapshot.data()

    if (!match || match.status !== 'open') {
      return
    }

    const fromAccount = (
      await db
        .collection('accounts')
        .doc(match.from)
        .get()
    ).data()

    const toAccount = (
      await db
        .collection('accounts')
        .doc(match.to)
        .get()
    ).data()

    const fromProfile = (
      await db
        .collection('profiles')
        .doc(match.from)
        .get()
    ).data()

    const toProfile = (
      await db
        .collection('profiles')
        .doc(match.to)
        .get()
    ).data()

    if (!fromAccount) {
      throw Error('fromAccount not found')
    }

    if (!toAccount) {
      throw Error('toAccount not found')
    }

    if (!fromProfile || !fromProfile.username) {
      throw Error('fromProfile not found')
    }

    if (!toProfile || !toProfile.username) {
      throw Error('toProfile not found')
    }

    let subject = ''

    type RecipientList = {
      [key: string]: {
        name: string
        email: string
      }
    }

    const recipients: RecipientList = {}

    recipients[match.to] = {
      name: toAccount.name || toProfile.name,
      email: toAccount.email
    }

    if (match.auto === 'Yes') {
      subject = 'Recommendation from WeDance'

      recipients[match.from] = {
        name: fromAccount.name || fromProfile.name,
        email: fromAccount.email
      }
    } else {
      subject = `Message from ${fromProfile.name}`
    }

    const content = `${match.message}

---

[Click here to reply to ${fromProfile.name}](https://wedance.vip/u/${fromProfile.username})

It's an automated email sent by robot, please **don't reply directly to this email**.

Contact via website and share your contacts to continue conversation in a proper messenger.

The goal of WeDance is to connect you with dancers, not to provide chatting platform.
`

    const from = 'WeDance <noreply@wedance.vip>'

    const data = {
      from,
      recipients,
      subject,
      content,
      type: 'matchNotification',
      id: snapshot.id
    }

    return await sendEmail(data)
      .then(() =>
        snapshot.ref.update({
          status: 'sent',
          recipients,
          processedAt: admin.firestore.Timestamp.now(),
          error: ''
        })
      )
      .catch((err) =>
        snapshot.ref.update({
          status: 'error',
          processedAt: admin.firestore.Timestamp.now(),
          error: err.message
        })
      )
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
        id: snapshot.id
      }
      const job = sendEmail(data)
        .then(() =>
          snapshot.ref.update({
            status: 'sent',
            processedAt: admin.firestore.Timestamp.now(),
            error: ''
          })
        )
        .catch((err) =>
          snapshot.ref.update({
            status: 'error',
            processedAt: admin.firestore.Timestamp.now(),
            error: err.message
          })
        )

      jobs.push(job)
    })

    return await Promise.all(jobs)
  })
