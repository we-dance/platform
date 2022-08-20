import { Telegram } from 'telegraf'
import { firestore } from '../firebase'
require('dotenv').config()

async function announceEvent(chatId: string, eventId: string) {
  const token = String(process.env.TELEGRAM_BOT_TOKEN)
  const telegram = new Telegram(token)
  const event = (
    await firestore
      .collection('posts')
      .doc(eventId)
      .get()
  ).data() as any

  const hashtags = [event.eventType, ...Object.keys(event.styles)]
    .map((tag) => `#${tag}`)
    .join(' ')

  let description = event.description

  if (description.length > 140) {
    description = description.substring(0, 140) + '...'
  }

  const photo = event.socialCover
  const caption = `${hashtags}\n\n${description}\nhttps://wedance.vip/${event.org.username}`

  const response = await telegram.sendPhoto(chatId, photo, {
    caption,
  })

  return response
}

export { announceEvent }
