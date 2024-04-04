import { IgApiClient } from 'instagram-private-api'
import axios from 'axios'
import { DocumentSnapshot } from 'firebase-functions/v1/firestore'
import { admin, firestore as db } from '../firebase'
import { getDocs } from './migrations'
import { initIndex } from './algolia'
const pngToJpeg = require('png-to-jpeg')

require('dotenv').config()

function getMention(link: string) {
  if (!link) {
    return ''
  }

  let result = link
  result = result.replace('https://instagram.com/', '@')
  result = result.replace('https://www.instagram.com/', '@')
  result = result.replace(/\?.*$/, '')
  result = result.replace('/', '')

  return result
}

export async function announceEventIG2(event: any) {
  const location = event?.venue?.geometry?.location

  if (!location) {
    throw new Error(`Location is missing for ${event.name} - ${event.id}`)
  }

  const profilesIndex = initIndex('profiles')
  const searchParams = {
    filters: `type:City`,
    aroundLatLng: `${location.lat}, ${location.lng}`,
    aroundRadius: 50000,
    hitsPerPage: 5,
  }
  const results = await profilesIndex.search('', searchParams)
  const hit: any = results.hits.find((h: any) => !!h.instagram)

  if (!hit) {
    throw new Error(`No instagram found near "${event.place}"`)
  }

  const cities = await getDocs(
    db.collection('cities').where('location.place_id', '==', hit.place)
  )

  if (!cities.length) {
    throw new Error(`Community for place "${event.place}" not found`)
  }

  const city = cities[0]

  const igUsername = city.instagramUsername
  const igPassword = city.instagramPassword

  if (!igUsername) {
    throw new Error(`Instagram is not available yet for ${city.name}`)
  }

  const hashtags = [event.eventType, ...Object.keys(event.styles)]
    .map((tag) => `#${tag}`)
    .join(' ')

  const name = event.name || ''
  const description = event.description || ''
  const venue = event.venue?.name || ''
  const price = event.price || ''
  const specialOffer = event.specialOffer || ''

  const mentionsList = [getMention(event.org?.instagram)]

  for (const artist of event.artists) {
    mentionsList.push(getMention(artist?.instagram))
  }

  const mentions = mentionsList.join(' ')

  const photo = event.socialCover

  let caption = ''

  if (specialOffer) {
    caption += `🔥${specialOffer}\n\n`
  }

  caption += `${name}\n`
  caption += `📍${venue}\n`
  caption += `💰${price}\n`
  caption += `\n`
  caption += `${description}\n`
  caption += `\n`
  caption += `👉 See link in bio\n`
  caption += `\n`
  caption += mentions
  caption += `\n\n`
  caption += hashtags

  const response = await axios.get(photo, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data, 'utf-8')

  const file = await pngToJpeg({ quality: 90 })(buffer)

  const ig = new IgApiClient()
  ig.state.generateDevice(igUsername)

  try {
    await ig.account.login(igUsername, igPassword)
  } catch (e) {
    const error: any = e
    if (
      error.response &&
      error.response.body &&
      error.response.body.error_type
    ) {
      const error_type = error.response.body.error_type

      if (error_type === 'checkpoint_challenge_required') {
        await ig.challenge.auto(true)
      } else {
        throw error
      }
    } else {
      throw error
    }
  }

  const publishResult = await ig.publish.photo({
    // read the file into a Buffer
    file,
    // optional, default ''
    caption,
    // optional
    // location: mediaLocation,
    // optional
    // usertags: {
    //   in: [
    //     // tag the user 'instagram' @ (0.5 | 0.5)
    //     await generateUsertagFromName('instagram', 0.5, 0.5),
    //   ],
    // },
  })

  const messageId = publishResult.media.code
  const messageUrl = 'https://instagram.com/p/' + publishResult.media.code

  return {
    messageId,
    messageUrl,
  }
}

export async function announceEventIG(event: any) {
  if (event.place !== 'ChIJ2V-Mo_l1nkcRfZixfUq4DAE') {
    throw new Error(
      `Instagram promotion is only available in Munich at the moment`
    )
  }

  const hashtags = [event.eventType, ...Object.keys(event.styles)]
    .map((tag) => `#${tag}`)
    .join(' ')

  const name = event.name || ''
  const description = event.description || ''
  const venue = event.venue?.name || ''
  const price = event.price || ''
  const specialOffer = event.specialOffer || ''

  const mentionsList = [getMention(event.org?.instagram)]

  for (const artist of event.artists) {
    mentionsList.push(getMention(artist?.instagram))
  }

  const mentions = mentionsList.join(' ')

  const photo = event.socialCover

  let caption = ''

  if (specialOffer) {
    caption += `🔥${specialOffer}\n\n`
  }

  caption += `${name}\n`
  caption += `📍${venue}\n`
  caption += `💰${price}\n`
  caption += `\n`
  caption += `${description}\n`
  caption += `\n`
  caption += `👉 See link in bio\n`
  caption += `\n`
  caption += mentions
  caption += `\n\n`
  caption += hashtags

  const response = await axios.get(photo, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data, 'utf-8')

  const file = await pngToJpeg({ quality: 90 })(buffer)

  const ig = new IgApiClient()
  ig.state.generateDevice(String(process.env.INSTAGRAM_MUNICH_USERNAME))

  await ig.account.login(
    String(process.env.INSTAGRAM_MUNICH_USERNAME),
    String(process.env.INSTAGRAM_MUNICH_PASSWORD)
  )

  const publishResult = await ig.publish.photo({
    // read the file into a Buffer
    file,
    // optional, default ''
    caption,
    // optional
    // location: mediaLocation,
    // optional
    // usertags: {
    //   in: [
    //     // tag the user 'instagram' @ (0.5 | 0.5)
    //     await generateUsertagFromName('instagram', 0.5, 0.5),
    //   ],
    // },
  })

  const messageId = publishResult.media.code
  const messageUrl = 'https://instagram.com/p/' + publishResult.media.code

  return {
    messageId,
    messageUrl,
  }
}

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

export async function importInstagramProfile(snapshot: DocumentSnapshot) {
  const profile = snapshot.data() as any

  if (!profile.instagram) {
    return
  }

  let instagram: any

  await snapshot.ref.update({
    import: 'importing',
    importError: '',
  })

  try {
    const username = profile.instagram.replace('https://instagram.com/', '')

    instagram = await getIgProfile(username)

    if (!instagram) {
      throw new Error('Instagram not found')
    }
  } catch (e) {
    await snapshot.ref.update({
      import: 'failed',
      importError: (e as Error).message,
    })

    return
  }

  let photo = ''

  if (instagram.hd_profile_pic_url_info.url) {
    const imageBuffer = (
      await axios.get(instagram.hd_profile_pic_url_info.url, {
        responseType: 'arraybuffer',
      })
    ).data
    const bucket = admin.storage().bucket()
    const filePath = 'share/' + profile.username + '.png'
    const file = bucket.file(filePath)

    await file.save(imageBuffer, {
      public: true,
    })

    const [metadata] = await file.getMetadata()

    photo = metadata.mediaLink
  }

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
    photo,
    visibility: 'Public',
  }

  await snapshot.ref.update(changes)
}
