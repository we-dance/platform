import { config } from 'firebase-functions'

require('dotenv').config()

export default {
  algolia: {
    appId: (process.env.ALGOLIA_APP_ID || config().algolia.app_id) as string,
    apiKey: (process.env.ALGOLIA_API_KEY || config().algolia.api_key) as string,
  },
  slack: {
    events: (process.env.SLACK_EVENTS || config().slack.events) as string,
    users: (process.env.SLACK_USERS || config().algolia.users) as string,
  },
}
