import 'dotenv/config'
import { readFiles } from '../utils/filesystem'
import { firestore } from '../firebase'

export function getEvents() {
  const backupPath = String(process.env.BACKUP_PATH)
  return readFiles(backupPath + '/posts').filter((p: any) => p.type === 'event')
}

export async function restoreEvent(id: string) {
  const events = getEvents()
  const event = events.find((e: any) => e.id === id)
  await firestore
    .collection('posts')
    .doc(id)
    .set(event)
}
