import { IncomingWebhook } from '@slack/client'
require('dotenv').config()

const eventsWebhook = new IncomingWebhook(String(process.env.SLACK_EVENTS))
const usersWebhook = new IncomingWebhook(String(process.env.SLACK_USERS))

export async function notifySlackAboutEvents(message: string) {
  await eventsWebhook.send(message)
}

export async function notifySlackAboutUsers(message: string) {
  await usersWebhook.send(message)
}
