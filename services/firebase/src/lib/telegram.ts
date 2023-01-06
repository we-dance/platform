import { Telegram } from 'telegraf'
import { firestore as db } from '../firebase'
import { getDocs } from './migrations'

require('dotenv').config()

// see https://api.telegram.org/bot<YourBOTToken>/getUpdates to get chatID
async function announceEvent(event: any, options: any = null) {
  const token = String(process.env.TELEGRAM_BOT_TOKEN)
  const telegram = new Telegram(token)

  const hashtags = [event.eventType, ...Object.keys(event.styles)]
    .map((tag) => `#${tag}`)
    .join(' ')

  let description = event.description || ''

  if (description.length > 140) {
    description = description.substring(0, 140) + '...'
  }

  const photo = event.socialCover
  const caption = `${hashtags}\n\n${description}\n\nhttps://wedance.vip/events/${event.id}`

  const cities = await getDocs(
    db.collection('cities').where('location.place_id', '==', event.place)
  )

  if (!cities.length) {
    console.log(`Community ${event.place} not found`)
    return
  }

  const city = cities[0]

  const chatId = options?.chatId || city.telegramChannelId
  const chatUrl = options?.chatUrl || city.telegramChannel

  if (!chatId) {
    console.log(`Bot is not present in ${city.name}`)
    return
  }

  const response = await telegram.sendPhoto(chatId, photo, {
    caption,
  })

  const messageId = response.message_id
  const messageUrl = `${chatUrl}/${messageId}`

  return {
    chatId,
    chatUrl,
    messageId,
    messageUrl,
    city,
  }
}

export { announceEvent }
