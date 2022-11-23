import axios from 'axios'
require('dotenv').config()

export async function announceEventIG(event: any) {
  const hashtags = [event.eventType, ...Object.keys(event.styles)]
    .map((tag) => `#${tag}`)
    .join(' ')

  let description = event.description

  if (description.length > 140) {
    description = description.substring(0, 140) + '...'
  }

  const photo = event.socialCover
  const caption = encodeURI(`${description}\nSee link in bio\n\n\n${hashtags}`)
  const token = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
  const igUserId = '38750331875'

  const response = await axios.post(
    `https://graph.facebook.com/v14.0/${igUserId}/media?image_url=${photo}&caption=${caption}&access_token=${token}`
  )

  console.log(response)
}
