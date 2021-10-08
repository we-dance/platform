import { IncomingWebhook } from '@slack/client'
import env from '../env'

const eventsWebhook = new IncomingWebhook(env.slack.events)
const usersWebhook = new IncomingWebhook(env.slack.users)

export async function notifySlackAboutEvents(message: string) {
  await eventsWebhook.send(message)
}

export async function notifySlackAboutUsers(message: string) {
  await usersWebhook.send(message)
}
