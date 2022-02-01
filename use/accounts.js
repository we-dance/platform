import moment from 'moment-timezone'
import { useCollection } from '~/use/collection'
import { useI18n } from '~/use/i18n'
import { useCommon } from '~/use/common'

export const useAccounts = () => {
  const { t } = useI18n()
  const { getById, find } = useCollection('accounts')
  const { yesNoOptions } = useCommon()

  const getAccount = (uid) => getById(uid) || {}
  const getAccountByEmail = (email) => find('email', email)

  const accountFields = [
    {
      name: 'name',
      label: t('account.name'),
      required: true,
      event: true,
    },
    {
      name: 'email',
      label: t('account.email'),
      register: true,
      required: true,
      event: true,
    },
    {
      name: 'password',
      type: 'password',
      label: t('account.password'),
      register: true,
    },
    {
      name: 'phone',
      label: t('account.phone'),
      required: true,
      event: true,
    },
    {
      name: 'zone',
      label: t('account.zone'),
      component: 'TRichSelect',
      options: moment.tz.names(),
      require: true,
    },
    {
      name: 'newsletter',
      label: t('account.newsletter.label'),
      component: 'TInputMulti',
      options: [
        {
          value: 'party',
          label: t('account.newsletter.options.party'),
        },
        {
          value: 'class',
          label: t('account.newsletter.options.class'),
        },
        {
          value: 'workshop',
          label: t('account.newsletter.options.workshop'),
        },
        {
          value: 'online',
          label: t('account.newsletter.options.online'),
        },
        {
          value: 'festival',
          label: t('account.newsletter.options.festival'),
        },
      ],
    },
    {
      name: 'comment',
      label: t('account.comment'),
      type: 'text',
      event: true,
    },
    {
      name: 'withPartner',
      component: 'TInputSelect',
      label: t('account.withPartner.label'),
      options: yesNoOptions,
      event: false,
    },
    {
      name: 'partnerName',
      label: t('account.partnerName'),
      when: (answers) => answers?.withPartner === 'Yes',
      event: false,
    },
    {
      name: 'partnerEmail',
      label: t('account.partnerEmail'),
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
