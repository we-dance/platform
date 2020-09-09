import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import sendEmail from './lib/sendEmail'
import * as express from 'express'
import * as cors from 'cors'

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

// export const welcomeEmail =

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

    let intro = ''

    if (match.auto === 'Yes') {
      intro = '## Message from WeDance:'
    } else {
      intro = `## Message from ${fromProfile.name}:`
    }

    const message =
      intro +
      `

${match.message}

## Your Dance Profiles:

[${fromProfile.name}](https://wedance.vip/u/${fromProfile.username})

[${toProfile.name}](https://wedance.vip/u/${toProfile.username})

`

    const from = 'WeDance <automated@wedance.vip>'

    const recipients = {
      [toAccount.id]: {
        name: toProfile.name,
        email: toAccount.email
      },
      [fromAccount.id]: {
        name: fromAccount.name,
        email: fromAccount.email
      }
    }

    const data = {
      ...snapshot.data(),
      from,
      recipients,
      subject: 'Dance Partner Request',
      content: message,
      type: 'matchNotification',
      id: snapshot.id,
      bcc: 'bcc@wedance.vip'
    }

    return await sendEmail(data)
      .then(() => snapshot.ref.update({ status: 'sent', error: '' }))
      .catch((err) =>
        snapshot.ref.update({ status: 'error', error: err.message })
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
        .then(() => snapshot.ref.update({ status: 'sent', error: '' }))
        .catch((err) =>
          snapshot.ref.update({ status: 'error', error: err.message })
        )

      jobs.push(job)
    })

    return await Promise.all(jobs)
  })
