import { Telegram } from 'telegraf'
require('dotenv').config()

async function announceEvent(chatId: string, event: any) {
  const token = String(process.env.TELEGRAM_BOT_TOKEN)
  const telegram = new Telegram(token)

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
