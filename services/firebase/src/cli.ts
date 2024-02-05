import {
  eventToAlgolia,
  indexEvents,
  indexProfiles,
  initIndex,
  profileToAlgolia,
} from './lib/algolia'
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
import { announceEventIG2, getIgProfile } from './lib/instagram'
import { closeBrowser, getPage } from './lib/browser'
import { getFacebookEvent } from './lib/facebook_import'
import { getPlace } from './lib/google_maps'
import { generateStyles } from './lib/dance_styles'
import axios from 'axios'
import { scrapeFbEvent } from 'facebook-event-scraper'
import { getUploadedImage } from './lib/cloudinary'
import _ = require('lodash')
import * as YAML from 'yaml'
import * as fs from 'fs'
import * as ical from 'ical'

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
    'ical <url>',
    'Get ical',
    () => undefined,
    async (argv: any) => {
      const res = await axios(argv.url)
      const ics = ical.parseICS(res.data)
      console.log(ics)
    }
  )
  .command(
    'redirect <url>',
    'Resolve redirect',
    () => undefined,
    async (argv: any) => {
      const response = await axios.get(argv.url)
      console.log(response.request.res.responseUrl)
    }
  )
  .command(
    'org:image',
    'Refresh org photos',
    () => undefined,
    async (argv: any) => {
      let allEvents

      allEvents = await getDocs(
        firestore.collection('posts').where('source', '==', 'facebook')
      )

      console.log(`Found ${allEvents.length} events`)

      let count = 0
      for (const event of allEvents) {
        count++
        console.log(count, 'of', allEvents.length)

        if (!event.org?.photo) {
          console.log([
            'Photo is empty',
            'https://wedance.vip/events/' + event.id,
            event.facebook,
          ])
          continue
        }

        if (!event.org?.photo?.includes('fbcdn.net')) {
          console.log(`Skipping ${event.id} • ${event.org.photo}`)
          continue
        }

        let data: any

        try {
          data = await scrapeFbEvent(event.facebook)
        } catch (e) {
          console.log([
            'Error scraping',
            'https://wedance.vip/events/' + event.id,
            event.facebook,
            (e as Error).message,
          ])
          continue
        }

        if (!data?.hosts || !data?.hosts[0]?.photo?.imageUri) {
          console.log([
            'No org photo',
            'https://wedance.vip/events/' + event.id,
            event.facebook,
          ])
          continue
        }

        const now = +new Date()
        const photo = await getUploadedImage(data.hosts[0].photo.imageUri)

        const ref = await firestore
          .collection('profiles')
          .where('username', '==', event.org.username)
          .get()

        const doc = ref.docs[0]
        await doc.ref.update({ photo, source: 'facebook', updatedAt: now })

        console.log(
          event.org.username,
          'https://wedance.vip/events/' + event.id
        )
      }
    }
  )
  .command(
    'events:image [id]',
    'Refresh events images',
    () => undefined,
    async (argv: any) => {
      let allEvents

      if (argv.id) {
        allEvents = await getDocs(
          firestore.collection('posts').where('id', '==', argv.id)
        )
      } else {
        allEvents = await getDocs(
          firestore.collection('posts').where('source', '==', 'facebook')
        )
      }

      console.log(`Found ${allEvents.length} events`)

      let count = 0
      for (const event of allEvents) {
        count++
        console.log(count, 'of', allEvents.length)
        if (!event.cover?.includes('fbcdn.net')) {
          console.log(`Skipping ${event.id} • ${event.name}`)
          continue
        }

        let data: any

        try {
          data = await scrapeFbEvent(event.facebook)
        } catch (e) {
          console.log([
            'Error scraping',
            'https://wedance.vip/events/' + event.id,
            event.facebook,
            (e as Error).message,
          ])
          continue
        }

        if (!data?.photo?.imageUri) {
          console.log([
            'No image',
            'https://wedance.vip/events/' + event.id,
            event.facebook,
          ])
          continue
        }

        const cover = await getUploadedImage(data.photo.imageUri)

        await firestore
          .collection('posts')
          .doc(event.id)
          .update({ cover, source: 'facebook' })

        const index = initIndex('events')
        const changes = {
          ...event,
          cover,
        }

        index.saveObject(eventToAlgolia(changes))

        if (event.name) {
          console.log(event.name, 'https://wedance.vip/events/' + event.id)
        } else {
          console.log([
            'Event name is empty',
            'https://wedance.vip/events/' + event.id,
            event.facebook,
            data.name,
          ])
        }
      }
    }
  )
  .command(
    'events:hash',
    'Rehash events',
    () => undefined,
    async (argv: any) => {
      const facebookIds: any = {}

      const today = +new Date()

      const allEvents = await getDocs(
        firestore.collection('posts').where('startDate', '>', today)
      )

      for (const event of allEvents) {
        if (event.hash) {
          if (event.facebookId) {
            facebookIds[event.facebookId] = facebookIds[event.facebookId] || []
            facebookIds[event.facebookId].push(event)
          }

          continue
        }

        console.log(event.name)
        let hash = ''
        if (event.startDate && event.venue?.place_id) {
          hash = event.startDate + '+' + event.venue.place_id
        }
        let facebookId = ''
        if (event.facebook) {
          if (event.facebook.includes('/events/')) {
            const parts = event.facebook.replace(/\?.*/, '').split('/')
            facebookId = parts.pop() || parts.pop()
          } else if (event.facebook.includes('fb.me')) {
            console.log('Requesting facebook url', event.facebook)
            const response = await axios.get(event.facebook)
            const parts = response.request.res.responseUrl
              .replace(/\?.*/, '')
              .split('/')
            facebookId = parts.pop() || parts.pop()
            console.log('Got facebook id', facebookId)
          }
        }
        console.log([
          'https://wedance.vip/events/' + event.id,
          hash,
          event.facebook,
          facebookId,
        ])
        console.log()
        await firestore
          .collection('posts')
          .doc(event.id)
          .update({ hash, facebookId })

        if (facebookId) {
          facebookIds[facebookId] = facebookIds[facebookId] || []
          facebookIds[facebookId].push(event)
        }
      }

      for (const facebookId of Object.keys(facebookIds)) {
        if (facebookIds[facebookId].length > 1) {
          console.log(facebookId)
          for (const event of facebookIds[facebookId]) {
            console.log([
              'https://wedance.vip/events/' + event.id,
              event.name,
              event.hash,
            ])
          }
          console.log()
        }
      }
    }
  )
  .command(
    'styles',
    'Write dance styles',
    () => undefined,
    async (argv: any) => {
      generateStyles()
    }
  )
  .command(
    'place <name>',
    'Find place',
    () => undefined,
    async (argv: any) => {
      const name = argv.name

      const place = await getPlace(name)

      console.log(place)
    }
  )
  .command(
    'fbd <url>',
    'Import event from Facebook',
    () => undefined,
    async (argv: any) => {
      const url = argv.url

      const event = await scrapeFbEvent(url)

      console.log(event)
    }
  )
  .command(
    'fb <url>',
    'Import event from Facebook',
    () => undefined,
    async (argv: any) => {
      const url = argv.url

      const event = await getFacebookEvent(url)

      console.log(event)
    }
  )
  .command(
    'claim <target> <fan>',
    'Import event from Facebook',
    () => undefined,
    async (argv: any) => {
      const targetDoc = (
        await firestore
          .collection('profiles')
          .where('username', '==', argv.target)
          .get()
      ).docs[0]
      const target = { ...targetDoc.data(), id: targetDoc.id } as any

      const fanDoc = (
        await firestore
          .collection('profiles')
          .where('username', '==', argv.fan)
          .get()
      ).docs[0]
      const fan = { ...fanDoc.data(), id: fanDoc.id } as any

      const targetEvents = (
        await firestore
          .collection('posts')
          .where('org.username', '==', argv.target)
          .get()
      ).docs.map((d) => d.data())

      for (const event of targetEvents) {
        console.log(`Updating event • ${event.id} • ${event.name} `)

        await firestore
          .collection('posts')
          .doc(event.id)
          .update({
            username: fan.username,
            org: {
              id: fan.id,
              username: fan.username,
              name: fan.name || fan.username || '',
              photo: fan.photo || '',
              bio: fan.bio || '',
              instagram: fan.instagram || '',
              facebook: fan.facebook || '',
              tiktok: fan.tiktok || '',
              youtube: fan.youtube || '',
            },
          })
      }

      console.log('target', target.watch?.usernames)
      console.log('fan', fan.watch?.usernames)

      await firestore
        .collection('profiles')
        .doc(target.id)
        .update({
          ...fan,
          createdAt: target.createdAt,
          createdBy: target.createdBy,
          updatedAt: target.updatedAt,
          updatedBy: target.updatedBy || target.createdBy,
          fanCreatedBy: fan.createdBy,
          fanCreatedAt: fan.createdAt,
        })

      await firestore
        .collection('profiles')
        .doc(fan.id)
        .delete()
    }
  )
  .command(
    'get <eventId>',
    'Get event data',
    () => undefined,
    async (argv: any) => {
      const eventRef = await firestore
        .collection('posts')
        .doc(argv.eventId)
        .get()

      console.log(eventRef.data())
    }
  )
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
    'guests <username>',
    'Get guests for events of the specific profile',
    () => undefined,
    async (argv: any) => {
      const events = await getDocs(
        firestore
          .collection('posts')
          .where('org.username', '==', argv.username)
          .where('type', '==', 'event')
      )

      let guests = {} as any

      for (const event of events) {
        if (event?.star?.usernames?.length) {
          for (const username of event.star.usernames) {
            guests[username] = guests[username] || {}
            guests[username].username = username
            guests[username].count = guests[username].count || 0
            guests[username].count++
            guests[username].events = guests[username].events || []
            guests[username].events.push({
              name: event.name,
              startDate: new Date(event.startDate),
            })
          }
        }
      }

      guests = _.sortBy(guests, 'count').reverse()
      const doc = new YAML.Document()
      doc.contents = guests
      const output = doc.toString()
      fs.writeFileSync('guests.yml', output)
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

      const result = await announceEventIG2(event)

      if (!result) {
        return
      }

      console.log(`Posted at ${result.messageUrl}`)
    }
  )
  .command(
    'rm',
    'Remove specific events',
    () => undefined,
    async (argv: any) => {
      // const allEvents = await getDocs(
      //   firestore.collection('posts').where('org.username', '==', 'TOCATOCA')
      // )
      // const events = allEvents.filter((e) => e.startDate > '2024-01-01')
      // for (const event of events) {
      //   console.log(event.startDate, event.name)
      //   await firestore
      //     .collection('posts')
      //     .doc(event.id)
      //     .delete()
      // }
    }
  )
  .command(
    'ig <username>',
    'Get Instagram Info',
    () => undefined,
    async (argv: any) => {
      const instagram = await getIgProfile(argv.username)

      const now = +new Date()
      const changes = {
        importedAt: now,
        updatedAt: now,
        source: 'instagram',
        name: instagram.full_name,
        bio: instagram.biography || '',
        type: 'FanPage',
        import: 'success',
        website: instagram.external_url || '',
        photo: instagram.hd_profile_pic_url_info.url || '',
        visibility: 'Public',
      }

      console.log(changes)
    }
  )

  .command(
    'list <url>',
    'Get list of facebook events',
    () => undefined,
    async (argv: any) => {
      const page = await getPage()
      await page.goto(argv.url)

      let urls: any = await page.$$eval('a', (links) => {
        return links.map((link: any) => link.href)
      })

      urls = urls
        .map((url: string) => url.replace(/\?.*/, ''))
        .filter(
          (url: string) =>
            url.includes('facebook.com/events/') && url.length > 33
        )

      await closeBrowser()

      for (const url of urls) {
        const parts = url.replace(/\?.*/, '').split('/')
        const facebookId = parts.pop() || parts.pop()

        const docs = await getDocs(
          firestore.collection('posts').where('facebookId', '==', facebookId)
        )

        if (!docs.length) {
          await firestore.collection('posts').add({
            facebook: `https://www.facebook.com/events/${facebookId}/`,
            source: 'facebook',
            // provider: 'latindancecalendar.com',
            type: 'import_event',
            createdAt: +new Date(),
            updatedAt: +new Date(),
            createdBy: 'k7cEjCraPdbQnhc8YsTN',
            username: 'wedancebot',
          })
        }
      }
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
    'algolia:profile <username>',
    'See profileToAlgolia',
    () => undefined,
    async (argv: any) => {
      const profileDocs = (
        await firestore
          .collection('profiles')
          .where('username', '==', argv.username)
          .get()
      ).docs
      const profile = {
        ...profileDocs[0].data(),
        id: profileDocs[0].id,
      }

      const changes = await profileToAlgolia(profile)
      console.log(changes)
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
    'algolia:event <eventId>',
    'Send event to algolia',
    () => undefined,
    async (argv: any) => {
      const eventId = argv.eventId

      const event = (
        await firestore
          .collection('posts')
          .doc(eventId)
          .get()
      ).data() as any

      const index = initIndex('events')
      const algoliaEvent = eventToAlgolia({ ...event, id: eventId })

      console.log(algoliaEvent)

      const result = await index.saveObject(algoliaEvent)

      console.log(result)
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
