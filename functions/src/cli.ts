import { indexProfiles } from './lib/algolia'
import { migrateFavs } from './lib/migrations'
import { screenshot } from './lib/screenshot'

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
  .help()
  .alias('help', 'h')
  .strictCommands().argv
