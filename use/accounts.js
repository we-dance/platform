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
    },
    {
      name: 'newsletter',
      label: 'What kind of updated would you like to receive weekly?',
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
