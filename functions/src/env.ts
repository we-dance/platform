require('dotenv').config()

export default {
  algolia: {
    appId: process.env.ALGOLIA_APP_ID as string,
    apiKey: process.env.ALGOLIA_API_KEY as string
  }
}
