import { IgApiClient } from 'instagram-private-api'
import axios from 'axios'
const pngToJpeg = require('png-to-jpeg')

require('dotenv').config()

function getMention(link: string) {
  if (!link) {
    return ''
  }

  let result = link
  result = result.replace('https://instagram.com/', '@')
  result = result.replace('https://www.instagram.com/', '@')
  result = result.replace('/', '')

  return result
}

export async function announceEventIG(event: any) {
  if (event.place !== 'ChIJ2V-Mo_l1nkcRfZixfUq4DAE') {
    throw new Error(
      `Instagram promotion is only available in Munich at the moment`
    )
  }

  const hashtags = [event.eventType, ...Object.keys(event.styles)]
    .map((tag) => `#${tag}`)
    .join(' ')

  const name = event.name || ''
  const description = event.description || ''
  const venue = event.venue?.name || ''
  const price = event.price || ''
  const specialOffer = event.specialOffer || ''

  const mentionsList = [getMention(event.org?.instagram)]

  for (const artist of event.artists) {
    mentionsList.push(getMention(artist?.instagram))
  }

  const mentions = mentionsList.join(' ')

  const photo = event.socialCover

  let caption = ''

  if (specialOffer) {
    caption += `🔥${specialOffer}\n\n`
  }

  caption += `${name}\n`
  caption += `📍${venue}\n`
  caption += `💰${price}\n`
  caption += `\n`
  caption += `${description}\n`
  caption += `\n`
  caption += `👉 See link in bio\n`
  caption += `\n`
  caption += mentions
  caption += `\n\n`
  caption += hashtags

  const response = await axios.get(photo, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data, 'utf-8')

  const file = await pngToJpeg({ quality: 90 })(buffer)

  const ig = new IgApiClient()
  ig.state.generateDevice(String(process.env.INSTAGRAM_MUNICH_USERNAME))

  await ig.account.login(
    String(process.env.INSTAGRAM_MUNICH_USERNAME),
    String(process.env.INSTAGRAM_MUNICH_PASSWORD)
  )

  const publishResult = await ig.publish.photo({
    // read the file into a Buffer
    file,
    // optional, default ''
    caption,
    // optional
    // location: mediaLocation,
    // optional
    // usertags: {
    //   in: [
    //     // tag the user 'instagram' @ (0.5 | 0.5)
    //     await generateUsertagFromName('instagram', 0.5, 0.5),
    //   ],
    // },
  })

  const messageId = publishResult.media.code
  const messageUrl = 'https://instagram.com/p/' + publishResult.media.code

  return {
    messageId,
    messageUrl,
  }
}
