import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as cors from 'cors'
import * as Handlebars from 'handlebars'
import sendEmail from './lib/sendEmail'

admin.initializeApp()
const db = admin.firestore()

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

export const hooks = functions.https.onRequest(app)

const render = (templateString: string, data: Object) => {
  const templator = Handlebars.compile(templateString)
  return templator({ data })
}

export const welcomeEmail = functions.firestore
  .document('profiles/{profileId}')
  .onWrite(async (change, context) => {
    const snapshot = change.after
    const oldProfile = change.before.data()
    const profile = snapshot.data()
    const profileId = context.params.profileId

    if (
      !profile ||
      !profile.username ||
      !profile.community ||
      oldProfile?.community === profile.community
    ) {
      return
    }

    let city: any

    const account = (
      await db
        .collection('accounts')
        .doc(profileId)
        .get()
    ).data()

    if (!account) {
      throw Error(`Account ${profileId} not found`)
    }

    const cities = await db
      .collection('cities')
      .where('name', '==', profile.community)
      .get()

    cities.forEach((currentCity) => {
      city = currentCity.data()
    })

    if (!city || !city.name || !city.telegram) {
      throw Error(`City ${profile.community} not found`)
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

**Your Dance Profiles**: [${fromProfile.name}](https://wedance.vip/u/${fromProfile.username}) & [${toProfile.name}](https://wedance.vip/u/${toProfile.username})

Unite dancers worldwide with **[WeDance.vip](https://wedance.vip/)**
`

    const from = 'WeDance <automated@wedance.vip>'

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
