import axios from 'axios'
import { db, admin } from './firebase'
import { getInstagram } from './lib/browser'

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const owners = {} as any

async function logProfile(profile: any) {
  const createdAt = new Date(profile.createdAt)
  const lastLoginAt = new Date(profile.lastLoginAt)

  if (!owners[profile.createdBy]) {
    owners[profile.createdBy] = (
      await db.collection('accounts').doc(profile.createdBy).get()
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
    'check:social',
    'Check social links',
    () => undefined,
    async () => {
      const profiles = await db.collection('profiles').get()
      for (const profileRef of profiles.docs) {
        const profile = profileRef.data()

        if (profile.instagram) {
          if (
            profile.instagram.includes('https://') ||
            profile.instagram.includes(' ')
          ) {
            console.log(`${profile.username} instagram: "${profile.instagram}"`)
          }
        }

        if (profile.facebook) {
          if (
            profile.facebook.includes('https://') ||
            profile.facebook.includes(' ')
          ) {
            console.log(`${profile.username} facebook: "${profile.facebook}"`)
          }
        }
      }
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
          await db.collection('profiles').doc(profile.createdBy).get()
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
          await db.collection('profiles').doc(profile.createdBy).get()
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
          .where('instagram', '==', argv.username)
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

      for (const profileRef of profiles.docs) {
        const profile = profileRef.data()

        if (!profile) {
          continue
        }

        const owner = (
          await db.collection('profiles').doc(profile.createdBy).get()
        ).data()

        if (!owner) {
          console.log(`Owner of ${profile.username} not found`)
          continue
        }

        if (profile.instagram) {
          if (imported[profile.instagram]) {
            await profileRef.ref.delete()
            console.log(`Deleted duplicate profile ${profile.instagram}`)
            continue
          }

          imported[profile.instagram] = true

          const instagram = await getInstagram(profile.instagram)

          if (!instagram) {
            const error = 'Instagram not found'

            console.log(
              `${profile.username} added by ${owner.username} failed: ${error}`
            )

            await profileRef.ref.update({
              import: 'failed',
            })
            continue
          }

          let photo = ''

          if (instagram.profile_pic_url_hd) {
            const imageBuffer = (
              await axios.get(instagram.profile_pic_url_hd, {
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
            name: instagram.full_name || instagram.username,
            bio: instagram.bio || '',
            type: 'FanPage',
            import: 'success',
            instagram: instagram.username,
            website: instagram.external_url || '',
            photo,
            visibility: 'Public',
          }

          await profileRef.ref.update(changes)
          console.log(
            `${profile.username} by ${owner.username}: imported from Instagram`
          )
          console.log(` name: ${changes.name}`)
          console.log(` bio: ${changes.bio}`)
          console.log(` website: ${changes.website}`)
          console.log(``)
        }
      }
    }
  )
  .help('h')
  .alias('h', 'help')
  .strict().argv
