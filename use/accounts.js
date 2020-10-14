import useCollection from '~/use/collection'

export default () => {
  const { getById, find } = useCollection('accounts')

  const getAccount = (uid) => getById(uid) || {}
  const getAccountByEmail = (email) => find('email', email)

  const accountFields = [
    {
      name: 'name',
      label: 'Full Name',
      required: true,
      placeholder: '(Required)'
    },
    {
      name: 'email',
      label: 'Email',
      required: true,
      placeholder: '(Required)'
    },
    {
      name: 'phone',
      label: 'Phone',
      required: true,
      placeholder: '(Required)'
    }
  ]

  return {
    getAccount,
    accountFields,
    getAccountByEmail
  }
}
