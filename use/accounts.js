import moment from 'moment-timezone'
import { useCollection } from '~/use/collection'

export const useAccounts = () => {
  const { getById, find } = useCollection('accounts')

  const getAccount = (uid) => getById(uid) || {}
  const getAccountByEmail = (email) => find('email', email)

  const accountFields = [
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
      label: 'New Password',
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
      label: 'Timezone',
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
          label: 'Social/party events',
        },
        {
          value: 'class',
          label: 'Dance classes',
        },
        {
          value: 'workshop',
          label: 'Workshops and bootcamps',
        },
        {
          value: 'online',
          label: 'Online dance classes',
        },
        {
          value: 'festival',
          label: 'International festivals',
        },
      ],
    },
    {
      name: 'comment',
      label: 'Comment',
      type: 'text',
      event: true,
    },
    {
      name: 'withPartner',
      type: 'select',
      label: 'Do you have a partner?',
      options: ['Yes', 'No'],
      event: false,
    },
    {
      name: 'partnerName',
      label: "Partner's name",
      when: (answers) => answers?.withPartner === 'Yes',
      event: false,
    },
    {
      name: 'partnerEmail',
      label: "Partner's email",
      when: (answers) => answers?.withPartner === 'Yes',
      event: false,
    },
  ]

  return {
    getAccount,
    getAccountByEmail,
    accountFields,
  }
}
