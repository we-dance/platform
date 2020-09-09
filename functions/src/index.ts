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
  const uid = vars.uid
  const action = req.params.action

  if (!campaignId || !uid || !action) {
    return
  }

  await db
    .collection('campaigns')
    .doc(campaignId)
    .update({
      [`recipients.${uid}.${action}`]: admin.firestore.Timestamp.now()
    })

  res.json({
    success: true,
    message: 'Action tracked'
  })
})

export const hooks = functions.https.onRequest(app)

export const taskRunner = functions
  .runWith({ memory: '2GB' })
  .pubsub.schedule('* * * * *')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now()

    const query = db
      .collection('campaigns')
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
        .then(() => snapshot.ref.update({ status: 'sent' }))
        .catch((err) => snapshot.ref.update({ status: 'error' }))

      jobs.push(job)
    })

    return await Promise.all(jobs)
  })
