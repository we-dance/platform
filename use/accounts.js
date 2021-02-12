import useCollection from '~/use/collection'

export default () => {
  const { getById, find } = useCollection('accounts')

  const getAccount = (uid) => getById(uid) || {}
  const getAccountByEmail = (email) => find('email', email)

  const accountFields = [
    {
      name: 'name',
      key: 'account.name',
      required: true,
      placeholder: '(Required)'
    },
    {
      name: 'email',
      key: 'account.email',
      required: true,
      placeholder: '(Required)'
    },
    {
      name: 'phone',
      key: 'account.phone',
      required: true,
      placeholder: '(Required)'
    },
    {
      name: 'newsletter',
      key: 'account.newsletter',
      type: 'multi',
      options: [
        {
          value: 'party',
          label: 'Social/party events'
        },
        {
          value: 'class',
          label: 'Dance classes'
        },
        {
          value: 'workshop',
          label: 'Workshops and bootcamps'
        },
        {
          value: 'online',
          label: 'Online dance classes'
        },
        {
          value: 'festival',
          label: 'International festivals'
        }
      ]
    }
  ]

  return {
    getAccount,
    accountFields,
    getAccountByEmail
  }
}
