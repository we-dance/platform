import { useComments } from '~/use/comments'
import { getExcerpt } from '~/utils'

export const useReactions = () => {
  const { getCommentsCount } = useComments()

  const map = (item) => {
    if (!item) {
      return {}
    }

    const upVotes = 0
    const downVotes = 0
    const votes = upVotes - downVotes
    const response = 'up'
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
