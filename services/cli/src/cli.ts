import axios from 'axios'
import { db, admin } from './firebase'
import { getIgProfile } from './lib/instagram'

require('dotenv').config()

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const owners = {} as any

async function logProfile(profile: any) {
  const createdAt = new Date(profile.createdAt)
  const lastLoginAt = new Date(profile.lastLoginAt)

  if (!owners[profile.createdBy]) {
    owners[profile.createdBy] = (
      await db
        .collection('accounts')
        .doc(profile.createdBy)
        .get()
    ).data()
  }
  const owner = owners[profile.createdBy]
  console.log(
    profile.username,
    profile.daysUsed,
    createdAt.toLocaleDateString(),
    lastLoginAt.toLocaleDateString(),
    owner.email
  )
}

yargs(hideBin(process.argv))
  .command(
    'check:usernames',
    'Check usernames',
    () => undefined,
    async () => {
      const profiles = await db.collection('profiles').get()
      const missingUsername = []
      const usernames = {} as any

      for (const profileRef of profiles.docs) {
        const profile = profileRef.data()

        if (!profile.username) {
          missingUsername.push(profileRef.id)
          continue
        }

        const username = profile.username.toLowerCase().trim()
        if (usernames[username]) {
          const first = usernames[username]
          console.log()
          await logProfile(profile)
          await logProfile(first)
        }

        usernames[username] = profile
      }

      console.log(`${missingUsername.length} profiles are missing usernames`)
    }
  )
  .command(
    'fix:contacts',
    'Fix social links',
    () => undefined,
    async () => {
      const profiles = await db.collection('profiles').get()
      const total = profiles.docs.length
      let changed = 0

      for (const profileRef of profiles.docs) {
        const profile = profileRef.data()

        const logs = []

        const fields = [
          'website',
          'couchsurfing',
          'airbnb',
          'blablacar',
          'whatsapp',
          'telegram',
          'instagram',
          'tiktok',
          'youtube',
          'twitter',
          'facebook',
        ]

        for (const field of fields) {
          if (profile[field] && !profile[field].includes('://')) {
            const oldValue = profile[field]
            let newValue = profile[field].replace(' ', '')

            if (field === 'website') {
              newValue = 'https://' + newValue
            }

            if (field === 'telegram') {
              newValue = 'https://t.me/' + newValue
            }

            if (field === 'instagram') {
              newValue = 'https://instagram.com/' + newValue
            }

            if (field === 'tiktok') {
              newValue = 'https://tiktok.com/' + newValue
            }

            if (field === 'youtube') {
              newValue = 'https://youtube.com/' + newValue
            }

            if (field === 'twitter') {
              newValue = 'https://twitter.com/' + newValue
            }

            if (field === 'facebook') {
              newValue = 'https://facebook.com/' + newValue
            }

            if (field === 'whatsapp') {
              newValue = 'https://wa.me/' + newValue
            }

            profileRef.ref.update({
              [field]: newValue,
            })

            logs.push(`${field}: "${oldValue}" to ${newValue}`)
          }
        }

        if (logs.length) {
          changed++
          console.log()
          console.log(`https://wedance.vip/${profile.username}`)
          for (const log of logs) {
            console.log(`- ${log}`)
          }
        }
      }

      const progress = Math.round((changed / total) * 100)

      console.log()
      console.log(`${progress}% changed - ${changed} of ${total}`)
    }
  )
  .command(
    'check:fan',
    'Check fan pages',
    () => undefined,
    async () => {
      const profiles = await db
        .collection('profiles')
        .where('type', '==', 'FanPage')
        .get()
      for (const profileRef of profiles.docs) {
        const profile = profileRef.data()

        const owner = (
          await db
            .collection('profiles')
            .doc(profile.createdBy)
            .get()
        ).data()

        if (!owner) {
          console.log(`Owner of ${profile.username} not found`)
          continue
        }

        console.log(`${profile.username} by ${owner.username}`)
      }
    }
  )
  .command(
    'rename <old> [new]',
    'Change profiles username or delete',
    () => undefined,
    async (argv: any) => {
      const profiles = await db
        .collection('profiles')
        .where('username', '==', argv.old)
        .get()

      for (const profileRef of profiles.docs) {
        const profile = profileRef.data()

        const owner = (
          await db
            .collection('profiles')
            .doc(profile.createdBy)
            .get()
        ).data()

        if (!owner) {
          console.log(`Owner of ${profile.username} not found`)
          continue
        }

        if (!argv.new) {
          console.log(profile, owner)
        }

        if (argv.new === 'delete') {
          await profileRef.ref.delete()

          console.log(
            `Deleted ${profile.username} id: ${profileRef.id} created by ${owner.username}`
          )
        }
      }
    }
  )
  .command(
    'import:instagram [username]',
    'Import instagram profiles',
    () => undefined,
    async (argv: any) => {
      let profiles
      const imported = {} as any

      if (argv.username) {
        profiles = await db
          .collection('profiles')
          .where('username', '==', argv.username)
          .get()
      } else {
        profiles = await db
          .collection('profiles')
          .where('import', '==', 'requested')
          .get()
      }

      if (!profiles.docs.length) {
        console.log('No profiles to import')
        return
      }

      console.log(`Importing ${profiles.docs.length} profiles`)

      let current = 0
      for (const profileRef of profiles.docs) {
        const profile = profileRef.data()

        console.log(``)
        console.log(`---`)
        current++

        if (!profile?.instagram) {
          continue
        }

        console.log(
          `${current} of ${profiles.docs.length} - importing ${profile.instagram}`
        )

        const owner = (
          await db
            .collection('profiles')
            .doc(profile.createdBy)
            .get()
        ).data()

        if (!owner) {
          console.log(`Owner of ${profile.username} not found`)
          continue
        }

        console.log(`Added by ${owner?.username}`)

        if (profile.instagram) {
          if (imported[profile.instagram]) {
            await profileRef.ref.delete()
            console.log(`Deleted duplicate profile ${profile.instagram}`)
            continue
          }

          imported[profile.instagram] = true

          let instagram

          try {
            instagram = await getIgProfile(
              profile.instagram.replace('https://instagram.com/', '')
            )
            if (!instagram) {
              throw new Error('Instagram not found')
            }
          } catch (e) {
            console.log(`[status] failed`)
            console.log((e as any).message)

            await profileRef.ref.update({ import: 'failed' })

            continue
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

          await profileRef.ref.update(changes)
          console.log(
            `[status] success - https://wedance.vip/${profile.username}`
          )
          console.log(`• name: ${changes.name}`)
          console.log(`• bio: ${changes.bio}`)
          console.log(`• website: ${changes.website}`)
          console.log(``)
        }
      }
    }
  )
  .help('h')
  .alias('h', 'help')
  .strict().argv
