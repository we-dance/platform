import useCollection from '~/use/collection'

export default () => {
  const { getById } = useCollection('accounts')

  const getAccount = (uid) => getById(uid) || {}

  return {
    getAccount
  }
}
