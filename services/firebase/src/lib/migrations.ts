import axios from 'axios'
import { firestore as db } from '../firebase'

export async function getDocs(collection: FirebaseFirestore.Query) {
  return (await collection.get()).docs.map(
    (doc) =>
      ({
        ...doc.data(),
        id: doc.id,
      } as any)
  )
}

export async function migrateFavs() {
  const posts = await getDocs(db.collection('posts'))

  for (const post of posts) {
    const savedBy = post.savedBy || {}

    const before = Object.keys(savedBy).length

    const responses = await getDocs(
      db.collection('participants').where('eventId', '==', post.id)
    )

    for (const r of responses) {
      if (r.collection === 'posts' && r.rsvp === 'up') {
        savedBy[r.uid] = true
      }
    }

    delete savedBy['null']

    const after = Object.keys(savedBy).length

    await db
      .collection('posts')
      .doc(post.id)
      .update({ savedBy })

    console.log({ title: post.title, before, after })
  }
}

export async function migrateUsernames() {
  const posts = await getDocs(db.collection('posts'))

  for (const post of posts) {
    const username = (
      await db
        .collection('profiles')
        .doc(post.createdBy)
        .get()
    ).data()?.username

    if (username) {
      await db
        .collection('posts')
        .doc(post.id)
        .update({ username })
    }

    console.log({ type: 'post', title: post.title, username, id: post.id })
  }

  const events = await getDocs(db.collection('events'))

  for (const event of events) {
    const username = (
      await db
        .collection('profiles')
        .doc(event.createdBy)
        .get()
    ).data()?.username

    if (username) {
      await db
        .collection('events')
        .doc(event.id)
        .update({ username })
    }

    console.log({ type: 'event', name: event.name, username, id: event.id })
  }
}

export async function migrateShares() {
  const shares = (
    await getDocs(db.collection('shares').where('collection', '==', 'profiles'))
  ).map((i) => i.contentId)

  const profiles = await getDocs(
    db.collection('profiles').where('permission', '==', 'Yes')
  )

  for (const profile of profiles) {
    if (shares.includes(profile.id)) {
      console.log('skipped', profile.username)
      continue
    }

    if (!profile.place) {
      console.log('missing city', profile.username)
      continue
    }

    console.log('add', profile.username)
    await generateSocialCover(profile)
  }
}

function getChatId(to: string, from: string) {
  const list = [to, from]
  return list.sort((a, b) => ('' + a).localeCompare(b)).join('-')
}

function getDate(date: any) {
  if (date?.toDate) {
    return date.toDate()
  }

  return 0
}

export async function chatNotifications() {
  const lastHour = Date.now() - 60000 * 60

  console.log('Messages sent after', new Date(lastHour))

  const chats = await getDocs(
    db.collection('chats').where('lastMessageAt', '>', lastHour)
  )

  const notifications = {} as any

  for (const chat of chats) {
    delete chat.members[chat.lastMessageBy]
    const to = Object.keys(chat.members)[0]
    notifications[to] = true
  }

  console.log(notifications)
}

export async function migrateChat() {
  const matches = await getDocs(db.collection('matches').orderBy('createdAt'))

  const chats = {} as any

  for (const match of matches) {
    const chatId = getChatId(match.to, match.from)
    if (match.to === match.from) {
      continue
    }

    chats[chatId] = chats[chatId] || {
      createdAt: match.createdAt,
      createdBy: match.createdBy,
      members: {
        [match.from]: true,
        [match.to]: true,
      },
      migration: 'matches210603',
    }

    chats[chatId].lastMessage = match.message
    chats[chatId].lastMessageBy = match.from
    chats[chatId].lastMessageAt = match.createdAt
    chats[chatId].lastSeen = chats[chatId].lastSeen || {
      [match.from]: 0,
      [match.to]: 0,
    }

    chats[chatId].lastSeen[match.from] = match.createdAt

    const clickedDate = match.recipients
      ? getDate(match.recipients[match.to].clickedAt)
      : 0

    if (clickedDate) {
      chats[chatId].lastSeen[match.to] = clickedDate
    }

    chats[chatId].messages = chats[chatId].messages || []
    chats[chatId].messages.push({
      text: match.message,
      createdBy: match.from,
      createdAt: match.createdAt,
    })
  }

  const chatIds = Object.keys(chats)

  for (const chatId of chatIds) {
    const chat = chats[chatId]

    console.log(chatId, chat)

    await db
      .collection('chats')
      .doc(chatId)
      .set(chat)
  }
}

export async function generateSocialCover(profile: any) {
  const result = await axios.get(
    `https://us-central1-wedance-4abe3.cloudfunctions.net/hooks/share/${profile.username}?timezone=Europe/Berlin`
  )

  const socialCover = result.data.url

  await db
    .collection('profiles')
    .doc(profile.id)
    .update({
      socialCover,
    })
}

export async function updateEventPoster(event: any) {
  const result = await axios.get(
    `https://us-central1-wedance-4abe3.cloudfunctions.net/hooks/share/events/${event.id}?timezone=Europe/Berlin`
  )

  const socialCover = result.data.url

  await db
    .collection('posts')
    .doc(event.id)
    .update({
      socialCover,
    })
}
