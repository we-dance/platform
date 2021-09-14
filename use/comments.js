import { useDoc } from '~/use/doc'
import { useCollection } from '~/use/collection'

export const useComments = () => {
  const { docs, loading } = useCollection('comments')
  const { create } = useDoc('comments')

  function getComments(postId) {
    return docs.value.filter((item) => item.postId === postId)
  }

  const getCommentsCount = (postId) => getComments(postId).length

  async function addComment(postId, commentId, body) {
    await create({
      postId,
      commentId,
      body,
    })
  }

  return {
    addComment,
    getComments,
    getCommentsCount,
    loading,
  }
}
