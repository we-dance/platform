import { useRsvp } from '~/use/rsvp'
import { useComments } from '~/use/comments'
import { getExcerpt } from '~/utils'

export const useReactions = () => {
  const { getCount, getRsvpResponse } = useRsvp()
  const { getCommentsCount } = useComments()

  const map = (item) => {
    if (!item) {
      return {}
    }

    const upVotes = getCount(item.id, 'up')
    const downVotes = getCount(item.id, 'down')
    const votes = upVotes - downVotes
    const response = getRsvpResponse(item.id)
    const multi = !response ? 3 : response === 'up' ? 2 : 1
    const order = multi * 100 + votes
    const commentsCount = getCommentsCount(item.id)
    const excerpt = getExcerpt(item.description)

    let tags = item.tags || {}

    tags = {
      ...tags,
      WeDance: true,
      Dance: true,
    }

    const keywords = Object.keys(tags).join(', ')

    return {
      ...item,
      excerpt,
      keywords,
      commentsCount,
      upVotes,
      downVotes,
      votes,
      response,
      order,
    }
  }

  return {
    map,
  }
}
