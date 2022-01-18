import moment from 'moment-timezone'
import { useCollection } from '~/use/collection'

export const accountFields = [
  {
    name: 'name',
    key: 'account.name',
    required: true,
    event: true,
  },
  {
    name: 'email',
    key: 'account.email',
    register: true,
    required: true,
    event: true,
  },
  {
    name: 'password',
    type: 'password',
    key: 'account.password',
    register: true,
  },
  {
    name: 'phone',
    key: 'account.phone',
    required: true,
    event: true,
  },
  {
    name: 'zone',
    key: 'account.timezone',
    type: 'richselect',
    options: moment.tz.names(),
    require: true,
  },
  {
    name: 'newsletter',
    key: 'account.newsletter',
    type: 'multi',
    options: [
      {
        value: 'party',
        label: 'account.update.party',
      },
      {
        value: 'class',
        label: 'account.update.class',
      },
      {
        value: 'workshop',
        label: 'account.update.workshop',
      },
      {
        value: 'online',
        label: 'account.update.online',
      },
      {
        value: 'festival',
        label: 'account.update.festival',
      },
    ],
  },
  {
    name: 'comment',
    key: 'account.comment',
    type: 'text',
    event: true,
  },
  {
    name: 'withPartner',
    type: 'select',
    key: 'account.withPartner',
    options: ['account.yes', 'account.no'],
    event: false,
  },
  {
    name: 'partnerName',
    key: 'account.partnerName',
    when: (answers) => answers?.withPartner === 'Yes',
    event: false,
  },
  {
    name: 'partnerEmail',
    label: 'account.partnerEmail',
    when: (answers) => answers?.withPartner === 'Yes',
    event: false,
  },
]

export const useAccounts = () => {
  const { getById, find } = useCollection('accounts')

  const getAccount = (uid) => getById(uid) || {}
  const getAccountByEmail = (email) => find('email', email)

  return {
    getAccount,
    getAccountByEmail,
  }
}
