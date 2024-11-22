import 'dotenv/config'
import { readFiles } from '../utils/filesystem'

function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // substitution
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1 // insertion
        )
      }
    }
  }
  return dp[m][n]
}

function getSimilarity(name1: string, name2: string): number {
  const n1 = name1.toLowerCase().trim()
  const n2 = name2.toLowerCase().trim()

  // If strings are identical after normalization
  if (n1 === n2) return 1

  // Calculate similarity score (0 to 1)
  const maxLength = Math.max(n1.length, n2.length)
  const distance = levenshteinDistance(n1, n2)
  const similarity = 1 - distance / maxLength

  // return similarity >= threshold
  return similarity
}

export function getEvents() {
  const backupPath = String(process.env.BACKUP_PATH)
  return readFiles(backupPath + '/posts').filter((p: any) => p.type === 'event')
}

export async function duplicates() {
  const now = +new Date()
  const events = getEvents()
  const withHash = events.filter((e: any) => e.hash && e.startDate > now)
  const hashGroups = new Map<string, any[]>()

  for (const event of withHash) {
    const hash = event.hash
    if (!hashGroups.has(hash)) {
      hashGroups.set(hash, [])
    }
    hashGroups.get(hash)?.push(event)
  }

  const duplicates = Array.from(hashGroups.entries()).filter(
    ([_, events]) => events.length > 1
  )

  for (const [hash, events] of duplicates) {
    const similarity = getSimilarity(events[0].name, events[1].name)
    // if (similarity < 0.5 || similarity === 1) {
    if (similarity < 1) {
      continue
    }

    console.log('\nHash:', hash, similarity)

    for (const event of events) {
      const startDate = new Date(event.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
      console.log('-', event.id, '|', event.name, '|', startDate)
    }
  }

  console.log('Total events:', events.length)
  console.log('Events with hash:', withHash.length)
  console.log('Groups with duplicates:', duplicates.length)
}
