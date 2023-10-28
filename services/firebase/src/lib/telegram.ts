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

  const name = event.name || ''
  let description = event.description || ''
  const venue = event.venue?.name || ''
  const price = event.price || ''
  const specialOffer = event.specialOffer || ''

  if (description.length > 280) {
    description = description.substring(0, 280) + '...'
  }

  const photo = event.socialCover

  let caption = ''

  if (specialOffer) {
    caption += `🔥${specialOffer}\n`
  }

  caption += `<b>${name}</b>\n`
  caption += `📍${venue}\n`
  caption += `💰${price}\n`
  caption += `\n`
  caption += `${description}\n`
  caption += `\n`
  caption += `<b>👉<a href="https://wedance.vip/events/${event.id}">View Event</a></b>\n`
  caption += `\n`
  caption += hashtags

  const cities = await getDocs(
    db.collection('cities').where('location.place_id', '==', event.place)
  )

  if (!cities.length) {
    throw new Error(`Community for place "${event.place}" not found`)
  }

  const city = cities[0]

  const chatId = options?.chatId || city.telegramChannelId
  const chatUrl = options?.chatUrl || city.telegramChannel

  if (!chatId) {
    throw new Error(`Telegram bot is not present in ${city.name}`)
  }

  const response = await telegram.sendPhoto(chatId, photo, {
    caption,
    parse_mode: 'HTML',
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
