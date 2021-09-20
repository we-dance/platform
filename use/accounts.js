import moment from 'moment-timezone'
import { useCollection } from '~/use/collection'

export const accountFields = [
  {
    name: 'name',
    key: 'account.name',
    required: true,
    event: true
  },
  {
    name: 'email',
    key: 'account.email',
    register: true,
    validations: {
      required: true,
      email: true
    },
    required: true,
    event: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'New Password',
    register: true,
    validations: {
      required: true,
      minLength: 8
    }
  },
  {
    name: 'phone',
    key: 'account.phone',
    required: true,
    event: true
  },
  {
    name: 'zone',
    label: 'Timezone',
    type: 'richselect',
    options: moment.tz.names(),
    require: true
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
  },
  {
    name: 'withPartner',
    type: 'select',
    label: 'Do you have a partner?',
    options: ['Yes', 'No'],
    event: true
  },
  {
    name: 'partnerName',
    label: "Partner's name",
    when: (answers) => answers?.withPartner === 'Yes',
    event: true
  },
  {
    name: 'partnerEmail',
    label: "Partner's email",
    when: (answers) => answers?.withPartner === 'Yes',
    event: true
  }
]

export const useAccounts = () => {
  const { getById, find } = useCollection('accounts')

  const getAccount = (uid) => getById(uid) || {}
  const getAccountByEmail = (email) => find('email', email)

  return {
    getAccount,
    getAccountByEmail
  }
}
