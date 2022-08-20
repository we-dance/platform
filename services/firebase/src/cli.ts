import { indexProfiles } from './lib/algolia'
import {
  migrateFavs,
  migrateShares,
  migrateUsernames,
  migrateChat,
  chatNotifications,
} from './lib/migrations'
import { screenshot } from './lib/screenshot'
import { getCities } from './lib/stats'
import { announceEvent } from './lib/telegram'
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
  .command(
    'announce <eventId>',
    'Announce event',
    () => undefined,
    async (argv: any) => {
      const chatId = '-1001764201490'
      const chatUrl = 'https://t.me/+8l4IEhNjT3xlODNi'
      const result = await announceEvent(chatId, argv.eventId)
      console.log(`Posted at ${chatUrl}/${result.message_id} at ${result.date}`)
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
