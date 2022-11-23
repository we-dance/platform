import { IgApiClient } from 'instagram-private-api'
import axios from 'axios'
const pngToJpeg = require('png-to-jpeg')

require('dotenv').config()

export async function announceEventIG(event: any) {
  const hashtags = [event.eventType, ...Object.keys(event.styles)]
    .map((tag) => `#${tag}`)
    .join(' ')

  let description = event.description || ''

  if (description.length > 140) {
    description = description.substring(0, 140) + '...'
  }

  const photo = event.socialCover

  const caption = `${description}\nSee link in bio\n\n\n${hashtags}`

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
