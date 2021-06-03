import { indexProfiles } from './lib/algolia'
import {
  migrateFavs,
  migrateShares,
  migrateUsernames,
  migrateChat
} from './lib/migrations'
import { screenshot } from './lib/screenshot'
import { getCities } from './lib/stats'

require('yargs')
  .command('screenshot <username>', 'Screenshot', async (args: any) => {
    await screenshot(
      `https://wedance.vip/${args.username}/share`,
      'Europe/Berlin',
      {
        path: `var/${args.username}.png`
      }
    )
  })
  .command('algolia', 'Send profiles to algolia', async (args: any) => {
    await indexProfiles()
  })
  .command('migrate:favs', 'Migrate favs', async (args: any) => {
    await migrateFavs()
  })
  .command('migrate:usernames', 'Migrate usernames', async (args: any) => {
    await migrateUsernames()
  })
  .command('migrate:shares', 'Migrate shares', async (args: any) => {
    await migrateShares()
  })
  .command('migrate:chat', 'Migrate chat', async (args: any) => {
    await migrateChat()
  })
  .command('stats:cities', 'Get cities stats', async (args: any) => {
    await getCities()
  })
  .help()
  .alias('help', 'h')
  .strictCommands().argv
