import { IgApiClient } from 'instagram-private-api'
require('dotenv').config()

export async function announceEventIG(event: any) {
  //   const hashtags = [event.eventType, ...Object.keys(event.styles)]
  //     .map((tag) => `#${tag}`)
  //     .join(' ')

  //   let description = event.description

  //   if (description.length > 140) {
  //     description = description.substring(0, 140) + '...'
  //   }

  //   const photo = event.socialCover
  //   const caption = `${description}\nSee link in bio\n\n\n${hashtags}`

  // process.env.INSTAGRAM_USERNAME,
  // process.env.INSTAGRAM_PASSWORD,

  const ig = new IgApiClient()
  ig.state.generateDevice(String(process.env.INSTAGRAM_USERNAME))
  await ig.simulate.preLoginFlow()
  const loggedInUser = await ig.account.login(
    String(process.env.INSTAGRAM_USERNAME),
    String(process.env.INSTAGRAM_PASSWORD)
  )
  process.nextTick(async () => await ig.simulate.postLoginFlow())

  //   ig.upload.photo()
  const userFeed = ig.feed.user(loggedInUser.pk)
  const myPostsFirstPage = await userFeed.items()
  console.log(myPostsFirstPage)
}
