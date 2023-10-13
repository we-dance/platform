import { IgApiClient } from 'instagram-private-api'

require('dotenv').config()

export async function getIgProfile(username: string) {
  const ig = new IgApiClient()
  ig.state.generateDevice(String(process.env.INSTAGRAM_USERNAME))

  await ig.account.login(
    String(process.env.INSTAGRAM_USERNAME),
    String(process.env.INSTAGRAM_PASSWORD)
  )

  const info = await ig.user.usernameinfo(username)

  return info
}
