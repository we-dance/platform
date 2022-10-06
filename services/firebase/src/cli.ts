import { indexProfiles } from './lib/algolia'
import {
  migrateFavs,
  migrateShares,
  migrateUsernames,
  migrateChat,
  chatNotifications,
  getDocs,
} from './lib/migrations'
import { screenshot } from './lib/screenshot'
import { getCities } from './lib/stats'
import { announceEvent } from './lib/telegram'
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
import { firestore } from './firebase'
import { announceEventIG } from './lib/instagram'

yargs(hideBin(process.argv))
  .command(
    'tg:announce <eventId>',
    'Announce event on telegram',
    () => undefined,
    async (argv: any) => {
      const eventRef = await firestore
        .collection('posts')
        .doc(argv.eventId)
        .get()

      const event = { ...eventRef.data(), id: eventRef.id }
      const result = await announceEvent(event, {
        chatId: '-1001764201490',
        chatUrl: 'https://t.me/+8l4IEhNjT3xlODNi',
      })

      if (!result) {
        return
      }

      console.log(`Posted at ${result.messageUrl}`)
      console.log(
        `City ${result.city.name} with ${result.city.telegramChannelId} at ${result.city.telegramChannel}`
      )
    }
  )
  .command(
    'ig:announce <eventId>',
    'Announce event on instagram',
    () => undefined,
    async (argv: any) => {
      const event = (
        await firestore
          .collection('posts')
          .doc(argv.eventId)
          .get()
      ).data() as any

      const result = await announceEventIG(event)

      if (!result) {
        return
      }

      console.log(`Posted at ${result.messageUrl}`)
    }
  )
  .command(
    'events:cleanup',
    'Cleanup event announcements',
    () => undefined,
    async (argv: any) => {
      const events = await getDocs(
        firestore.collection('posts').where('telegram.state', '==', 'published')
      )

      for (const event of events) {
        console.log(event.name)
        await firestore
          .collection('posts')
          .doc(event.id)
          .update({ telegram: {} })
      }
    }
  )
  .command(
    'screenshot <username>',
    'Screenshot',
    () => undefined,
    async (argv: any) => {
      await screenshot(
        `https://wedance.vip/${argv.username}/share`,
        'Europe/Berlin',
        {
          path: `var/${argv.username}.png`,
        }
      )
    }
  )
  .command(
    'algolia',
    'Send profiles to algolia',
    () => undefined,
    async (argv: any) => {
      await indexProfiles()
    }
  )
  .command(
    'migrate:favs',
    'Migrate favs',
    () => undefined,
    async (argv: any) => {
      await migrateFavs()
    }
  )
  .command(
    'migrate:usernames',
    'Migrate usernames',
    () => undefined,
    async (argv: any) => {
      await migrateUsernames()
    }
  )
  .command(
    'migrate:shares',
    'Migrate shares',
    () => undefined,
    async (argv: any) => {
      await migrateShares()
    }
  )
  .command(
    'migrate:chat',
    'Migrate chat',
    () => undefined,
    async (argv: any) => {
      await migrateChat()
    }
  )

  .command(
    'chat',
    'Chat notifications',
    () => undefined,
    async (argv: any) => {
      await chatNotifications()
    }
  )
  .command(
    'stats:cities',
    'Get cities stats',
    () => undefined,
    async (argv: any) => {
      await getCities()
    }
  )
  .help('h')
  .alias('h', 'help')
  .strict().argv
