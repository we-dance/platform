import { indexEvents, indexProfiles } from './lib/algolia'
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
import { getInstagramWebProfileInfo } from './lib/browser'

function getDomain(url: string): string {
  let hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }

  hostname = hostname.split(':')[0]
  hostname = hostname.split('?')[0]
  hostname = hostname.toLowerCase()
  hostname = hostname.replace('www.', '')

  return hostname
}

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
    'ig:profile <username>',
    'Get instagram profile',
    () => undefined,
    async (argv: any) => {
      const result = await getInstagramWebProfileInfo(
        'https://instagram.com/' + argv.username
      )

      console.log(result)
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
    'algolia:profiles',
    'Send profiles to algolia',
    () => undefined,
    async (argv: any) => {
      await indexProfiles()
    }
  )
  .command(
    'algolia:events',
    'Send events to algolia',
    () => undefined,
    async (argv: any) => {
      await indexEvents()
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
  .command(
    'cleanup:cities',
    'Cleanup cities',
    () => undefined,
    async (argv: any) => {
      const allCities = await getDocs(
        firestore.collection('profiles').where('type', '==', 'City')
      )

      const corruptCities = allCities.filter(
        (c) => !c.viewsCount || !c.username
      )

      for (const city of corruptCities) {
        console.log(`Removing ${city.name} • id: ${city.id}`)
        // await firestore
        //   .collection('profiles')
        //   .doc(city.id)
        //   .delete()
      }

      // const usernames = {} as any

      // for (const city of cities) {
      //   usernames[city.username] = usernames[city.username]
      //     ? 1
      //     : usernames[city.username] + 1
      // }

      // for (const username of Object.keys(usernames)) {
      //   if (usernames[username] > 1) {
      //     console.log(`${username} listed ${usernames[username]} times`)
      //   }
      // }

      for (const city of allCities) {
        const instances = allCities.filter((c) => c.place === city.place)

        if (instances.length > 1) {
          console.log(`${instances.length} x ${city.name}`)

          for (const instance of instances) {
            console.log(
              ` <${instance.username}> x ${instance.viewsCount} x ${instance
                .star?.count || 0} x ${instance.website}`
            )

            // if (!instance.website) {
            //   console.log(`Removing ${instance.username} • id: ${instance.id}`)
            //   await firestore
            //     .collection('profiles')
            //     .doc(instance.id)
            //     .delete()
            // }
          }
          console.log(``)
        }
      }

      const missingCityPlace = allCities.filter(
        (c) => !c.cityPlaceId && c.place
      )

      for (const city of missingCityPlace) {
        console.log(`Updating cityPlaceId for ${city.name}`)
        await firestore
          .collection('profiles')
          .doc(city.id)
          .update({
            cityPlaceId: city.place,
          })
      }
    }
  )
  .command(
    'ticketing',
    'Get ticketing platforms overview',
    () => undefined,
    async (argv: any) => {
      const allEvents = await getDocs(
        firestore.collection('posts').where('type', '==', 'event')
      )

      const domains = {} as any

      const eventsWithLinks = allEvents.filter((e) => !!e.link)

      for (const event of eventsWithLinks) {
        const link = event.link
        const domain = getDomain(link)

        if (domains[domain]) {
          domains[domain]++
        } else {
          domains[domain] = 1
        }
      }

      console.log(domains)
    }
  )
  .help('h')
  .alias('h', 'help')
  .strict().argv
