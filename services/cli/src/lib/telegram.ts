import { Telegram } from 'telegraf'
import { db } from '../firebase'

async function announceEvent(chatId: string, eventId: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN || ''
  const telegram = new Telegram(token)
  const event = (
    await db
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

  await telegram.sendPhoto(chatId, photo, {
    caption,
  })
}

export { announceEvent }
