import useDoc from '~/use/doc'
import useCollection from '~/use/collection'

export default () => {
  const { docs, loading } = useCollection('comments')
  const { create } = useDoc('comments')

  function getComments(postId) {
    return docs.value.filter((item) => item.postId === postId)
  }

  const getCommentsCount = (postId) => getComments(postId).length

  async function addComment(postId, comment) {
    await create({
      postId,
      body: comment
    })
  }

  return {
    addComment,
    getComments,
    getCommentsCount,
    loading
  }
}
